import { Field, InputType } from "type-graphql";
import { IsNotEmpty, IsEmail, MinLength, IsEnum, IsOptional } from "class-validator";
import { Role } from "../entities/Employee.ts";

@InputType()
export class RegisterInput{
  @Field(() => String)
  @IsNotEmpty({ message: "FirstName can't be empty" })
  firstName!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  lastName?: string;

  @Field(() => String)
  @IsNotEmpty({ message: "email can't be empty" })
  @IsEmail({ require_tld: true }, { message: "Invalid email format" })
  email!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "password can't be empty" })
  @MinLength(6, { message: "Password should contain atleast 6 characters" })
  password!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "role can't be empty" })
  @IsEnum(Role, { message: "Invalid employee role provided" })
  role!: Role;
}

@InputType()
export class LoginInput{
  @Field(() => String)
  @IsNotEmpty({ message: "email can't be empty" })
  @IsEmail({ require_tld: true }, { message: "Invalid email format" })
  email!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "password can't be empty" })
  @MinLength(6, { message: "Password should contain atleast 6 characters" })
  password!: string;
}
