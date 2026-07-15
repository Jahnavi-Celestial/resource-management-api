import { IsInt, IsNotEmpty } from "class-validator";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class CreatePermissionInput{
  @Field(() => String)
  name!: string;
}

@InputType()
export class UpdatePermissionInput{
  @Field(() => Int)
  @IsNotEmpty({ message: "Permission id can't be empty" })
  @IsInt()
  id!: number;

  @Field(() => String)
  name!: string;
}