import { Field, Int, ObjectType } from "type-graphql";
import { Equipment } from "../entities/Equipment.ts";
import { MeetingRoom } from "../entities/MeetingRoom.ts";
import { Employee } from "../entities/Employee.ts";
import { Booking } from "../entities/Booking.ts";



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

@ObjectType()
export class PaginatedEmployees{
  @Field(() => [Employee])
  employees!: Employee[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
export class PaginatedRooms{
  @Field(() => [MeetingRoom])
  rooms!: MeetingRoom[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
export class PaginatedEquipments{
  @Field(() => [Equipment])
  equipments!: Equipment[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
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