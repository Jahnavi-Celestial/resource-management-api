import AppDataSource from "../config/db.ts"
import { Permission } from "../entities/Permission.ts"


export class PermissionRepository{
    private repo = AppDataSource.getRepository(Permission)

    async findPermissionByName(name: string){
        return this.repo.findOne({
            where:{
                permission_name: name
            }
        })
    }

    async createPermission(data: Partial<Permission>){
        return this.repo.create(data)
    }

    async savePermission(data: Permission | Partial<Permission>){
        return this.repo.save(data)
    }

    async findPermissionById(id: number){
        return this.repo.findOne({
            where:{
                id
            }
        })
    }

    async deletePermission(id: number){
        const result = await this.repo.delete(id)
        return !!result.affected
    }

    async findPermission(){
        return this.repo.find()
    }
}