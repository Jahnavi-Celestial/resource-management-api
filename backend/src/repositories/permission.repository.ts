import { EntityManager } from "typeorm";
import { Permission } from "../entities/index.ts"
import { Manager } from "./index.ts";


export class PermissionRepository extends Manager{
    constructor(manager?: EntityManager) {
        super(manager);
    }

    async findPermissionByName(name: string){
        return this.manager.findOne(Permission, {
            where:{
                permission_name: name
            }
        })
    }

    async createPermission(data: Partial<Permission>){
        return this.manager.create(Permission, data)
    }

    async savePermission(data: Permission | Partial<Permission>){
        return this.manager.save(Permission, data)
    }

    async findPermissionById(id: number){
        return this.manager.findOne(Permission, {
            where:{
                id
            }
        })
    }

    async deletePermission(id: number){
        const result = await this.manager.delete(Permission, id)
        return !!result.affected
    }

    async findPermission(){
        return this.manager.find(Permission)
    }
}