import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsNotEmpty, IsInt, Min, Max } from "class-validator";

@InputType()
export class BookingsPerEmployeeInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Employee ID cannot be empty" })
  @IsInt({ message: "Employee ID must be an integer" })
  @Min(1, { message: "Employee ID must be at least 1" })
  empId!: number;
}

@InputType()
export class EquipmentUsageInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Equipment ID cannot be empty" })
  @IsInt({ message: "Equipment ID must be an integer" })
  @Min(1, { message: "Equipment ID must be at least 1" })
  equipId!: number;
}

@InputType()
export class MonthlyBookingStatisticsInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Month cannot be empty" })
  @IsInt({ message: "Month must be an integer" })
  @Min(1, { message: "Month must be between 1 and 12" })
  @Max(12, { message: "Month must be between 1 and 12" })
  month!: number;

  @Field(() => Int)
  @IsNotEmpty({ message: "Year cannot be empty" })
  @IsInt({ message: "Year must be an integer" })
  @Min(2000, { message: "Provide a valid historical or current year" })
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
