import { MostBookedRoom, BookingsPerEmployee, EquipmentUsage, MonthlyBookingStatics,BookingsPerEmployeeInput, EquipmentUsageInput, MonthlyBookingStatisticsInput } from "../dto/index.ts";
import { ReportRepository } from "../repositories/index.ts";
import { AppError, NotFoundError } from "../errors/AppErrors.ts";

export class ReportService {
  private reportRepo = new ReportRepository();

  async getMostBookedRoom(): Promise<MostBookedRoom> {
    const result = await this.reportRepo.getMostBookedRoomRaw();
    if (!result || result.length === 0) {
      throw new AppError("No booking data available yet", 404, "NO_DATA_AVAILABLE");
    }
    
    return {
      name: result[0].name,
      total: Number(result[0].total) || 0
    };
  }

  async getBookingsPerEmployee(input: BookingsPerEmployeeInput): Promise<BookingsPerEmployee> {
    const emp = await this.reportRepo.findEmployeeById(input.empId);
    if (!emp) {
      throw new NotFoundError("Employee", "empId");
    }

    const bookingCount = await this.reportRepo.countBookingsByEmployeeId(input.empId);

    return {
      employeeName: emp.firstName,
      bookingCount
    };
  }

  async getEquipmentUsage(input: EquipmentUsageInput): Promise<EquipmentUsage> {
    const equipment = await this.reportRepo.findEquipmentById(input.equipId);
    if (!equipment) {
      throw new NotFoundError("Equipment", "equipId");
    }

    const result = await this.reportRepo.getEquipmentUsageCountRaw(input.equipId);
    const totalUsage = result.length > 0 ? Number(result[0].count) : 0;

    return {
      equipmentName: equipment.name,
      timesUsage: totalUsage
    };
  }

  async getMonthlyBookingStatistics(input: MonthlyBookingStatisticsInput): Promise<MonthlyBookingStatics> {
    const { month, year } = input;

    const result = await this.reportRepo.getMonthlyStatisticsRaw(month, year);
    if (!result || result.length === 0) {
      throw new AppError("No metrics recorded for the specified timeframe", 404, "NO_DATA_AVAILABLE", "month");
    }

    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = months[month - 1];

    return {
      month: monthName || "",
      totalBookings: Number(result[0].totalBookings) || 0,
      approvedBookings: Number(result[0].approvedBookings) || 0,
      rejectedBookings: Number(result[0].rejectedBookings) || 0
    };
  }
}