import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, IsInt, Min, IsString } from "class-validator";
import { Employee, Role } from "../entities/Employee.ts";

@InputType()
export class CreateEmployeeInput{
  @Field(() => String)
  @IsNotEmpty({ message: "First name cannot be empty" })
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => String)
  @IsEmail({ require_tld: true }, { message: "Invalid email format" })
  email!: string;

  @Field(() => String)
  @MinLength(6, { message: "Password should contain at least 6 characters" })
  password!: string;

  @Field(() => Role)
  @IsEnum(Role, { message: "Invalid role assigned" })
  role!: Role;
}

@InputType()
export class UpdateEmployeeInput extends CreateEmployeeInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Employee ID cannot be empty" })
  id!: number;
}

@InputType()
export class EmployeesFilterInput{
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
