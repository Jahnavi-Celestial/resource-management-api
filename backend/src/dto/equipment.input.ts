import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsNotEmpty, IsInt, IsBoolean, IsString, IsOptional, Min } from "class-validator";
import { Equipment } from "../entities/Equipment.ts";

@InputType()
export class CreateEquipmentInput{
  @Field(() => String)
  @IsNotEmpty({ message: "Equipment Name, available quantity can't be empty" })
  @IsString()
  name!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Equipment Name, available quantity can't be empty" })
  @IsInt()
  @Min(0, { message: "Quantity must be positive" })
  quantityAvailable!: number;

  @Field(() => Boolean)
  @IsBoolean()
  isActive!: boolean;
}

@InputType()
export class UpdateEquipmentInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Equipment id, name, available quantity can't be empty" })
  @IsInt()
  id!: number;

  @Field(() => String)
  @IsNotEmpty({ message: "Equipment id, name, available quantity can't be empty" })
  @IsString()
  name!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Equipment id, name, available quantity can't be empty" })
  @IsInt()
  @Min(0, { message: "Quantity must be positive" })
  quantityAvailable!: number;

  @Field(() => Boolean)
  @IsBoolean()
  isActive!: boolean;
}

@InputType()
export class EquipRequestInput{
  @Field(() => Int)
  equipId!: number;

  @Field(() => Int)
  quantity!: number;
}

@InputType()
export class EquipmentsFilterInput{
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