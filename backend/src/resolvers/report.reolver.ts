import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { MostBookedRoom, BookingsPerEmployee, EquipmentUsage, MonthlyBookingStatics, BookingsPerEmployeeInput, EquipmentUsageInput, MonthlyBookingStatisticsInput } from "../dto/index.ts";
import { ReportService } from "../services/index.ts";
import { PermissionMiddleware } from "../middleware/permission.middleware.ts";

@Resolver()
export class ReportResolver {
  private reportService = new ReportService();

  @Query(() => MostBookedRoom)
  @UseMiddleware(PermissionMiddleware("VIEW_MOST_BOOKED_ROOM"))
  async mostBookedRoom(){
    return await this.reportService.getMostBookedRoom();
  }

  @Query(() => BookingsPerEmployee)
  @UseMiddleware(PermissionMiddleware("VIEW_BOOKING_PER_EMPLOYEE"))
  async bookingsPerEmployee(
    @Arg("input", ()=>BookingsPerEmployeeInput) input: BookingsPerEmployeeInput
  ){
    return await this.reportService.getBookingsPerEmployee(input);
  }

  @Query(() => EquipmentUsage)
  @UseMiddleware(PermissionMiddleware("VIEW_EQUIPMENT_USAGE"))
  async equipmentUsage(
    @Arg("input", ()=>EquipmentUsageInput) input: EquipmentUsageInput
  ){
    return await this.reportService.getEquipmentUsage(input);
  }

  @Query(() => MonthlyBookingStatics)
  @UseMiddleware(PermissionMiddleware("VIEW_MONTHLY_STATICS"))
  async monthlyBookingStatics(
    @Arg("input", ()=>MonthlyBookingStatisticsInput) input: MonthlyBookingStatisticsInput
  ){
    return await this.reportService.getMonthlyBookingStatistics(input);
  }
}