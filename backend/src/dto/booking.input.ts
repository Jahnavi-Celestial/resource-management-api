import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsNotEmpty, IsInt, IsString, IsDate, IsArray, IsOptional, Min, IsEnum } from "class-validator";
import { Booking, BookingStatus } from "../entities/Booking.ts";
import { EquipRequestInput } from "./equipment.input.ts";

@InputType()
export class CreateBookingInput{
  @Field(() => Date)
  @IsNotEmpty({ message: "Start time, end-time, purpose, numberOfAttendees and room id can't be empty" })
  @IsDate()
  startTime!: Date;

  @Field(() => Date)
  @IsNotEmpty({ message: "Start time, end-time, purpose, numberOfAttendees and room id can't be empty" })
  @IsDate()
  endTime!: Date;

  @Field(() => String)
  @IsNotEmpty({ message: "Start time, end-time, purpose, numberOfAttendees and room id can't be empty" })
  @IsString()
  purpose!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Start time, end-time, purpose, numberOfAttendees and room id can't be empty" })
  @IsInt()
  @Min(0, { message: "number of attendees cant be negative" })
  numberOfAttendees!: number;

  @Field(() => Int)
  @IsNotEmpty({ message: "Start time, end-time, purpose, numberOfAttendees and room id can't be empty" })
  @IsInt()
  meetingRoomId!: number;

  @Field(() => [EquipRequestInput], { nullable: true })
  @IsOptional()
  @IsArray()
  equipmentRequested?: EquipRequestInput[];
}

@InputType()
export class CancelBookingInput{
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  bookingId!: number;
}

@InputType()
export class ApproveBookingInput{
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  bookingId!: number;
}

@InputType()
export class RejectBookingInput{
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  bookingId!: number;

  @Field(() => String)
  @IsNotEmpty({ message: "Rejection reason is required" })
  @IsString()
  rejectionReason!: string;
}

@InputType()
export class BookingsFilterInput{
  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1, { message: "Page must be at least 1" })
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1, { message: "Limit must be at least 1" })
  limit!: number;

  @Field(() => BookingStatus, { nullable: true })
  @IsOptional()
  @IsEnum(BookingStatus, { message: "Invalid booking status filtering option" })
  bookingStatus?: BookingStatus;
}

@ObjectType()
export class PaginatedBookings{
  @Field(() => [Booking])
  bookings!: Booking[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
}