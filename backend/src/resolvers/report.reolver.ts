import { Arg, Authorized, Query, Resolver } from "type-graphql";
import { MostBookedRoom, BookingsPerEmployee, EquipmentUsage, MonthlyBookingStatics, BookingsPerEmployeeInput, EquipmentUsageInput, MonthlyBookingStatisticsInput } from "../dto/report.input.ts";
import { ReportService } from "../services/report.service.ts";

@Resolver()
export class ReportResolver {
  private reportService = new ReportService();

  @Authorized()
  @Query(() => MostBookedRoom)
  async mostBookedRoom(){
    return await this.reportService.getMostBookedRoom();
  }

  @Authorized(["ADMIN", "MANAGER"])
  @Query(() => BookingsPerEmployee)
  async bookingsPerEmployee(
    @Arg("input", ()=>BookingsPerEmployeeInput) input: BookingsPerEmployeeInput
  ){
    return await this.reportService.getBookingsPerEmployee(input);
  }

  @Authorized(["ADMIN", "MANAGER"])
  @Query(() => EquipmentUsage)
  async equipmentUsage(
    @Arg("input", ()=>EquipmentUsageInput) input: EquipmentUsageInput
  ){
    return await this.reportService.getEquipmentUsage(input);
  }

  @Authorized(["MANAGER"])
  @Query(() => MonthlyBookingStatics)
  async monthlyBookingStatics(
    @Arg("input", ()=>MonthlyBookingStatisticsInput) input: MonthlyBookingStatisticsInput
  ){
    return await this.reportService.getMonthlyBookingStatistics(input);
  }
}