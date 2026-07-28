import { BookingRepository } from "../repositories/index.ts";
import {
  CreateBookingInput,
  ApproveBookingInput,
  RejectBookingInput,
  BookingsFilterInput,
} from "../dto/index.ts";
import { Employee, Booking, BookingStatus, Equipment, AuditLog, AuditAction } from "../entities/index.ts";
import { FindOptionsWhere } from "typeorm";
import { AppError, ConflictError, NotFoundError } from "../errors/AppErrors.ts";
import AppDataSource from "../config/db.ts";
import { sendMail } from "../jobs/emailService.ts";
import { Server } from "socket.io";
import { dispatchSystemNotification } from "../sockets/notification.socket.ts";

export class BookingService {
  private bookingRepo = new BookingRepository();

  async createBooking(input: CreateBookingInput, user: Employee, io: Server) {
    if (new Date(input.startTime) >= new Date(input.endTime)) {
      throw new AppError(
        "Start time must be before end time.",
        400,
        "BAD_USER_INPUT",
      );
    }

    const { savedBooking, room, managers } = await AppDataSource.transaction(
      async (transactionalManager) => {
        const repo = new BookingRepository(transactionalManager);

        const room = await repo.findRoomWithBookings(input.meetingRoomId);
        if (!room) {
          throw new NotFoundError("Meeting Room");
        }
        if (!room.isActive) {
          throw new AppError(
            "Meeting Room is not active",
            400,
            "ROOM_INACTIVE",
          );
        }
        if (room.capacity < input.numberOfAttendees) {
          throw new AppError(
            `Meeting Room only have capacity of ${room.capacity}`,
            400,
            "CAPACITY_EXCEEDED",
          );
        }

        const checkOverlapping = await repo.findOverlappingBooking(
          input.meetingRoomId,
          input.startTime,
          input.endTime,
        );
        if (checkOverlapping) {
          throw new ConflictError(
            "Meeting room is already booked for this time period"
          );
        }

        const requestedEquipments: Equipment[] = [];
        if (input.equipmentRequested && input.equipmentRequested.length > 0) {
          for (const eqObj of input.equipmentRequested) {
            const equipment = await repo.findEquipmentById(eqObj.equipId);
            if (!equipment) {
              throw new NotFoundError(`Equipment ID ${eqObj.equipId}`);
            }
            if (!equipment.isActive) {
              throw new AppError(
                `Equipment ${equipment.name} is inactive`,
                400,
                "EQUIPMENT_INACTIVE",
              );
            }
            if (eqObj.quantity < 0) {
              throw new AppError(
                "Equipment quantity requested cant be negative",
                400,
                "BAD_USER_INPUT",
              );
            }
            if (equipment.quantityAvailable < eqObj.quantity) {
              throw new AppError(
                `Equipment ${equipment.name} only has ${equipment.quantityAvailable} units available`,
                400,
                "INSUFFICIENT_STOCK",
              );
            }

            equipment.quantityAvailable -= eqObj.quantity;
            const savedEquipment = await repo.saveEntity(Equipment, equipment);
            requestedEquipments.push(savedEquipment);
          }
        }

        const newBooking = await repo.createBooking({
          startTime: input.startTime,
          endTime: input.endTime,
          purpose: input.purpose,
          numberOfAttendees: input.numberOfAttendees,
          status: BookingStatus.PENDING,
          employeeId: user.id,
          meetingRoomId: input.meetingRoomId,
          equipments: requestedEquipments,
        });

        const savedBooking = await repo.saveEntity(Booking, newBooking);

        await repo.saveEntity(AuditLog, {
          bookingId: savedBooking.id,
          action: AuditAction.BOOKING_CREATED,
          performedById: user.id,
          oldStatus: null,
          newStatus: BookingStatus.PENDING,
        });

        const managers = await transactionalManager
          .getRepository(Employee)
          .find({
            where: { userRoles: {
              role: {
                role_name: "manager"} 
              },
            }
          });

        return { savedBooking, room, managers };
      },
    );

    for (const manager of managers) {
      await dispatchSystemNotification(
        io,
        manager.id,
        "New Booking Activity",
        `Employee ${user.firstName} created a pending booking request for room ${room.name}.`,
        savedBooking.id,
      );
    }

    return savedBooking;
  }

  async cancelBooking(bookingId: number, user: Employee, io: Server) {
    const { updatedBooking, managers } = await AppDataSource.transaction(
      async (transactionalManager) => {
        const repo = new BookingRepository(transactionalManager);

        const booking = await repo.findBookingForCancellation(bookingId);
        if (!booking) {
          throw new NotFoundError("Booking");
        }
        if (booking.employeeId !== user.id) {
          throw new AppError(
            "You cannot cancel another employees booking",
            403,
            "FORBIDDEN",
          );
        }
        if (booking.status !== BookingStatus.PENDING) {
          throw new AppError(
            "Only pending bookings can be cancelled",
            400,
            "BAD_REQUEST"
          );
        }

        if (booking.equipments && booking.equipments.length > 0) {
          const equipMap = new Map<number, number>();

          for (const equip of booking.equipments) {
            const currentCount = equipMap.get(equip.id) || 0;
            equipMap.set(equip.id, currentCount + 1);
          }

          for (const [equipId, quantityToRestore] of equipMap) {
            const equipment = await repo.findEquipmentById(equipId);
            if (equipment) {
              equipment.quantityAvailable += quantityToRestore;
              await repo.saveEntity(Equipment, equipment);
            }
          }
        }

        const oldStatus = booking.status;
        booking.status = BookingStatus.CANCELLED;
        const updatedBooking = await repo.saveEntity(Booking, booking);

        await repo.saveEntity(AuditLog, {
          bookingId: updatedBooking.id,
          action: AuditAction.BOOKING_CANCELLED,
          performedById: user.id,
          oldStatus,
          newStatus: BookingStatus.CANCELLED,
        });

        const managers = await transactionalManager
          .getRepository(Employee)
          .find({
            where: { userRoles: {
              role: {
                role_name: "manager"} 
              },
            }
          });

        return { updatedBooking, managers };
      },
    );

    for (const manager of managers) {
      await dispatchSystemNotification(
        io,
        manager.id,
        "Booking Cancelled",
        `Employee ${user.firstName} has cancelled their booking request.`,
        updatedBooking.id,
      );
    }

    return updatedBooking;
  }

  async approveBooking(input: ApproveBookingInput, userId: number, io: Server) {
    const { updatedBooking, actionsToDispatch } =
      await AppDataSource.transaction(async (transactionalManager) => {
        const repo = new BookingRepository(transactionalManager);

        const booking = await repo.findBookingForResolution(input.bookingId);
        if (!booking) {
          throw new NotFoundError("Booking record");
        }
        if (booking.status !== BookingStatus.PENDING) {
          throw new AppError(
            "Only pending requests can be resolved",
            400,
            "BAD_REQUEST",
          );
        }

        const alreadyApproved = await repo.findOverlappingBooking(
          booking.meetingRoom.id,
          booking.startTime,
          booking.endTime,
        );
        if (alreadyApproved) {
          throw new ConflictError(
            "This room is already booked and approved for this time slot",
          );
        }

        const oldStatus = booking.status;
        booking.status = BookingStatus.APPROVED;
        const updatedBooking = await repo.saveEntity(Booking, booking);

        await repo.saveEntity(AuditLog, {
          bookingId: updatedBooking.id,
          action: AuditAction.BOOKING_APPROVED,
          performedById: userId,
          oldStatus,
          newStatus: BookingStatus.APPROVED,
        });

        const actionsToDispatch = {
          approvedNotification: {
            employeeId: booking.employeeId,
            roomName: booking.meetingRoom.name,
            bookingId: updatedBooking.id,
            email: booking.employee.email,
            location: booking.meetingRoom.location,
            startTime: booking.startTime,
            endTime: booking.endTime,
          },
          rejectedNotifications: [] as Array<{
            employeeId: number;
            roomName: string;
            bookingId: number;
            email: string;
            location: string;
            startTime: Date | string;
            endTime: Date | string;
            rejectionReason: string;
          }>,
        };

        const remainingBookings = await repo.findConflictingPendingBookings(
          booking.meetingRoom.id,
          updatedBooking.id,
          booking.startTime,
          booking.endTime,
        );

        for (const pendingBooking of remainingBookings) {
          const prevStatus = pendingBooking.status;
          pendingBooking.status = BookingStatus.REJECTED;
          pendingBooking.rejectionReason =
            "Another Booking is approved for same time slot";

          await repo.saveEntity(Booking, pendingBooking);

          await repo.saveEntity(AuditLog, {
            bookingId: pendingBooking.id,
            action: AuditAction.BOOKING_REJECTED,
            performedById: userId,
            oldStatus: prevStatus,
            newStatus: BookingStatus.REJECTED,
          });

          actionsToDispatch.rejectedNotifications.push({
            employeeId: pendingBooking.employeeId,
            roomName: pendingBooking.meetingRoom.name,
            bookingId: pendingBooking.id,
            email: pendingBooking.employee.email,
            location: pendingBooking.meetingRoom.location,
            startTime: pendingBooking.startTime,
            endTime: pendingBooking.endTime,
            rejectionReason: pendingBooking.rejectionReason,
          });
        }

        return { updatedBooking, actionsToDispatch };
      });

    const appv = actionsToDispatch.approvedNotification;

    await dispatchSystemNotification(
      io,
      appv.employeeId,
      "Booking Request Approved",
      `Your request for room ${appv.roomName} was approved.`,
      appv.bookingId,
    );

    sendMail(
      appv.email,
      "Booking Request Approved",
      `Your Booking Request is Approved for room - ${appv.roomName}, location - ${appv.location} at (${appv.startTime} to ${appv.endTime})`,
    );

    for (const rej of actionsToDispatch.rejectedNotifications) {
      await dispatchSystemNotification(
        io,
        rej.employeeId,
        "Booking Request Rejected",
        `Your request for ${rej.roomName} was rejected due to a scheduling conflict.`,
        rej.bookingId,
      );

      sendMail(
        rej.email,
        "Booking Request Reject",
        `Your Booking Request is Reject for room - ${rej.roomName}, location - ${rej.location} at (${rej.startTime} to ${rej.endTime}) because ${rej.rejectionReason}`,
      );
    }

    return updatedBooking;
  }

  async rejectBooking(input: RejectBookingInput, userId: number, io: Server){
    const { updatedBooking, notificationPayload } =
      await AppDataSource.transaction(async (transactionalManager) => {
        const repo = new BookingRepository(transactionalManager);

        const booking = await repo.findBookingForResolution(input.bookingId);
        if (!booking) {
          throw new NotFoundError("Booking record");
        }
        if (booking.status !== BookingStatus.PENDING) {
          throw new AppError(
            "Only pending requests can be resolved",
            400,
            "BAD_REQUEST",
          );
        }

        const oldStatus = booking.status;
        booking.status = BookingStatus.REJECTED;
        booking.rejectionReason = input.rejectionReason;
        const updatedBooking = await repo.saveEntity(Booking, booking);

        await repo.saveEntity(AuditLog, {
          bookingId: updatedBooking.id,
          action: AuditAction.BOOKING_REJECTED,
          performedById: userId,
          oldStatus,
          newStatus: BookingStatus.REJECTED,
        });

        const notificationPayload = {
          employeeId: booking.employeeId,
          roomName: booking.meetingRoom.name,
          location: booking.meetingRoom.location,
          startTime: booking.startTime,
          endTime: booking.endTime,
          email: booking.employee.email,
          rejectionReason: booking.rejectionReason,
        };

        return { updatedBooking, notificationPayload };
      });

    await dispatchSystemNotification(
      io,
      notificationPayload.employeeId,
      "Booking Request Rejected",
      `Your request for room ${notificationPayload.roomName} was rejected. Reason: ${input.rejectionReason}`,
      updatedBooking.id,
    );

    const to = `${notificationPayload.email}`;
    const subject = "Booking Request Reject";
    const text = `Your Booking Request is Reject for room - ${notificationPayload.roomName}, location - ${notificationPayload.location} at (${notificationPayload.startTime} to ${notificationPayload.endTime}) because ${notificationPayload.rejectionReason}`;

    sendMail(to, subject, text);

    return updatedBooking;
  }

  async getBookings(input: BookingsFilterInput){
    const { page, limit, bookingStatus, sortOrder } = input;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Booking> = {};

    if (bookingStatus) {
      whereConditions.status = bookingStatus;
    }

    const [bookings, totalCount] = await this.bookingRepo.findAndCountBookings(
      whereConditions,
      skip,
      limit,
      String(sortOrder)
    );

    return {
      data: bookings,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1
    };
  }

  async getBookingById(id: number){
    const booking = await this.bookingRepo.findByIdWithRelations(id);
    if (!booking) {
      throw new NotFoundError("Booking");
    }
    return booking;
  }

    async getOwnBookings(input: BookingsFilterInput, employeeId: number){
    const { page, limit, bookingStatus, sortOrder } = input;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Booking> = { employeeId };

    if (bookingStatus) {
      whereConditions.status = bookingStatus;
    }

    const [bookings, totalCount] = await this.bookingRepo.findAndCountBookings(
      whereConditions,
      skip,
      limit,
      String(sortOrder)
    );

    return {
      data: bookings,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1
    };
  }
}