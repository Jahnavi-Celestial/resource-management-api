import bcrypt from "bcrypt";
import { EmployeeRepository, UserRoleRepository, RoleRepository } from "../repositories/index.ts";
import { CreateEmployeeInput, EmployeesFilterInput, UpdateEmployeeInput, AssignRemoveRoleInput } from "../dto/index.ts";
import { Employee } from "../entities/index.ts";
import { ConflictError, NotFoundError } from "../errors/AppErrors.ts";
import { FindOptionsWhere, ILike, In } from "typeorm";
import { sendMail } from "../jobs/emailService.ts";

export class EmployeeService {
  constructor(
    private employeeRepo = new EmployeeRepository(),
    private userRoleRepo = new UserRoleRepository(),
    private roleRepo = new RoleRepository()
  ) {}

  async createEmployee(input: CreateEmployeeInput){
    const existing = await this.employeeRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictError("Employee email already registered", "email");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const { roleId, ...employeeData } = input;

    const employee = this.employeeRepo.create({
      ...employeeData,
      password: hashedPassword,
      firstName: input.firstName?.toLowerCase(),
      lastName: input.lastName?.toLowerCase()
    });

    const role = await this.roleRepo.findRoleById(roleId);

    if(!role){
      throw new NotFoundError("Role", "roleId");
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

    let hashedPassword = employee.password;
    if(input.password){
      hashedPassword = await bcrypt.hash(String(input.password), 10);
      
      const to = `${employee.email}`
      const subject = 'Your Updated Login Credentials Details'
      const text = `Your login credentials are: email- ${employee.email} and password- ${input.password}`

      sendMail(to, subject, text)
    }

    if(input.roleIdFrom != undefined && input.roleIdTo != undefined){
      const changeUserRole = await this.userRoleRepo.findByEmployeeIdAndRoleId(employee.id, input.roleIdFrom)

      if(!changeUserRole){
        throw new NotFoundError('Target Role', "roleIdTo");
      }

      const roleToChange = await this.roleRepo.findRoleById(input.roleIdTo)

      if (!roleToChange) {
        throw new NotFoundError('Target Role', "roleIdTo");
      }

      changeUserRole.role = roleToChange

      await this.userRoleRepo.save(changeUserRole)
    }

    return this.employeeRepo.save({
      ...employee,
      ...input,
      password: hashedPassword,
      firstName: input.firstName != null ? input.firstName.toLowerCase() : employee.firstName,
      lastName: input.lastName?.toLowerCase()
    });
  }

  async deleteEmployees(ids: number[]){
    if (!ids || ids.length === 0){
      return false
    }

    const [existingEmployees, totalFound] = await this.employeeRepo.findAndCountEmployees(
      { id: In(ids) as any }, 0, ids.length, "DESC"
    )

    if (totalFound !== ids.length) {
      throw new NotFoundError("One or more employees", "ids");
    }

    const deletePromises = ids.map(id => this.employeeRepo.delete(id));
    const results = await Promise.all(deletePromises);

    return results.every(result => result === true);
  }

  async getEmployees(input: EmployeesFilterInput){
    const { page, limit, searchTerm, sortOrder, role } = input;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Employee> = {};
    if (searchTerm) {
      whereConditions.firstName = ILike(`%${searchTerm}%`);
    }

    if(role){
      whereConditions.userRoles = {
        role: {
          role_name: role
        }
      };
    }

    const [employees, totalCount] = await this.employeeRepo.findAndCountEmployees(
      whereConditions,
      skip,
      limit,
      String(sortOrder),
    );

    return {
      data: employees,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1
    };
  }

  async getEmployeeById(id: number){
    const employee = await this.employeeRepo.findByIdWithRelations(id);
    if (!employee) {
      throw new NotFoundError("Employee", "id");
    }
    return employee;
  }

  async assignRole(input: AssignRemoveRoleInput){
    const { roleId, userId } = input;

    const employee = await this.employeeRepo.findById(userId);

    if(!employee){
        throw new NotFoundError("Employee", "userId");
    }

    const role = await this.roleRepo.findRoleById(roleId);

    if(!role){
        throw new NotFoundError("Role", "roleId");
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
        throw new NotFoundError("Role Assignment", "roleId");
    }

    await this.userRoleRepo.remove(userRole);

    return true;
  }
}