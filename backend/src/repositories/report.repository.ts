import { EntityManager } from "typeorm";
import AppDataSource from "../config/db.ts";
import { Booking } from "../entities/Booking.ts";
import { Employee } from "../entities/Employee.ts";
import { Equipment } from "../entities/Equipment.ts";

export class ReportRepository {
  private manager: EntityManager;

  constructor(transactionalManager?: EntityManager) {
    this.manager = transactionalManager || AppDataSource.manager;
  }

  async getMostBookedRoomRaw(): Promise<any[]> {
    return this.manager.query(`
      SELECT count(b.id) as total, m.id, m.name  
      FROM bookings b
      JOIN meeting_room m ON m.id = b."meetingRoomId"
      GROUP BY m.id
      ORDER BY total DESC
      LIMIT 1
    `);
  }

  async findEmployeeById(id: number){
    return this.manager.findOne(Employee, { where: { id } });
  }

  async countBookingsByEmployeeId(employeeId: number){
    return this.manager.count(Booking, { where: { employeeId } });
  }

  async findEquipmentById(id: number){
    return this.manager.findOne(Equipment, { where: { id } });
  }

  async getEquipmentUsageCountRaw(equipmentId: number){
    return this.manager.query(
      `SELECT count(*) as count FROM booking_equipments WHERE "equipmentId" = $1;`,
      [equipmentId]
    );
  }

  async getMonthlyStatisticsRaw(month: number, year: number){
    return this.manager.query(
      `SELECT 
        count(*) as "totalBookings",
        count(CASE WHEN status = 'APPROVED' THEN 1 END) as "approvedBookings",
        count(CASE WHEN status = 'REJECTED' THEN 1 END) as "rejectedBookings"
       FROM bookings
       WHERE extract(month from "createdAt") = $1
         AND extract(year from "createdAt") = $2`,
      [month, year]
    );
  }
}
