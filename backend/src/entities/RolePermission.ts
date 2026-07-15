import { IsNotEmpty } from "class-validator";
import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./Roles.ts";
import { Permission } from "./Permission.ts";


@ObjectType()
@Entity({ name: "role_permission" })
export class RolePermission {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Roles)
    @ManyToOne(() => Roles, role => role.rolePermissions, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "role_id" })
    role!: Roles;

    @Field(() => Permission)
    @ManyToOne(() => Permission, permission => permission.rolePermissions, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "permission_id" })
    permission!: Permission;
}