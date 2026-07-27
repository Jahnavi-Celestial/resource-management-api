import { EntityManager } from "typeorm";
import { Roles } from "../entities/index.ts"
import { Manager } from "./index.ts";


export class RoleRepository extends Manager{
    constructor(manager?: EntityManager) {
        super(manager);
    }

    async findRoleByName(name: string){
        return this.manager.findOne(Roles, {
            where:{
                role_name: name
            }
        })
    }

    async createRole(data: Partial<Roles>){
        return this.manager.create(Roles, data)
    }

    async saveRole(data: Roles | Partial<Roles>){
        return this.manager.save(Roles, data)
    }

    async findRoleById(id: number){
        return this.manager.findOne(Roles, {
            where:{
                id
            }
        })
    }

    async deleteRole(id: number){
        const result = await this.manager.delete(Roles, id);
        return !!result.affected;
    }

    async findRole(){
        return this.manager.find(Roles)
    }
}