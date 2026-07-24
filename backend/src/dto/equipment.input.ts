import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsNotEmpty, IsInt, IsBoolean, IsString, IsOptional, Min } from "class-validator";
import { Equipment } from "../entities/Equipment.ts";

@InputType()
export class CreateEquipmentInput{
  @Field(() => String)
  @IsNotEmpty({ message: "Equipment name cannot be empty" })
  @IsString({ message: "Equipment name must be text" })
  name!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Quantity available cannot be empty" })
  @IsInt({ message: "Quantity available must be a number" })
  @Min(1, { message: "Created Quantity must be at least 1"})
  quantityAvailable!: number;

  @Field(() => Boolean)
  @IsNotEmpty({ message: "Active status must be specified" })
  @IsBoolean({ message: "Active status must be a boolean value" })
  isActive!: boolean;
}

@InputType()
export class UpdateEquipmentInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Equipment ID cannot be empty" })
  @IsInt({ message: "Equipment ID must be a number" })
  id!: number;

  @Field(() => String)
  @IsNotEmpty({ message: "Equipment name cannot be empty" })
  @IsString({ message: "Equipment name must be text" })
  name!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Quantity available cannot be empty" })
  @IsInt({ message: "Quantity available must be a number" })
  @Min(0, { message: "Quantity must be positive" })
  quantityAvailable!: number;

  @Field(() => Boolean)
  @IsNotEmpty({ message: "Active status must be specified" })
  @IsBoolean({ message: "Active status must be a boolean value" })
  isActive!: boolean;
}

@InputType()
export class EquipRequestInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Equipment ID cannot be empty" })
  @IsInt({ message: "Equipment ID must be a number" })
  equipId!: number;

  @Field(() => Int)
  @IsNotEmpty({ message: "Requested quantity cannot be empty" })
  @IsInt({ message: "Requested quantity must be a number" })
  @Min(1, { message: "Requested quantity must be at least 1" })
  quantity!: number;
}

@InputType()
export class EquipmentsFilterInput{
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
export class PaginatedEquipments{
  @Field(() => [Equipment])
  data!: Equipment[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
}
