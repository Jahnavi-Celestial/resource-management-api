import { Arg, Mutation, Resolver } from "type-graphql";
import AppDataSource from "../../database/db.ts";
import { Employee, Role } from "../../entities/Employee.ts"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isEmail, isNotEmpty } from "class-validator";

dotenv.config();

@Resolver()
export class AuthResolver {
    @Mutation(() => Employee)
    async register(
        @Arg("firstName", () => String) firstName: string,
        @Arg("lastName", () => String) lastName: string,
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
        @Arg("role", () => String) role: string,
    ) {
        if(!isNotEmpty(firstName) || !isNotEmpty(email) || !isNotEmpty(password) || !isNotEmpty(role)){
            throw new Error("FirstName, email, password, role can't be empty")
        }

        if (!isEmail(email, { require_tld: true })) {
            throw new Error("Invalid email format");
        }

        if(password.length < 6){
            throw new Error("Password should contain atleast 6 characters")
        }

        const empRepo = AppDataSource.getRepository(Employee);

        const isEmpExist = await empRepo.findOne({
            where: { email: email }
        });

        if (isEmpExist) {
            throw new Error("Employee already exists.");
        }

        const password_hash = await bcrypt.hash(password, 10);

        const newEmp = empRepo.create({
            firstName,
            lastName,
            email,
            password: password_hash,
            role: role as Role 
        });

        return await empRepo.save(newEmp);
    }

    @Mutation(() => String)
    async login(
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string
    ) {
        if(!isNotEmpty(email) || !isNotEmpty(password)){
            throw new Error("email, password can't be empty")
        }
        
        if (!isEmail(email, { require_tld: true })) {
            throw new Error("Invalid email format");
        }

        if(password.length < 6){
            throw new Error("Password should contain atleast 6 characters")
        }
        
        const empRepo = AppDataSource.getRepository(Employee);

        const isEmpExist = await empRepo.findOne({
            where: { email: email }
        });

        if (!isEmpExist) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, isEmpExist.password);

        if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
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
