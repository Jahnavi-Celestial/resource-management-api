import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsInt, Min, IsString } from "class-validator";
import { Employee } from "../entities/Employee.ts";

@InputType()
export class CreateEmployeeInput{
  @Field(() => String)
  @IsNotEmpty({ message: "First name cannot be empty" })
  firstName!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Last name cannot be empty" })
  lastName!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Email cannot be empty" })
  @IsEmail({ require_tld: true }, { message: "Invalid email format" })
  email!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Password cannot be empty" })
  @MinLength(6, { message: "Password should contain at least 6 characters" })
  password!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Role ID cannot be empty" })
  @IsInt({ message: "Role ID must be a number" })
  roleId!: number;
}

@InputType()
export class UpdateEmployeeInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Employee ID cannot be empty" })
  @IsInt({ message: "Employee ID must be a number" })
  id!: number;

  @Field(() => String)
  @IsNotEmpty({ message: "First name cannot be empty" })
  firstName!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Last name cannot be empty" })
  lastName!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "Email cannot be empty" })
  @IsEmail({ require_tld: true }, { message: "Invalid email format" })
  email!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MinLength(6, { message: "Password should contain at least 6 characters" })
  password?: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "Source Role ID cannot be empty" })
  @IsInt({ message: "Source Role ID must be a number" })
  roleIdFrom!: number;

  @Field(() => Int)
  @IsNotEmpty({ message: "Target Role ID cannot be empty" })
  @IsInt({ message: "Target Role ID must be a number" })
  roleIdTo!: number;
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

  @Field(() => String, { nullable: true, defaultValue: "DESC" })
  sortOrder?: "ASC" | "DESC";
}

@ObjectType()
export class PaginatedEmployees{
  @Field(() => [Employee])
  data!: Employee[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
}

@InputType()
export class AssignRemoveRoleInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Role ID cannot be empty" })
  @IsInt({ message: "Role ID must be a number" })
  roleId!: number;

  @Field(() => Int)
  @IsNotEmpty({ message: "User ID cannot be empty" })
  @IsInt({ message: "User ID must be a number" })
  userId!: number;
}
