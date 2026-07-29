import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Booking, BookingStatus } from "../entities/Booking.ts";
import { EquipRequestInput } from "./equipment.input.ts";
import { CustomIsArray, CustomIsDate, CustomIsEnum, CustomIsInt, CustomIsNotEmpty, CustomIsOptional, CustomIsString, CustomMin } from "../utils/customDecorators.ts";

@InputType()
export class CreateBookingInput {
  @Field(() => Date)
  @CustomIsNotEmpty({ message: "Start time cannot be empty" })
  @CustomIsDate({ message: "Invalid start time format" })
  startTime!: Date;

  @Field(() => Date)
  @CustomIsNotEmpty({ message: "End time cannot be empty" })
  @CustomIsDate({ message: "Invalid end time format" })
  endTime!: Date;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Purpose cannot be empty" })
  @CustomIsString({ message: "Purpose must be text" })
  purpose!: string;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Number of attendees cannot be empty" })
  @CustomIsInt({ message: "Number of attendees must be an integer" })
  @CustomMin(0, { message: "Number of attendees cannot be negative" })
  numberOfAttendees!: number;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Room id cannot be empty" })
  @CustomIsInt({ message: "Room id must be an integer" })
  meetingRoomId!: number;

  @Field(() => [EquipRequestInput], { nullable: true })
  @CustomIsOptional()
  @CustomIsArray({ message: "Requested equipment must be a list" })
  equipmentRequested?: EquipRequestInput[];
}

@InputType()
export class CancelBookingInput{
  @Field(() => Int)
  @CustomIsNotEmpty()
  @CustomIsInt()
  bookingId!: number;
}

@InputType()
export class ApproveBookingInput{
  @Field(() => Int)
  @CustomIsNotEmpty()
  @CustomIsInt()
  bookingId!: number;
}

@InputType()
export class RejectBookingInput{
  @Field(() => Int)
  @CustomIsNotEmpty()
  @CustomIsInt()
  bookingId!: number;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Rejection reason is required" })
  @CustomIsString()
  rejectionReason!: string;
}

@InputType()
export class BookingsFilterInput{
  @Field(() => Int, { defaultValue: 1 })
  @CustomIsOptional()
  @CustomIsInt()
  @CustomMin(1, { message: "Page must be at least 1" })
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  @CustomIsOptional()
  @CustomIsInt()
  @CustomMin(1, { message: "Limit must be at least 1" })
  limit!: number;

  @Field(() => BookingStatus, { nullable: true })
  @CustomIsOptional()
  @CustomIsEnum(BookingStatus, { message: "Invalid booking status filtering option" })
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