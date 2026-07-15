import { Field, InputType, Int } from "type-graphql";
import { IsNotEmpty, IsEmail, MinLength, IsOptional } from "class-validator";

@InputType()
export class RegisterInput{
  @Field(() => String)
  @IsNotEmpty({ message: "FirstName can't be empty" })
  firstName!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  lastName?: string | undefined;

  @Field(() => String)
  @IsNotEmpty({ message: "email can't be empty" })
  @IsEmail({ require_tld: true }, { message: "Invalid email format" })
  email!: string;

  @Field(() => String)
  @IsNotEmpty({ message: "password can't be empty" })
  @MinLength(6, { message: "Password should contain atleast 6 characters" })
  password!: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "role id can't be empty" })
  roleId!: number;
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
