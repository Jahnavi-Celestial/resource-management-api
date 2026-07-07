import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Booking } from "./Booking.ts";
import { AuditLog } from "./AuditLog.ts";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, Length, Matches } from "class-validator";

export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE',
}
registerEnumType(Role, { name: 'Role' });

@ObjectType()
@Entity({ name: "employees" })
export class Employee {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ type: 'text', nullable: false })
    @IsNotEmpty({ message: "First name cannot be empty" })
    firstName!: string;

    @Field(() => String)
    @Column({ type: 'text', nullable: true })
    lastName!: string;

    @Field(() => String)
    @Column({ type: 'varchar', length: 255, unique: true })
    @IsNotEmpty({ message: "Email cannot be empty" })
    @IsEmail({}, { message: "Invalid email format" })
    email!: string;

    @Column({ type: 'varchar', length: 255 })
    @IsNotEmpty({ message: "Password cannot be empty" })
    @Length(6, 100, { message: "Password must be at least 6 characters long" })
    password!: string;

    @Field(() => Role, { nullable: false })
    @Column({ type: 'enum', enum: Role, default: Role.EMPLOYEE })
    @IsNotEmpty({ message: "Role cannot be empty" })
    @IsEnum(Role)
    role!: Role;

    @Field(() => Date)
    @CreateDateColumn({ type: 'timestamptz' })
    @IsDateString()
    created_at!: Date;

    @Field(() => Date)
    @UpdateDateColumn({ type: 'timestamptz' })
    @IsDateString()
    updated_at!: Date;

    @Field(() => [Booking])
    @OneToMany(() => Booking, (booking) => booking.employee)
    bookings!: Booking[];

    @Field(() => [AuditLog])
    @OneToMany(() => AuditLog, (auditLog) => auditLog.employee)
    auditLogs!: AuditLog[];
}
