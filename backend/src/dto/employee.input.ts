import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Employee } from "../entities/Employee.ts";
import { CustomIsAlpha, CustomMinLength, CustomIsEmail, CustomIsNotEmpty, CustomIsOptional, CustomIsInt, CustomMin, CustomIsString } from "../utils/customDecorators.ts";

@InputType()
export class CreateEmployeeInput{
  @Field(() => String)
  @CustomIsNotEmpty({ message: "First name cannot be empty" })
  @CustomIsAlpha()
  firstName!: string;

  @Field(() => String)
  @CustomIsOptional()
  @CustomIsAlpha()
  lastName?: string;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Email cannot be empty" })
  @CustomIsEmail({message: 'Invalid Email Format'})
  email!: string;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Password cannot be empty" })
  @CustomMinLength(6, { message: "Password should contain at least 6 characters" })
  password!: string;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Role ID cannot be empty" })
  @CustomIsInt({ message: "Role ID must be a number" })
  roleId!: number;
}

@InputType()
export class UpdateEmployeeInput{
  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Employee ID cannot be empty" })
  @CustomIsInt({ message: "Employee ID must be a number" })
  id!: number;

  @Field(() => String, { nullable: true })
  @CustomIsOptional()
  @CustomIsAlpha()
  firstName?: string;

  @Field(() => String, { nullable: true })
  @CustomIsOptional()
  @CustomIsAlpha()
  lastName?: string;

  @Field(() => String, { nullable: true })
  @CustomIsOptional()
  @CustomIsEmail({ message: "Invalid email format" })
  email?: string;

  @Field(() => String, { nullable: true })
  @CustomIsOptional()
  @CustomMinLength(6, { message: "Password should contain at least 6 characters" })
  password?: string;

  @Field(() => Int, { nullable: true })
  @CustomIsOptional()
  @CustomIsInt({ message: "Source Role ID must be a number" })
  roleIdFrom?: number;

  @Field(() => Int, { nullable: true })
  @CustomIsOptional()
  @CustomIsInt({ message: "Target Role ID must be a number" })
  roleIdTo?: number;
}

@InputType()
export class EmployeesFilterInput{
  @Field(() => Int, { defaultValue: 1 })
  @CustomIsOptional()
  @CustomIsInt()
  @CustomMin(1, { message: "Page must be at least 1" })
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  @CustomIsOptional()
  @CustomIsInt()
  @CustomMin(1, { message: "Limit must be at least 1" })
  limit!: number;

  @Field(() => String, { nullable: true })
  @CustomIsOptional()
  @CustomIsString()
  searchTerm?: string;

  @Field(() => String, { nullable: true, defaultValue: "DESC" })
  sortOrder?: "ASC" | "DESC";

  @Field(() => String, { nullable: true })
  @CustomIsOptional()
  @CustomIsString()
  role?: string;
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
  @CustomIsNotEmpty({ message: "Role ID cannot be empty" })
  @CustomIsInt({ message: "Role ID must be a number" })
  roleId!: number;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "User ID cannot be empty" })
  @CustomIsInt({ message: "User ID must be a number" })
  userId!: number;
}
