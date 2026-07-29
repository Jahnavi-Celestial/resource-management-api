import { Field, InputType, Int, ObjectType } from "type-graphql";
import { CustomIsInt, CustomIsNotEmpty, CustomMax, CustomMin } from "../utils/customDecorators.ts";

@InputType()
export class BookingsPerEmployeeInput{
  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Employee ID cannot be empty" })
  @CustomIsInt({ message: "Employee ID must be an integer" })
  @CustomMin(1, { message: "Employee ID must be at least 1" })
  empId!: number;
}

@InputType()
export class EquipmentUsageInput{
  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Equipment ID cannot be empty" })
  @CustomIsInt({ message: "Equipment ID must be an integer" })
  @CustomMin(1, { message: "Equipment ID must be at least 1" })
  equipId!: number;
}

@InputType()
export class MonthlyBookingStatisticsInput{
  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Month cannot be empty" })
  @CustomIsInt({ message: "Month must be an integer" })
  @CustomMin(1, { message: "Month must be between 1 and 12" })
  @CustomMax(12, { message: "Month must be between 1 and 12" })
  month!: number;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Year cannot be empty" })
  @CustomIsInt({ message: "Year must be an integer" })
  @CustomMin(2000, { message: "Provide a valid historical or current year" })
  year!: number;
}

@ObjectType()
export class MostBookedRoom{
  @Field(() => String)
  name!: string;

  @Field(() => Int)
  total!: number;
}

@ObjectType()
export class BookingsPerEmployee{
  @Field(() => String)
  employeeName!: string;

  @Field(() => Int)
  bookingCount!: number;
}

@ObjectType()
export class EquipmentUsage{
  @Field(() => String)
  equipmentName!: string;

  @Field(() => Int)
  timesUsage!: number;
}

@ObjectType()
export class MonthlyBookingStatics{
  @Field(() => String)
  month!: string;

  @Field(() => Int)
  totalBookings!: number;

  @Field(() => Int)
  approvedBookings!: number;

  @Field(() => Int)
  rejectedBookings!: number;
}
