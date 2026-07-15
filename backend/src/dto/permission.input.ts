import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class CreatePermissionInput{
  @Field(() => String)
  @IsNotEmpty({ message: "Permission name cannot be empty" })
  @IsString({ message: "Permission name must be text" })
  name!: string;
}

@InputType()
export class UpdatePermissionInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Permission ID cannot be empty" })
  @IsInt({ message: "Permission ID must be an integer" })
  id!: number;

  @Field(() => String)
  @IsNotEmpty({ message: "Permission name cannot be empty" })
  @IsString({ message: "Permission name must be text" })
  name!: string;
}