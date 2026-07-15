import bcrypt from "bcrypt";
import { EmployeeRepository } from "../repositories/employee.repository.ts";
import { CreateEmployeeInput, EmployeesFilterInput, UpdateEmployeeInput, AssignRemoveRoleInput } from "../dto/employee.input.ts";
import { Employee } from "../entities/Employee.ts";
import { ConflictError, NotFoundError } from "../errors/AppErrors.ts";
import { FindOptionsWhere, ILike } from "typeorm";
import { sendMail } from "../jobs/emailService.ts";
import { UserRoleRepository } from "../repositories/userRole.repository.ts";
import { RoleRepository } from "../repositories/role.repository.ts";

export class EmployeeService {
  constructor(
    private employeeRepo = new EmployeeRepository(),
    private userRoleRepo = new UserRoleRepository(),
    private roleRepo = new RoleRepository()
  ) {}

  async createEmployee(input: CreateEmployeeInput){
    const existing = await this.employeeRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("Employee email already registered");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const { roleId, ...employeeData } = input;

    const employee = this.employeeRepo.create({
      ...employeeData,
      password: hashedPassword,
    });

    const role = await this.roleRepo.findRoleById(roleId);

    if(!role){
      throw new NotFoundError("Role");
    }

    const to = `${employee.email}`
    const subject = 'Your Login Credentials Details'
    const text = `You are now the ${role?.role_name} and your login creadentials are: email- ${employee.email} and password- ${input.password}`
    
    sendMail(to, subject, text)

    const savedEmployee = await this.employeeRepo.save(employee);

    const user = await this.userRoleRepo.create({
      employee: savedEmployee,
      role
    })
    await this.userRoleRepo.save(user)

    return savedEmployee
  }

  async updateEmployee(input: UpdateEmployeeInput){
    const employee = await this.employeeRepo.findById(input.id);
    if (!employee) {
      throw new NotFoundError("Employee");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const to = `${employee.email}`
    const subject = 'Your Updated Login Credentials Details'
    const text = `Your login creadentials are: email- ${employee.email} and password- ${input.password}`
    
    sendMail(to, subject, text)

    const changeUserRole = await this.userRoleRepo.findByEmployeeIdAndRoleId(employee.id, input.roleIdFrom)

    if(!changeUserRole){
      throw new NotFoundError('User Role')
    }

    const roleToChange = await this.roleRepo.findRoleById(input.roleIdTo)

    if(!roleToChange){
      throw new NotFoundError('User Role')
    }

    changeUserRole.role = roleToChange

    await this.userRoleRepo.save(changeUserRole)

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

  async assignRole(input: AssignRemoveRoleInput){
    const { roleId, userId } = input;

    const employee = await this.employeeRepo.findById(userId);

    if(!employee){
        throw new NotFoundError("Employee");
    }

    const role = await this.roleRepo.findRoleById(roleId);

    if(!role){
        throw new NotFoundError("Role");
    }

    const existing = await this.userRoleRepo.findByEmployeeIdAndRoleId(userId, roleId);

    if(existing){
        return employee;
    }

    const user = await this.userRoleRepo.create({
      employee,
      role
    })
    await this.userRoleRepo.save(user)

    return employee;
}

  async removeRole(input: AssignRemoveRoleInput){
    const { roleId, userId } = input;

    const userRole = await this.userRoleRepo.findByEmployeeIdAndRoleId(
        userId,
        roleId
    );

    if(!userRole){
        throw new NotFoundError("Role Assignment");
    }

    await this.userRoleRepo.remove(userRole);

    return true;
  }
}