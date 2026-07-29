import { Field, InputType, Int } from "type-graphql";
import { CustomIsEmail, CustomIsNotEmpty, CustomIsOptional, CustomMinLength } from "../utils/customDecorators.ts";

@InputType()
export class RegisterInput{
  @Field(() => String)
  @CustomIsNotEmpty({ message: "FirstName can't be empty" })
  firstName!: string;

  @Field(() => String, { nullable: true })
  @CustomIsOptional()
  lastName?: string | undefined;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "email can't be empty" })
  @CustomIsEmail({ message: "Invalid email format" })
  email!: string;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "password can't be empty" })
  @CustomMinLength(6, { message: "Password should contain atleast 6 characters" })
  password!: string;

  @Field(() => Int)
  @CustomIsNotEmpty({ message: "role id can't be empty" })
  roleId!: number;
}

@InputType()
export class LoginInput{
  @Field(() => String)
  @CustomIsNotEmpty({ message: "email can't be empty" })
  @CustomIsEmail({ message: "Invalid email format" })
  email!: string;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "password can't be empty" })
  @CustomMinLength(6, { message: "Password should contain atleast 6 characters" })
  password!: string;
}
