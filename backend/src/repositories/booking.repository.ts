import { EntityManager, FindOptionsWhere, Not } from "typeorm";
import { LessThan, MoreThan } from "typeorm";
import { MeetingRoom, Booking, BookingStatus, Equipment } from "../entities/index.ts";
import { Manager } from "./index.ts";

export class BookingRepository extends Manager{
  constructor(manager?: EntityManager) {
    super(manager);
  }

  async findRoomWithBookings(roomId: number){
    return this.manager.findOne(MeetingRoom, {
      where: { id: roomId },
      relations: {
        bookings: {
          employee: true,
          equipments: true
        }
      }
    });
  }

  async findOverlappingBooking(roomId: number, startTime: Date, endTime: Date){
    return this.manager.findOne(Booking, {
      where: {
        meetingRoomId: roomId,
        status: BookingStatus.APPROVED,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime)
      }
    });
  }

  async findEquipmentById(id: number){
    return this.manager.findOne(Equipment, { where: { id } });
  }

  async findBookingForCancellation(id: number){
    return this.manager.findOne(Booking, {
      where: { id },
      relations: { equipments: true }
    });
  }

  async findBookingForResolution(id: number){
    return this.manager.findOne(Booking, {
      where: { id },
      relations: { employee: true, equipments: true, meetingRoom: true }
    });
  }

  async findConflictingPendingBookings(roomId: number, excludeId: number, startTime: Date, endTime: Date){
    return this.manager.find(Booking, {
      where: {
        id: Not(excludeId),
        meetingRoom: { id: roomId },
        status: BookingStatus.PENDING,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      }
    });
  }

  async createBooking(data: Partial<Booking>){
    return this.manager.create(Booking, data);
  }

  async saveEntity<T extends object>(entityClass: new () => T, data: Partial<T> | T): Promise<T> {
    return this.manager.save(entityClass, data as any);
  }

  async findByIdWithRelations(id: number){
    return this.manager.findOne(Booking, {
      where: { id },
      relations: {
        employee: true,
        meetingRoom: true,
        equipments: true
      }
    });
  }

  async findAndCountBookings(
    whereConditions: FindOptionsWhere<Booking>,
    skip: number,
    take: number,
    sortOrder: string
  ){
    return this.manager.findAndCount(Booking, {
      where: whereConditions,
      relations: {
        employee: true,
        meetingRoom: true,
        equipments: true
      },
      order: {createdAt: sortOrder as any},
      skip,
      take,
    });
  }
}
