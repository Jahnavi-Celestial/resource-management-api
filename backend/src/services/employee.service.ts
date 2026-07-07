import bcrypt from "bcrypt";
import { EmployeeRepository } from "../repositories/employee.repository.ts";
import { CreateEmployeeInput, EmployeesFilterInput, UpdateEmployeeInput, PaginatedEmployees } from "../dto/employee.input.ts";
import { Employee } from "../entities/Employee.ts";
import { ConflictError, NotFoundError } from "../errors/AppErrors.ts";
import { FindOptionsWhere, ILike } from "typeorm";

export class EmployeeService {
  constructor(private employeeRepo = new EmployeeRepository()) {}

  async createEmployee(input: CreateEmployeeInput){
    const existing = await this.employeeRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("Employee email already registered");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const employee = this.employeeRepo.create({
      ...input,
      password: hashedPassword,
    });

    return this.employeeRepo.save(employee);
  }

  async updateEmployee(input: UpdateEmployeeInput){
    const employee = await this.employeeRepo.findById(input.id);
    if (!employee) {
      throw new NotFoundError("Employee");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    return this.employeeRepo.save({
      ...employee,
      ...input,
      password: hashedPassword,
    });
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const employee = await this.employeeRepo.findById(id);
    if (!employee) {
      throw new NotFoundError("Employee");
    }
    return this.employeeRepo.delete(id);
  }

  async getEmployees(input: EmployeesFilterInput){
    const { page, limit, searchTerm } = input;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Employee> = {};
    if (searchTerm) {
      whereConditions.firstName = ILike(`%${searchTerm}%`);
    }

    const [employees, totalCount] = await this.employeeRepo.findAndCountEmployees(
      whereConditions,
      skip,
      limit
    );

    return {
      employees,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1
    };
  }

  async getEmployeeById(id: number){
    const employee = await this.employeeRepo.findByIdWithRelations(id);
    if (!employee) {
      throw new NotFoundError("Employee");
    }
    return employee;
  }
}