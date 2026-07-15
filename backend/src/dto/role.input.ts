import { IsInt, IsNotEmpty } from "class-validator";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class CreateRoleInput{
  @Field(() => String)
  name!: string;
}

@InputType()
export class UpdateRoleInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Role id can't be empty" })
  @IsInt()
  id!: number;

  @Field(() => String)
  name!: string;
}

@InputType()
export class AssignPermissionInput{
    @Field(() => Int)
    @IsNotEmpty({ message: "Role id can't be empty" })
    @IsInt()
    roleId!: number;

    @Field(() => [Int])
    permissionIds!: number[];
}

@InputType()
export class RemovePermissionInput{
    @Field(() => Int)
    @IsNotEmpty({ message: "Role id can't be empty" })
    @IsInt()
    roleId!: number;

    @Field(() => [Int])
    permissionIds!: number[];
}