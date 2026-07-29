import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Equipment } from "../entities/Equipment.ts";
import { CustomIsAlpha, CustomIsBoolean, CustomIsInt, CustomIsNotEmpty, CustomIsOptional, CustomIsString, CustomMin } from "../utils/customDecorators.ts";

@InputType()
export class CreateEquipmentInput{
  @Field(() => String)
  @CustomIsNotEmpty({ message: "Equipment name cannot be empty" })
  @CustomIsString({ message: "Equipment name must be text" })
  @CustomIsAlpha()
  name!: string;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Quantity available cannot be empty" })
  @CustomIsInt({ message: "Quantity available must be a number" })
  @CustomMin(1, { message: "Created Quantity must be at least 1"})
  quantityAvailable!: number;

  @Field(() => Boolean)
  @CustomIsNotEmpty({ message: "Active status must be specified" })
  @CustomIsBoolean({ message: "Active status must be a boolean value" })
  isActive!: boolean;
}

@InputType()
export class UpdateEquipmentInput{
  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Equipment ID cannot be empty" })
  @CustomIsInt({ message: "Equipment ID must be a number" })
  id!: number;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Equipment name cannot be empty" })
  @CustomIsString({ message: "Equipment name must be text" })
  @CustomIsAlpha()
  name!: string;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Quantity available cannot be empty" })
  @CustomIsInt({ message: "Quantity available must be a number" })
  @CustomMin(0, { message: "Quantity must be positive" })
  quantityAvailable!: number;

  @Field(() => Boolean)
  @CustomIsNotEmpty({ message: "Active status must be specified" })
  @CustomIsBoolean({ message: "Active status must be a boolean value" })
  isActive!: boolean;
}

@InputType()
export class EquipRequestInput{
  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Equipment ID cannot be empty" })
  @CustomIsInt({ message: "Equipment ID must be a number" })
  equipId!: number;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Requested quantity cannot be empty" })
  @CustomIsInt({ message: "Requested quantity must be a number" })
  @CustomMin(1, { message: "Requested quantity must be at least 1" })
  quantity!: number;
}

@InputType()
export class EquipmentsFilterInput{
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
