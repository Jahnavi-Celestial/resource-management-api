import AppDataSource from "../config/db.ts"
import { Roles } from "../entities/Roles.ts"


export class RoleRepository{
    private roleRepo = AppDataSource.getRepository(Roles)

    async findRoleByName(name: string){
        return this.roleRepo.findOne({
            where:{
                role_name: name
            }
        })
    }

    async createRole(data: Partial<Roles>){
        return this.roleRepo.create(data)
    }

    async saveRole(data: Roles | Partial<Roles>){
        return this.roleRepo.save(data)
    }

    async findRoleById(id: number){
        return this.roleRepo.findOne({
            where:{
                id
            }
        })
    }

    async deleteRole(id: number){
        const result = await this.roleRepo.delete(id);
        return !!result.affected;
    }

    async findRole(){
        return this.roleRepo.find()
    }
}