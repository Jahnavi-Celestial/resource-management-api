import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { Booking } from "./Booking.ts";
import { IsDate } from "class-validator";

@ObjectType()
@Entity({ name: "equipments" })
export class Equipment {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ type: 'text', nullable: false })
    name!: string;

    @Field(() => Int)
    @Column({ type: 'integer', nullable: false })
    quantityAvailable!: number;

    @Field(() => Boolean)
    @Column({ type: 'boolean', nullable: false, default: false })
    isActive!: boolean;

    @Field(() => Date)
    @CreateDateColumn({ type: 'timestamptz' })
    @IsDate()
    created_at!: Date;
    
    @Field(() => Date)
    @UpdateDateColumn({ type: 'timestamptz' })
    @IsDate()
    updated_at!: Date;

    @Field(() => [Booking])
    @ManyToMany(() => Booking, (booking) => booking.equipments)
    bookings!: Booking[];
}
