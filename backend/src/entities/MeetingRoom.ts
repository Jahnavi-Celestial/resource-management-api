import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Booking } from "./Booking.ts";
import { IsDateString, IsNotEmpty, IsPositive } from "class-validator";

@ObjectType()
@Entity({ name: "meeting_room" })
export class MeetingRoom {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ type: 'text', nullable: false })
    @IsNotEmpty({message: "Room name can't be empty"})
    name!: string;

    @Field(() => String)
    @Column({ type: 'text', nullable: false })
    @IsNotEmpty({message: "Room location can't be empty"})
    location!: string;

    @Field(() => Int)
    @Column({ type: 'integer' })
    @IsNotEmpty({message: "Room capacity can't be empty"})
    @IsPositive({message: 'Capacity must be greater than 0'})
    capacity!: number;

    @Field(() => Boolean)
    @Column({ type: 'boolean', nullable: false, default: false })
    isActive!: boolean;

    @Field(() => Date)
    @CreateDateColumn({ type: 'timestamptz' })
    @IsDateString()
    created_at!: Date;
    
    @Field(() => Date)
    @UpdateDateColumn({ type: 'timestamptz' })
    @IsDateString()
    updated_at!: Date;

    @Field(() => [Booking])
    @OneToMany(() => Booking, (booking) => booking.meetingRoom)
    bookings!: Booking[];
}
