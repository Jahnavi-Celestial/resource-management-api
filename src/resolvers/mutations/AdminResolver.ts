import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Employee, Role } from "../../entities/Employee.ts";
import AppDataSource from "../../database/db.ts";
import { MeetingRoom } from "../../entities/MeetingRoom.ts";
import { Booking } from "../../entities/Booking.ts";
import { Equipment } from "../../entities/Equipment.ts";
import bcrypt from "bcrypt";
import { isEmail, isNotEmpty } from "class-validator";

export interface AppContext {
  user: Employee; 
}

@Resolver()
export class AdminResolver {

    @Authorized("ADMIN")
    @Mutation(() => Employee)
    async createEmployee(
        @Arg("firstName", () => String) firstName: string,
        @Arg("lastName", () => String) lastName: string,
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
        @Arg("role", () => Role) role: Role,
        @Ctx() context: AppContext,
    ){
        if (!context?.user || context.user.role !== "ADMIN") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(firstName) || !isNotEmpty(email) || !isNotEmpty(password) || !isNotEmpty(role)){
            throw new Error("FirstName, email, password, role can't be empty")
        }
        
        if (!isEmail(email, { require_tld: true })) {
            throw new Error("Invalid email format");
        }
        
        if(password.length < 6){
            throw new Error("Password should contain atleast 6 characters")
        }

        const empRepo = AppDataSource.getRepository(Employee)

        const isEmpExist = await empRepo.findOne({ where: { email } })

        if (isEmpExist) throw new Error("Employee email already registered")

        const hashedPassword = await bcrypt.hash(password, 10)

        const createEmp = empRepo.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        });

        return await empRepo.save(createEmp)
    }

    @Authorized("ADMIN")
    @Mutation(() => Employee)
    async updateEmployee(
        @Arg("id", () => Int) id: number,
        @Arg("firstName", () => String) firstName: string,
        @Arg("lastName", () => String) lastName: string,
        @Arg("email", () => String) email: string,
        @Arg("role", () => Role) role: Role,
        @Ctx() context: AppContext,
    ){
        if (!context?.user || context.user.role !== "ADMIN") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(firstName) || !isNotEmpty(email) || !isNotEmpty(id) || !isNotEmpty(role)){
            throw new Error("FirstName, email, employee id, role can't be empty")
        }
        
        if (email && !isEmail(email, { require_tld: true })) {
            throw new Error("Invalid email format");
        }

        const empRepo = AppDataSource.getRepository(Employee)

        const searchEmp = await empRepo.findOne({ where: { id } })

        if (!searchEmp) throw new Error("Employee does not exist")

        return await empRepo.save({
            ...searchEmp,
            firstName, 
            lastName, 
            email, 
            role 
        })
    }

    @Authorized("ADMIN")
    @Mutation(() => Boolean)
    async deleteEmployee(
        @Arg("id", () => Int) id: number,
        @Ctx() context: AppContext,
    ){
        if (!context?.user || context.user.role !== "ADMIN") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(id)){
            throw new Error("employee id can't be empty")
        }

        const empRepo = AppDataSource.getRepository(Employee);

        const searchEmp = await empRepo.findOne({ where: { id } })

        if (!searchEmp) throw new Error("Employee does not exist")

        const result = await empRepo.delete(id)
        return result.affected
    }

    @Authorized("ADMIN")
    @Mutation(() => MeetingRoom) 
    async createRoom(
        @Arg("name", () => String) name: string,
        @Arg("location", () => String) location: string,
        @Arg("capacity", () => Int) capacity: number,
        @Arg("isActive", () => Boolean) isActive: boolean,
        @Ctx() context: AppContext,
    ){
        if (!context?.user || context.user.role !== "ADMIN") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(name) || !isNotEmpty(location) || !isNotEmpty(capacity)){
            throw new Error("Room name, location, capacity can't be empty")
        }

        const meetingRoomRepo = AppDataSource.getRepository(MeetingRoom)

        const newRoom = meetingRoomRepo.create({ 
            name, 
            location, 
            capacity, 
            isActive
        })

        return await meetingRoomRepo.save(newRoom)
    }

    @Authorized("ADMIN")
    @Mutation(() => MeetingRoom)
    async updateRoom(
        @Arg("id", () => Int) id: number,
        @Arg("name", () => String) name: string,
        @Arg("location", () => String) location: string,
        @Arg("capacity", () => Int) capacity: number,
        @Arg("isActive", () => Boolean) isActive: boolean,
        @Ctx() context: AppContext,
    ){
        if (!context?.user || context.user.role !== "ADMIN") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(id) || !isNotEmpty(name) || !isNotEmpty(location) || !isNotEmpty(capacity)){
            throw new Error("Room id, name, location, capacity can't be empty")
        }

        const meetingRoomRepo = AppDataSource.getRepository(MeetingRoom)

        const searchRoom = await meetingRoomRepo.findOne({ where: { id } })

        if (!searchRoom) throw new Error("Meeting Room does not exist")

        return await meetingRoomRepo.save({
            ...searchRoom,
            name, 
            location, 
            capacity, 
            isActive
        });
    }

    @Authorized("ADMIN")
    @Mutation(() => Boolean)
    async deleteRoom(
        @Arg("id", () => Int) id: number,
        @Ctx() context: AppContext,
    ){
        if (!context?.user || context.user.role !== "ADMIN") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(id)){
            throw new Error("room id can't be empty")
        }

        const meetingRoomRepo = AppDataSource.getRepository(MeetingRoom);

        const searchRoom = await meetingRoomRepo.findOne({ where: { id } })

        if (!searchRoom) throw new Error("Meeting Room does not exist")

        const result = await meetingRoomRepo.delete(id)

        return result.affected
    }

    @Authorized("ADMIN")
    @Mutation(() => Equipment)
    async createEquipment(
        @Arg("name", () => String) name: string,
        @Arg("quantityAvailable", () => Int) quantityAvailable: number,
        @Arg("isActive", () => Boolean) isActive: boolean,
        @Ctx() context: AppContext,
    ){
        if (!context?.user || context.user.role !== "ADMIN") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(name) || !isNotEmpty(quantityAvailable)){
            throw new Error("Equipment Name, available quantity can't be empty")
        }

        const equipRepo = AppDataSource.getRepository(Equipment)
        const newEquip = equipRepo.create({ 
            name, 
            quantityAvailable, 
            isActive 
        });

        return await equipRepo.save(newEquip)
    }

    @Authorized("ADMIN")
    @Mutation(() => Equipment)
    async updateEquipment(
        @Arg("id", () => Int) id: number,
        @Arg("name", () => String) name: string,
        @Arg("quantityAvailable", () => Int) quantityAvailable: number,
        @Arg("isActive", () => Boolean) isActive: boolean,
        @Ctx() context: AppContext,
    ){
        if (!context?.user || context.user.role !== "ADMIN") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(id) || !isNotEmpty(name) || !isNotEmpty(quantityAvailable)){
            throw new Error("Equipment id, name, available quantity can't be empty")
        }

        const equipRepo = AppDataSource.getRepository(Equipment)

        const searchEquip = await equipRepo.findOne({ where: { id } })

        if (!searchEquip) throw new Error("Equipment does not exist")

        return await equipRepo.save({
            ...searchEquip,
            name, 
            quantityAvailable, 
            isActive
        })
    }

    @Authorized("ADMIN")
    @Mutation(() => Boolean)
    async deleteEquipment(
        @Arg("id", () => Int) id: number,
        @Ctx() context: AppContext,
    ){
        if (!context?.user || context.user.role !== "ADMIN") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(id)){
            throw new Error("equipment id can't be empty")
        }

        const equipRepo = AppDataSource.getRepository(Equipment)

        const searchEquip = await equipRepo.findOne({ where: { id } })

        if (!searchEquip) throw new Error("Equipment does not exist")

        const result = await equipRepo.delete(id)
        return result.affected
    }
}
