import { BookingRepository } from "../repositories/booking.repository.ts";
import { CreateBookingInput, ApproveBookingInput, RejectBookingInput, BookingsFilterInput } from "../dto/booking.input.ts";
import { Employee, Role } from "../entities/Employee.ts";
import { Booking, BookingStatus } from "../entities/Booking.ts";
import { Equipment } from "../entities/Equipment.ts";
import { AuditLog, AuditAction } from "../entities/AuditLog.ts";
import { FindOptionsWhere } from "typeorm";
import { AppError, ConflictError, NotFoundError } from "../errors/AppErrors.ts";
import AppDataSource from "../config/db.ts";
import { sendMail } from "../jobs/emailService.ts";
import { Server } from "socket.io";
import { dispatchSystemNotification } from "../sockets/notification.socket.ts";


export class BookingService {
  private bookingRepo = new BookingRepository();

  async createBooking(input: CreateBookingInput, user: Employee, io: Server){
    if (new Date(input.startTime) >= new Date(input.endTime)){
      throw new AppError("Start time must be before end time.", 400, "BAD_USER_INPUT");
    }

    return AppDataSource.transaction(async (transactionalManager) => {
      const repo = new BookingRepository(transactionalManager);

      const room = await repo.findRoomWithBookings(input.meetingRoomId);

      if (!room) {
        throw new NotFoundError("Meeting Room");
      }
      if (!room.isActive) {
        throw new AppError("Meeting Room is not active", 400, "ROOM_INACTIVE");
      }
      if (room.capacity < input.numberOfAttendees) {
        throw new AppError(`Meeting Room only have capacity of ${room.capacity}`, 400, "CAPACITY_EXCEEDED");
      }

      const checkOverlapping = await repo.findOverlappingBooking(
        input.meetingRoomId,
        input.startTime,
        input.endTime
      );
      if (checkOverlapping) {
        throw new ConflictError("Meeting room is already booked for this time period");
      }

      const requestedEquipments: Equipment[] = [];

      if (input.equipmentRequested && input.equipmentRequested.length > 0) {
        for (const eqObj of input.equipmentRequested) {
          const equipment = await repo.findEquipmentById(eqObj.equipId);
          if (!equipment) {
            throw new NotFoundError(`Equipment ID ${eqObj.equipId}`);
          }
          if (!equipment.isActive) {
            throw new AppError(`Equipment ${equipment.name} is inactive`, 400, "EQUIPMENT_INACTIVE");
          }
          if (eqObj.quantity < 0) {
            throw new AppError("Equipment quantity requested cant be negative", 400, "BAD_USER_INPUT");
          }
          if (equipment.quantityAvailable < eqObj.quantity) {
            throw new AppError(`Equipment ${equipment.name} only has ${equipment.quantityAvailable} units available`, 400, "INSUFFICIENT_STOCK");
          }

          equipment.quantityAvailable -= eqObj.quantity;
          const savedEquipment = await repo.saveEntity(Equipment, equipment);
          requestedEquipments.push(savedEquipment);
        }
      }

      const newBooking = repo.createBooking({
        startTime: input.startTime,
        endTime: input.endTime,
        purpose: input.purpose,
        numberOfAttendees: input.numberOfAttendees,
        status: BookingStatus.PENDING,
        employeeId: user.id,
        meetingRoomId: input.meetingRoomId,
        equipments: requestedEquipments
      });

      const savedBooking = await repo.saveEntity(Booking, newBooking);

      await repo.saveEntity(AuditLog, {
        bookingId: savedBooking.id,
        action: AuditAction.BOOKING_CREATED,
        performedById: user.id,
        oldStatus: null,
        newStatus: BookingStatus.PENDING
      });

      const managers = await transactionalManager.getRepository(Employee).find({
        where: { role: Role.MANAGER }
      });
      for (const manager of managers) {
        await dispatchSystemNotification(
          io,
          manager.id,
          "New Booking Activity",
          `Employee ${user.firstName} created a pending booking request for room ${room.name}.`,
          savedBooking.id
        );
      }

      return savedBooking;
    });
  }

  async cancelBooking(bookingId: number, user: Employee, io: Server){
    return AppDataSource.transaction(async (transactionalManager) => {
      const repo = new BookingRepository(transactionalManager);

      const booking = await repo.findBookingForCancellation(bookingId);
      if (!booking) {
        throw new NotFoundError("Booking");
      }
      if (booking.employeeId !== user.id) {
        throw new AppError("You cannot cancel another employees booking", 403, "FORBIDDEN");
      }
      if (booking.status !== BookingStatus.PENDING) {
        throw new AppError("Only pending bookings can be cancelled", 400, "BAD_REQUEST");
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
        newStatus: BookingStatus.CANCELLED
      });

      const managers = await transactionalManager.getRepository(Employee).find({
        where: { role: Role.MANAGER }
      });
      for (const manager of managers) {
        await dispatchSystemNotification(
          io,
          manager.id,
          "Booking Cancelled",
          `Employee ${user.firstName} has cancelled their booking request.`,
          updatedBooking.id
        );
      }

      return updatedBooking;
    });
  }

  async approveBooking(input: ApproveBookingInput, userId: number, io: Server){
    return await AppDataSource.transaction(async (transactionalManager) => {
      const repo = new BookingRepository(transactionalManager);
      
      const booking = await repo.findBookingForResolution(input.bookingId);
      if (!booking) {
        throw new NotFoundError("Booking record");
      }
      if (booking.status !== BookingStatus.PENDING) {
        throw new AppError("Only pending requests can be resolved", 400, "BAD_REQUEST");
      }

      const alreadyApproved = await repo.findOverlappingBooking(booking.meetingRoom.id, booking.startTime, booking.endTime);
      if (alreadyApproved) {
        throw new ConflictError("This room is already booked and approved for this time slot");
      }

      const oldStatus = booking.status;
      booking.status = BookingStatus.APPROVED;
      const updatedBooking = await repo.saveEntity(Booking, booking);

      await repo.saveEntity(AuditLog, {
        bookingId: updatedBooking.id,
        action: AuditAction.BOOKING_APPROVED,
        performedById: userId,
        oldStatus,
        newStatus: BookingStatus.APPROVED
      });

      await dispatchSystemNotification(
        io,
        booking.employeeId,
        "Booking Request Approved",
        `Your request for room ${booking.meetingRoom.name} was approved.`,
        updatedBooking.id
      );

      const remainingBookings = await repo.findConflictingPendingBookings(
        booking.meetingRoom.id, 
        updatedBooking.id, 
        booking.startTime, 
        booking.endTime
      );

      for (const pendingBooking of remainingBookings) {
        const prevStatus = pendingBooking.status;
        pendingBooking.status = BookingStatus.REJECTED;
        pendingBooking.rejectionReason = "Another Booking is approved for same time slot";

        await repo.saveEntity(Booking, pendingBooking);

        const to = `${pendingBooking.employee.email}`
        const subject = 'Booking Request Reject'
        const text = `Your Booking Request is Reject for room - ${pendingBooking.meetingRoom.name}, location - ${pendingBooking.meetingRoom.location} at (${pendingBooking.startTime} to ${pendingBooking.endTime}) becuase ${pendingBooking.rejectionReason}`

        sendMail(to, subject, text)

        await repo.saveEntity(AuditLog, {
          bookingId: pendingBooking.id,
          action: AuditAction.BOOKING_REJECTED,
          performedById: userId,
          oldStatus: prevStatus,
          newStatus: BookingStatus.REJECTED
        });

        await dispatchSystemNotification(
          io,
          pendingBooking.employeeId,
          "Booking Request Rejected",
          `Your request for ${pendingBooking.meetingRoom.name} was rejected due to a scheduling conflict.`,
          pendingBooking.id
        );
      }

      const to = `${booking.employee.email}`
      const subject = 'Booking Request Approved'
      const text = `Your Booking Request is Approved for room - ${booking.meetingRoom.name}, location - ${booking.meetingRoom.location} at (${booking.startTime} to ${booking.endTime})`

      sendMail(to, subject, text)

      return updatedBooking;
    });
  }

  async rejectBooking(input: RejectBookingInput, userId: number, io: Server){
    return await AppDataSource.transaction(async (transactionalManager) => {
      const repo = new BookingRepository(transactionalManager);

      const booking = await repo.findBookingForResolution(input.bookingId);
      if (!booking) {
        throw new NotFoundError("Booking record");
      }
      if (booking.status !== BookingStatus.PENDING) {
        throw new AppError("Only pending requests can be resolved", 400, "BAD_REQUEST");
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
        newStatus: BookingStatus.REJECTED
      });

      await dispatchSystemNotification(
        io,
        booking.employeeId, 
        "Booking Request Rejected",
        `Your request for room ${booking.meetingRoom.name} was rejected. Reason: ${input.rejectionReason}`,
        updatedBooking.id
      );

      const to = `${booking.employee.email}`
      const subject = 'Booking Request Reject'
      const text = `Your Booking Request is Reject for room - ${booking.meetingRoom.name}, location - ${booking.meetingRoom.location} at (${booking.startTime} to ${booking.endTime}) becuase ${booking.rejectionReason}`

      sendMail(to, subject, text)

      return updatedBooking;
    });
  }

  async getBookings(input: BookingsFilterInput){
    const { page, limit, bookingStatus } = input;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Booking> = {};
    let orderOptions: Record<string, "ASC" | "DESC"> = { id: "DESC" };

    if (bookingStatus) {
      whereConditions.status = bookingStatus;
      orderOptions = { createdAt: "DESC" };
    }

    const [bookings, totalCount] = await this.bookingRepo.findAndCountBookings(
      whereConditions,
      skip,
      limit,
      orderOptions
    );

    return {
      bookings,
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
    const { page, limit, bookingStatus } = input;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Booking> = { employeeId };
    let orderOptions: Record<string, "ASC" | "DESC"> = { id: "DESC" };

    if (bookingStatus) {
      whereConditions.status = bookingStatus;
      orderOptions = { createdAt: "DESC" };
    }

    const [bookings, totalCount] = await this.bookingRepo.findAndCountBookings(
      whereConditions,
      skip,
      limit,
      orderOptions
    );

    return {
      bookings,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1
    };
  }
}