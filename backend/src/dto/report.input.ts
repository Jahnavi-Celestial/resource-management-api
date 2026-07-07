import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsNotEmpty, IsInt, Min, Max } from "class-validator";

@InputType()
export class BookingsPerEmployeeInput{
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  empId!: number;
}

@InputType()
export class EquipmentUsageInput{
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  equipId!: number;
}

@InputType()
export class MonthlyBookingStatisticsInput{
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: "Month must be between 1 and 12" })
  @Max(12, { message: "Month must be between 1 and 12" })
  month!: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
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
