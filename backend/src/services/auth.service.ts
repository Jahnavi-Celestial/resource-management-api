import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { LoginInput, RegisterInput } from "../dto/auth.input.ts";
import { EmployeeRepository } from "../repositories/employee.repository.ts";
import { AppError, ConflictError } from "../errors/AppErrors.ts";


dotenv.config();

export class AuthService {
  private employeeRepo = new EmployeeRepository();

  async register(input: RegisterInput){
    const { firstName, lastName, email, password, role } = input;

    const isEmpExist = await this.employeeRepo.findByEmail(email);

    if (isEmpExist) {
      throw new ConflictError("Employee already exists.");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newEmp = this.employeeRepo.create({
      ...input,
      password: password_hash,
    });

    return await this.employeeRepo.save(newEmp);
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

    const token = jwt.sign(
      {
        id: isEmpExist.id,
        email: isEmpExist.email,
        role: isEmpExist.role
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: "24h"
      }
    );

    return token;
  }
}
