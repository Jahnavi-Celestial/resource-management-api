import { IsDateString } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@ObjectType()
@Entity("notification")
export class Notification {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column({ type: "int" }) 
  recipientId!: number;

  @Field(() => Int)
  @Column({ type: "int" }) 
  bookingId!: number;

  @Field(() => String)
  @Column({ type: 'text', nullable: false })
  title!: string;

  @Field(() => String)
  @Column({ type: 'text', nullable: false })
  message!: string;

  @Field(() => Boolean) 
  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  @IsDateString()
  createdAt!: Date;
}
