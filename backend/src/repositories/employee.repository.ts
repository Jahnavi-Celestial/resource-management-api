import { FindOptionsWhere } from "typeorm";
import AppDataSource from "../config/db.ts";
import { Employee } from "../entities/Employee.ts";


export class EmployeeRepository {
  private repo = AppDataSource.getRepository(Employee);

  async findById(id: number){
    return this.repo.findOne({ 
        where: { id } 
    });
  }

  async findByEmail(email: string){
    return this.repo.findOne({ 
        where: { email } 
    });
  }

  async save(employee: Employee){
    return this.repo.save(employee);
  }

  async delete(id: number){
    const result = await this.repo.delete(id);
    return !!result.affected;
  }

  create(data: Partial<Employee>){
    return this.repo.create(data);
  }

  async findByIdWithRelations(id: number){
    return this.repo.findOne({
      where: { id },
      relations: {
        bookings: {
          meetingRoom: true,
          employee: true,
          equipments: true
        },
        auditLogs: true
      }
    });
  }

  async findAndCountEmployees(
    whereConditions: FindOptionsWhere<Employee>,
    skip: number,
    take: number
  ){
    return this.repo.findAndCount({
      where: whereConditions,
      relations: {
        bookings: {
          meetingRoom: true,
          employee: true,
          equipments: true
        },
        auditLogs: true
      },
      order: { id: "DESC" },
      skip,
      take
    });
  }
}
