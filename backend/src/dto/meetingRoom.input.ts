import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsNotEmpty, IsInt, IsBoolean, IsString, IsOptional, Min } from "class-validator";
import { MeetingRoom } from "../entities/MeetingRoom.ts";

@InputType()
export class CreateMeetingRoomInput{
  @Field(() => String)
  @IsNotEmpty({ message: "Room name, location, capacity can't be empty" })
  @IsString()
  name!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Room name, location, capacity can't be empty" })
  @IsString()
  location!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Room name, location, capacity can't be empty" })
  @IsInt()
  @Min(0, { message: "Capacity must be positive" })
  capacity!: number;

  @Field(() => Boolean)
  @IsBoolean()
  isActive!: boolean;
}

@InputType()
export class UpdateMeetingRoomInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Room id, name, location, capacity can't be empty" })
  @IsInt()
  id!: number;

  @Field(() => String)
  @IsNotEmpty({ message: "Room id, name, location, capacity can't be empty" })
  @IsString()
  name!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Room id, name, location, capacity can't be empty" })
  @IsString()
  location!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Room id, name, location, capacity can't be empty" })
  @IsInt()
  @Min(0, { message: "Capacity must be positive" })
  capacity!: number;

  @Field(() => Boolean)
  @IsBoolean()
  isActive!: boolean;
}

@InputType()
export class RoomsFilterInput{
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

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  searchTerm?: string;
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
