import { EntityManager } from "typeorm";
import { Booking, Employee, Equipment } from "../entities/index.ts";
import { Manager } from "./index.ts";

export class ReportRepository extends Manager{
  constructor(manager?: EntityManager) {
    super(manager);
  }

  async getMostBookedRoomRaw(): Promise<any[]> {
    return this.manager
      .createQueryBuilder(Booking, "b")
      .select("COUNT(b.id)", "total")
      .addSelect("m.id", "id")
      .addSelect("m.name", "name")
      .innerJoin("meeting_room", "m", 'm.id = b."meetingRoomId"')
      .groupBy("m.id")
      .orderBy("total", "DESC")
      .limit(1)
      .getRawMany();
  }

  async findEmployeeById(id: number){
    return this.manager
    .createQueryBuilder(Employee, "employee")
    .where("employee.id = :id", { id })
    .getOne();
  }

  async countBookingsByEmployeeId(employeeId: number){
    const result =  await this.manager
        .createQueryBuilder(Booking, "booking")
        .select("COUNT(booking.id)", "count")
        .where('booking."employeeId" = :id', { id: employeeId })
        .getRawOne();
    return Number(result.count)
  }

  async findEquipmentById(id: number){
    return this.manager
        .createQueryBuilder(Equipment, "equipment")
        .where("equipment.id = :id", {id})
        .getOne();
  }

  async getEquipmentUsageCountRaw(equipmentId: number){
    return this.manager
      .createQueryBuilder()
      .select("COUNT(*)", "count")
      .from("booking_equipments", "be")
      .where('be."equipmentId" = :equipmentId', { equipmentId })
      .getRawMany();
  }

  async getMonthlyStatisticsRaw(month: number, year: number){
    return this.manager
      .createQueryBuilder(Booking, "b")
      .select("COUNT(*)", "totalBookings")
      .addSelect(`COUNT(CASE WHEN b.status = 'APPROVED' THEN 1 END)`, "approvedBookings")
      .addSelect(`COUNT(CASE WHEN b.status = 'REJECTED' THEN 1 END)`, "rejectedBookings")
      .where('EXTRACT(MONTH FROM b."createdAt") = :month', { month })
      .andWhere('EXTRACT(YEAR FROM b."createdAt") = :year', { year })
      .getRawMany();
  }
}
