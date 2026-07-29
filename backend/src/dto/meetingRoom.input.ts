import { Field, InputType, Int, ObjectType } from "type-graphql";
import { MeetingRoom } from "../entities/MeetingRoom.ts";
import { CustomIsBoolean, CustomIsInt, CustomIsNotEmpty, CustomIsOptional, CustomIsString, CustomMin } from "../utils/customDecorators.ts";

@InputType()
export class CreateMeetingRoomInput{
  @Field(() => String)
  @CustomIsNotEmpty({ message: "Room name cannot be empty" })
  @CustomIsString({ message: "Room name must be text" })
  name!: string;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Location cannot be empty" })
  @CustomIsString({ message: "Location must be text" })
  location!: string;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Capacity cannot be empty" })
  @CustomIsInt({ message: "Capacity must be an integer" })
  @CustomMin(1, { message: "Capacity must be at least 1" })
  capacity!: number;

  @Field(() => Boolean)
  @CustomIsNotEmpty({ message: "Active status must be specified" })
  @CustomIsBoolean({ message: "Active status must be a boolean value" })
  isActive!: boolean;
}

@InputType()
export class UpdateMeetingRoomInput{
  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Room ID cannot be empty" })
  @CustomIsInt({ message: "Room ID must be an integer" })
  id!: number;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Room name cannot be empty" })
  @CustomIsString({ message: "Room name must be text" })
  name!: string;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Location cannot be empty" })
  @CustomIsString({ message: "Location must be text" })
  location!: string;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Capacity cannot be empty" })
  @CustomIsInt({ message: "Capacity must be an integer" })
  @CustomMin(1, { message: "Capacity must be positive" })
  capacity!: number;

  @Field(() => Boolean)
  @CustomIsNotEmpty({ message: "Active status must be specified" })
  @CustomIsBoolean({ message: "Active status must be a boolean value" })
  isActive!: boolean;
}

@InputType()
export class RoomsFilterInput{
  @Field(() => Int, { defaultValue: 1 })
  @CustomIsOptional()
  @CustomIsInt({ message: "Page must be an integer" })
  @CustomMin(1, { message: "Page must be at least 1" })
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  @CustomIsOptional()
  @CustomIsInt({ message: "Limit must be an integer" })
  @CustomMin(1, { message: "Limit must be at least 1" })
  limit!: number;

  @Field(() => String, { nullable: true })
  @CustomIsOptional()
  @CustomIsString({ message: "Search term must be text" })
  searchTerm?: string;

  @Field(() => String, { nullable: true, defaultValue: "DESC" })
  sortOrder?: "ASC" | "DESC";
}

@ObjectType()
export class PaginatedRooms{
  @Field(() => [MeetingRoom])
  data!: MeetingRoom[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
}
