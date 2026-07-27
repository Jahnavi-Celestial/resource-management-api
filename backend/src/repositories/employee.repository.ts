import { EntityManager, FindOptionsWhere } from "typeorm";
import { Employee } from "../entities/index.ts";
import { Manager } from "./index.ts";


export class EmployeeRepository extends Manager {
  constructor(manager?: EntityManager) {
    super(manager);
  }

  async findById(id: number){
    return this.manager.findOne(Employee,{ 
        where: { id },
        relations:{
          userRoles:{
            role: true
          }
        }
    });
  }

  async findByEmail(email: string){
    return this.manager.findOne(Employee, { 
        where: { email },
        relations:{
          userRoles:{
            role: true
          }
        }
    });
  }

  async save(employee: Employee){
    return this.manager.save(Employee, employee);
  }

  async delete(id: number){
    const result = await this.manager.delete(Employee, id);
    return !!result.affected;
  }

  create(data: Partial<Employee>){
    return this.manager.create(Employee, data);
  }

  async findByIdWithRelations(id: number){
    return this.manager.findOne(Employee, {
      where: { id },
      relations: {
        bookings: {
          meetingRoom: true,
          employee: true,
          equipments: true
        },
        userRoles:{
          role:true
        },
        auditLogs: true
      }
    });
  }

  async findAndCountEmployees(
    whereConditions: FindOptionsWhere<Employee>,
    skip: number,
    take: number,
    sortOrder: string
  ){
    return this.manager.findAndCount(Employee, {
      where: whereConditions,
      relations: {
        bookings: {
          meetingRoom: true,
          employee: true,
          equipments: true
        },
        userRoles:{
          role:true
        },
        auditLogs: true
      },
      order: { id: sortOrder as any },
      skip,
      take
    });
  }
}
