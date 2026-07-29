import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Field, InputType, Int } from "type-graphql";
import { CustomIsInt, CustomIsNotEmpty, CustomIsString } from "../utils/customDecorators.ts";

@InputType()
export class CreatePermissionInput{
  @Field(() => String)
  @CustomIsNotEmpty({ message: "Permission name cannot be empty" })
  @CustomIsString({ message: "Permission name must be text" })
  name!: string;
}

@InputType()
export class UpdatePermissionInput{
  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Permission ID cannot be empty" })
  @CustomIsInt({ message: "Permission ID must be an integer" })
  id!: number;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Permission name cannot be empty" })
  @CustomIsString({ message: "Permission name must be text" })
  name!: string;
}