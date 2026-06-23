import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Booking } from "./Booking.ts";
import { IsDateString, IsNotEmpty } from "class-validator";

@ObjectType()
@Entity({ name: "equipments" })
export class Equipment {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ type: 'text', nullable: false })
    @IsNotEmpty({message: "Equipment Name can't be empty"})
    name!: string;

    @Field(() => Int)
    @Column({ type: 'integer', nullable: false })
    @IsNotEmpty({message: "Equipment available quantity can't be empty"})
    quantityAvailable!: number;

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
    @ManyToMany(() => Booking, (booking) => booking.equipments)
    bookings!: Booking[];
}
