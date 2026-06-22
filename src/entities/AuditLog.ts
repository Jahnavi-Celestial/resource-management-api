import { ObjectType, Field, registerEnumType, Int } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { BookingStatus } from "./Booking.ts"; 
import { Employee } from "./Employee.ts";
import { IsEnum } from "class-validator";

export enum AuditAction {
  BOOKING_CREATED = "BOOKING_CREATED",
  BOOKING_APPROVED = "BOOKING_APPROVED",
  BOOKING_REJECTED = "BOOKING_REJECTED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED"
}
registerEnumType(AuditAction, { name: "AuditAction" });

@ObjectType()
@Entity({ name: "audit_logs" })
export class AuditLog {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column({ type: 'integer' })
  bookingId!: number;

  @Field(() => AuditAction)
  @Column({ type: "varchar" })
  @IsEnum(AuditAction)
  action!: AuditAction;

  @Field(() => BookingStatus, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  oldStatus!: BookingStatus | null;

  @Field(() => BookingStatus)
  @Column({ type: "varchar" })
  newStatus!: BookingStatus;

  @Field(() => Date)
  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @Field(() => Int)
  @Column({ type: "integer" })
  performedById!: number;

  @Field(() => Employee)
  @ManyToOne(() => Employee, (employee) => employee.auditLogs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "performedById" })
  employee!: Employee;
}
