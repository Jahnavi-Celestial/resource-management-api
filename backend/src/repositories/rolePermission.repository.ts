import { EntityManager } from "typeorm";
import { RolePermission } from "../entities/index.ts";
import { Manager } from "./index.ts";

export class RolePermissionRepository extends Manager{
    constructor(manager?: EntityManager) {
        super(manager);
    }

    async findByRoleAndPermission(roleId: number, permissionId: number){
        return this.manager.findOne(RolePermission, {
            where: {
                role: {
                    id: roleId
                },
                permission: {
                    id: permissionId
                }
            },
            relations: {
                role: true,
                permission: true
            }
        })
    }

    async create(data: RolePermission | Partial<RolePermission>){
        return this.manager.create(RolePermission, data);
    }

    async save(data: RolePermission | Partial<RolePermission>){
        return this.manager.save(RolePermission, data);
    }

    async remove(data: RolePermission){
        return this.manager.remove(RolePermission, data);
    }

    async findByRoleId(roleId: number){
        return await this.manager.find(RolePermission, {
            where: {
                role:{
                    id: roleId
                }
            },
            relations:{
                role: true,
                permission: true
            }
        })
    }
}