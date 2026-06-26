import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, ManyToMany, JoinTable, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./Employee.ts";
import { MeetingRoom } from "./MeetingRoom.ts";
import { Equipment } from "./Equipment.ts";
import { IsDateString, IsEnum } from "class-validator";

export enum BookingStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
registerEnumType(BookingStatus, { name: "BookingStatus" });

@ObjectType()
@Entity({ name: "bookings" })
export class Booking {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Date)
    @Column({ type: "timestamp" })
    startTime!: Date;

    @Field(() => Date)
    @Column({ type: "timestamp" })
    endTime!: Date;

    @Field(() => String)
    @Column({ type: "varchar", length: 255 })
    purpose!: string;

    @Field(() => String)
    @Column({ type: "text", nullable: true})
    rejectionReason!: string;

    @Field(() => Int)
    @Column({ type: "integer" })
    numberOfAttendees!: number;

    @Field(() => BookingStatus)
    @Column({ type: "varchar", default: BookingStatus.PENDING })
    @IsEnum(BookingStatus)
    status!: BookingStatus;

    @Field(() => Date)
    @CreateDateColumn({ type: "timestamptz" })
    @IsDateString()
    createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn({ type: "timestamptz" })
    @IsDateString()
    updatedAt!: Date;

    @Field(() => Int)
    @Column({ type: "integer" })
    employeeId!: number;

    @Field(() => Employee)
    @ManyToOne(() => Employee, (employee) => employee.bookings, { onDelete: "CASCADE" })
    @JoinColumn({ name: "employeeId" })
    employee!: Employee;

    @Field(() => Int)
    @Column({ type: "integer" })
    meetingRoomId!: number;

    @Field(() => MeetingRoom)
    @ManyToOne(() => MeetingRoom, (meetingRoom) => meetingRoom.bookings, { onDelete: "CASCADE" })
    @JoinColumn({ name: "meetingRoomId" })
    meetingRoom!: MeetingRoom;

    @Field(() => [Equipment])
    @ManyToMany(() => Equipment, (equipment) => equipment.bookings)
    @JoinTable({
        name: "booking_equipments",
        joinColumn: { name: "bookingId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "equipmentId", referencedColumnName: "id" }
    })
    equipments!: Equipment[];
}
