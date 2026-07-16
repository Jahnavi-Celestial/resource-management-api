import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { LoginInput, RegisterInput } from "../dto/auth.input.ts";
import { EmployeeRepository } from "../repositories/employee.repository.ts";
import { AppError, ConflictError, NotFoundError } from "../errors/AppErrors.ts";
import { UserRoleRepository } from "../repositories/userRole.repository.ts";
import { RoleRepository } from "../repositories/role.repository.ts";
import { RolePermissionRepository } from "../repositories/rolePermission.repository.ts";
import { PermissionRepository } from "../repositories/permission.repository.ts";

dotenv.config();

export class AuthService{
  private employeeRepo = new EmployeeRepository();
  private userRoleRepo = new UserRoleRepository();
  private roleRepo = new RoleRepository();
  private rolePermissionRepo = new RolePermissionRepository();
  private permissionRepo = new PermissionRepository()

  async register(input: RegisterInput){
    const { firstName, lastName, email, password, roleId } = input;

    const isEmpExist = await this.employeeRepo.findByEmail(email);

    if (isEmpExist) {
      throw new ConflictError("Employee already exists with this email.", "email");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newEmp = this.employeeRepo.create({
      ...input,
      password: password_hash,
    });

    
    const savedEmp = await this.employeeRepo.save(newEmp);

    const role = await this.roleRepo.findRoleById(roleId);
    if(!role){
      throw new NotFoundError("Role", "roleId");
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
      throw new AppError("Invalid email or password", 401, "UNAUTHORIZED", "email");
    }

    const isPasswordValid = await bcrypt.compare(password, isEmpExist.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401, "UNAUTHORIZED", "password");
    }

    const roles = isEmpExist.userRoles.map(userRole => userRole.role.role_name);

    const roleIds = isEmpExist.userRoles.map(userRole => userRole.role.id);

    const result = roleIds.map(async (id) => {
      const rolePermission = await this.rolePermissionRepo.findByRoleId(id)
      const perm = rolePermission.map(rp => {
        return rp.permission.permission_name
      })
      return perm
    })
    let permissions = []
    
    for(let i = 0; i < result.length; i++){
      let ele = await result[i]
      permissions.push(ele)
    }

    const token = jwt.sign(
      {
        id: isEmpExist.id,
        email: isEmpExist.email,
        roles,
        permissions: permissions.flat()
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: "24h"
      }
    );

    return token;
  }
}
