import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { LoginInput, RegisterInput } from "../dto/auth.input.ts";
import { EmployeeRepository } from "../repositories/employee.repository.ts";
import { AppError, ConflictError } from "../errors/AppErrors.ts";
import { UserRoleRepository } from "../repositories/userRole.repository.ts";
import { RoleRepository } from "../repositories/role.repository.ts";

dotenv.config();

export class AuthService{
  private employeeRepo = new EmployeeRepository();
  private userRoleRepo = new UserRoleRepository();
  private roleRepo = new RoleRepository();

  async register(input: RegisterInput){
    const { firstName, lastName, email, password, roleId } = input;

    const isEmpExist = await this.employeeRepo.findByEmail(email);

    if (isEmpExist) {
      throw new ConflictError("Employee already exists.");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newEmp = this.employeeRepo.create({
      ...input,
      password: password_hash,
    });

    
    const savedEmp = await this.employeeRepo.save(newEmp);

    const role = await this.roleRepo.findRoleById(roleId);
    if(!role){
      throw new AppError("Role not found", 404, "NOT_FOUND");
    }

    const user = await this.userRoleRepo.create({
      employee: savedEmp,
      role
    })

    await this.userRoleRepo.save(user)


    return savedEmp;
  }

  async login(input: LoginInput){
    const { email, password } = input;

    const isEmpExist = await this.employeeRepo.findByEmail(email);
    
    if (!isEmpExist) {
      throw new AppError("Invalid Credentials", 401, "UNAUTHORIZED");
    }

    const isPasswordValid = await bcrypt.compare(password, isEmpExist.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid Credentials", 401, "UNAUTHORIZED");
    }

    console.log(isEmpExist)
    const roles = isEmpExist.userRoles.map(userRole => userRole.role.role_name);

    const token = jwt.sign(
      {
        id: isEmpExist.id,
        email: isEmpExist.email,
        roles
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: "24h"
      }
    );

    return token;
  }
}
