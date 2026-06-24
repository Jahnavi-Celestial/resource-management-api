import { Field, InputType, Int } from "type-graphql";


@InputType()
export class EquipRequestInput{
  @Field(() => Int)
  equipId!: number;

  @Field(() => Int)
  quantity!: number;
}