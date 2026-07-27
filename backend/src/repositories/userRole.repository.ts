import { EntityManager } from "typeorm";
import { UserRole } from "../entities/index.ts";
import { Manager } from "./index.ts";

export class UserRoleRepository extends Manager{
    constructor(manager?: EntityManager) {
        super(manager);
    }

    async findByEmployeeId(employeeId: number){
        return this.manager.find(UserRole, {
            where: {
                employee: {
                    id: employeeId
                }
            },
            relations: {
                role: true
            }
        })
    }

    async create(data: UserRole | Partial<UserRole>){
        return this.manager.create(UserRole, data)
    }

    async save(data: UserRole | Partial<UserRole>){
        return this.manager.save(UserRole, data)
    }

    async findByEmployeeIdAndRoleId(employeeId: number, roleId: number){
        return this.manager.findOne(UserRole, {
            where: {
                employee: {
                    id: employeeId
                },
                role: {
                    id: roleId
                }
            },
            relations: {
                employee: true,
                role: true
            }
        })
    }

    async remove(userRole: UserRole){
        return this.manager.remove(UserRole, userRole);
    }
}