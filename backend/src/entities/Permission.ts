import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, } from "typeorm";
import { RolePermission } from "./RolePermission.ts";


@ObjectType()
@Entity({ name: "permissions" })
export class Permission {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ type: 'text', nullable: false, unique: true })
    permission_name!: string;

    @Field(() => [RolePermission])
    @OneToMany(() => RolePermission, rp => rp.permission)
    rolePermissions!: RolePermission[];
}
