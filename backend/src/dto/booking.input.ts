import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsNotEmpty, IsInt, IsString, IsDate, IsArray, IsOptional, Min, IsEnum } from "class-validator";
import { Booking, BookingStatus } from "../entities/Booking.ts";
import { EquipRequestInput } from "./equipment.input.ts";

@InputType()
export class CreateBookingInput {
  @Field(() => Date)
  @IsNotEmpty({ message: "Start time cannot be empty" })
  @IsDate({ message: "Invalid start time format" })
  startTime!: Date;

  @Field(() => Date)
  @IsNotEmpty({ message: "End time cannot be empty" })
  @IsDate({ message: "Invalid end time format" })
  endTime!: Date;

  @Field(() => String)
  @IsNotEmpty({ message: "Purpose cannot be empty" })
  @IsString({ message: "Purpose must be text" })
  purpose!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Number of attendees cannot be empty" })
  @IsInt({ message: "Number of attendees must be an integer" })
  @Min(0, { message: "Number of attendees cannot be negative" })
  numberOfAttendees!: number;

  @Field(() => Int)
  @IsNotEmpty({ message: "Room id cannot be empty" })
  @IsInt({ message: "Room id must be an integer" })
  meetingRoomId!: number;

  @Field(() => [EquipRequestInput], { nullable: true })
  @IsOptional()
  @IsArray({ message: "Requested equipment must be a list" })
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

  @Field(() => String, { nullable: true, defaultValue: "DESC" })
  sortOrder?: "ASC" | "DESC";
}

@ObjectType()
export class PaginatedBookings{
  @Field(() => [Booking])
  data!: Booking[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
}