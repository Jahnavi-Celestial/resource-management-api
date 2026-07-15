import AppDataSource from "../config/db.ts";
import { UserRole } from "../entities/UserRole.ts";

export class UserRoleRepository{
    private repo = AppDataSource.getRepository(UserRole)

    async findByEmployeeId(employeeId: number){
        return this.repo.find({
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
        return this.repo.create(data)
    }

    async save(data: UserRole | Partial<UserRole>){
        return this.repo.save(data)
    }

    async findByEmployeeIdAndRoleId(employeeId: number, roleId: number){
        return this.repo.findOne({
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
        return this.repo.remove(userRole);
    }
}