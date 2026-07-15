import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { RolePermission } from "./RolePermission.ts";
import { IsNotEmpty } from "class-validator";
import { UserRole } from "./UserRole.ts";

@ObjectType()
@Entity({ name: "roles" })
export class Roles {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ type: 'text', nullable: false, unique: true })
    @IsNotEmpty({ message: "First name cannot be empty" })
    role_name!: string; 
    
    @Field(() => [RolePermission])
    @OneToMany(() => RolePermission, rp => rp.role)
    rolePermissions!: RolePermission[];

    @Field(() => [UserRole])
    @OneToMany(() => UserRole, ur => ur.role)
    userRoles!: UserRole[];
}
