import AppDataSource from "../config/db.ts";
import { RolePermission } from "../entities/RolePermission.ts";

export class RolePermissionRepository{
    private repo = AppDataSource.getRepository(RolePermission)

    async findByRoleAndPermission(roleId: number, permissionId: number){
        return this.repo.findOne({
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
        return this.repo.create(data);
    }

    async save(data: RolePermission | Partial<RolePermission>){
        return this.repo.save(data);
    }

    async remove(data: RolePermission){
        return this.repo.remove(data);
    }

    async findByRoleId(roleId: number){
        return await this.repo.find({
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