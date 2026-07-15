import { Field, Int, ObjectType } from "type-graphql";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Employee } from "./Employee.ts";
import { Roles } from "./Roles.ts";


@ObjectType()
@Entity("user_roles")
@Unique(["employee", "role"])
export class UserRole {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Employee)
    @ManyToOne(() => Employee, employee => employee.userRoles, {onDelete: "CASCADE"})
    @JoinColumn({ name: "employee_id" })
    employee!: Employee;

    @Field(() => Roles)
    @ManyToOne(() => Roles, role => role.userRoles, {onDelete: "CASCADE"})
    @JoinColumn({ name: "role_id" })
    role!: Roles;
}