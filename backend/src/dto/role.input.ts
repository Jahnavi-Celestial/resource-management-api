import { IsInt, IsNotEmpty, IsString, IsArray, IsAlpha } from "class-validator";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class CreateRoleInput{
  @Field(() => String)
  @IsNotEmpty({ message: "Role name cannot be empty" })
  @IsString({ message: "Role name must be text" })
  @IsAlpha()
  name!: string;
}

@InputType()
export class UpdateRoleInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Role ID cannot be empty" })
  @IsInt({ message: "Role ID must be an integer" })
  id!: number;

  @Field(() => String)
  @IsNotEmpty({ message: "Role name cannot be empty" })
  @IsString({ message: "Role name must be text" })
  name!: string;
}

@InputType()
export class AssignPermissionInput{
    @Field(() => Int)
    @IsNotEmpty({ message: "Role ID cannot be empty" })
    @IsInt({ message: "Role ID must be an integer" })
    roleId!: number;

    @Field(() => [Int])
    @IsNotEmpty({ message: "Permission IDs list cannot be empty" })
    @IsArray({ message: "Permission IDs must be an array" })
    permissionIds!: number[];
}

@InputType()
export class RemovePermissionInput{
    @Field(() => Int)
    @IsNotEmpty({ message: "Role ID cannot be empty" })
    @IsInt({ message: "Role ID must be an integer" })
    roleId!: number;

    @Field(() => [Int])
    @IsNotEmpty({ message: "Permission IDs list cannot be empty" })
    @IsArray({ message: "Permission IDs must be an array" })
    permissionIds!: number[];
}