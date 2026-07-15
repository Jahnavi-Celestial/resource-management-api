import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsNotEmpty, IsInt, IsBoolean, IsString, IsOptional, Min } from "class-validator";
import { MeetingRoom } from "../entities/MeetingRoom.ts";

@InputType()
export class CreateMeetingRoomInput{
  @Field(() => String)
  @IsNotEmpty({ message: "Room name cannot be empty" })
  @IsString({ message: "Room name must be text" })
  name!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Location cannot be empty" })
  @IsString({ message: "Location must be text" })
  location!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Capacity cannot be empty" })
  @IsInt({ message: "Capacity must be an integer" })
  @Min(1, { message: "Capacity must be at least 1" })
  capacity!: number;

  @Field(() => Boolean)
  @IsNotEmpty({ message: "Active status must be specified" })
  @IsBoolean({ message: "Active status must be a boolean value" })
  isActive!: boolean;
}

@InputType()
export class UpdateMeetingRoomInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Room ID cannot be empty" })
  @IsInt({ message: "Room ID must be an integer" })
  id!: number;

  @Field(() => String)
  @IsNotEmpty({ message: "Room name cannot be empty" })
  @IsString({ message: "Room name must be text" })
  name!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Location cannot be empty" })
  @IsString({ message: "Location must be text" })
  location!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Capacity cannot be empty" })
  @IsInt({ message: "Capacity must be an integer" })
  @Min(1, { message: "Capacity must be at least 1" })
  capacity!: number;

  @Field(() => Boolean)
  @IsNotEmpty({ message: "Active status must be specified" })
  @IsBoolean({ message: "Active status must be a boolean value" })
  isActive!: boolean;
}

@InputType()
export class RoomsFilterInput{
  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @IsInt({ message: "Page must be an integer" })
  @Min(1, { message: "Page must be at least 1" })
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  @IsInt({ message: "Limit must be an integer" })
  @Min(1, { message: "Limit must be at least 1" })
  limit!: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: "Search term must be text" })
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
