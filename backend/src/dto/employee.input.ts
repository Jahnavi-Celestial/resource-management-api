import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsInt, Min, IsString } from "class-validator";
import { Employee } from "../entities/Employee.ts";

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

  @Field(() => Int)
  roleId!: number;
}

@InputType()
export class UpdateEmployeeInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Employee ID cannot be empty" })
  id!: number;

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

  @Field(()=>Int)
  roleIdFrom!: number

  @Field(()=>Int)
  roleIdTo!: number
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

@InputType()
export class AssignRemoveRoleInput{
  @Field(()=>Int)
  roleId!: number

  @Field(()=>Int)
  userId!: number
}
