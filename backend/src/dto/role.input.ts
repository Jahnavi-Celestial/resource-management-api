import { IsArray } from "class-validator";
import { Field, InputType, Int } from "type-graphql";
import { CustomIsAlpha, CustomIsInt, CustomIsNotEmpty, CustomIsString } from "../utils/customDecorators.ts";

@InputType()
export class CreateRoleInput{
  @Field(() => String)
  @CustomIsNotEmpty({ message: "Role name cannot be empty" })
  @CustomIsString({ message: "Role name must be text" })
  @CustomIsAlpha()
  name!: string;
}

@InputType()
export class UpdateRoleInput{
  @Field(() => Int)
  @CustomIsNotEmpty({ message: "Role ID cannot be empty" })
  @CustomIsInt({ message: "Role ID must be an integer" })
  id!: number;

  @Field(() => String)
  @CustomIsNotEmpty({ message: "Role name cannot be empty" })
  @CustomIsString({ message: "Role name must be text" })
  name!: string;
}

@InputType()
export class AssignPermissionInput{
    @Field(() => Int)
    @CustomIsNotEmpty({ message: "Role ID cannot be empty" })
    @CustomIsInt({ message: "Role ID must be an integer" })
    roleId!: number;

    @Field(() => [Int])
    @CustomIsNotEmpty({ message: "Permission IDs list cannot be empty" })
    @IsArray({ message: "Permission IDs must be an array" })
    permissionIds!: number[];
}

@InputType()
export class RemovePermissionInput{
    @Field(() => Int)
    @CustomIsNotEmpty({ message: "Role ID cannot be empty" })
    @CustomIsInt({ message: "Role ID must be an integer" })
    roleId!: number;

    @Field(() => [Int])
    @CustomIsNotEmpty({ message: "Permission IDs list cannot be empty" })
    @IsArray({ message: "Permission IDs must be an array" })
    permissionIds!: number[];
}