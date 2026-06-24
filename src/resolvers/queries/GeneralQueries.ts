import { Arg, Authorized, Ctx, Int, Query, Resolver } from "type-graphql";
import { Booking, BookingStatus } from "../../entities/Booking.ts";
import { type AppContext } from "../mutations/AdminResolver.ts";
import AppDataSource from "../../database/db.ts";
import { ILike } from "typeorm";
import { Employee } from "../../entities/Employee.ts";
import { MeetingRoom } from "../../entities/MeetingRoom.ts";
import { Equipment } from "../../entities/Equipment.ts";
import { PaginatedBookings, PaginatedEmployees, PaginatedEquipments, PaginatedRooms } from "../../types/ObjectType.ts";


@Resolver()
export class GeneralQueries{

    @Authorized(["ADMIN","MANAGER"])
    @Query(() => PaginatedBookings)
    async bookings(
        @Ctx() context: AppContext,
        @Arg("page", () => Int, {defaultValue: 1}) page: number,
        @Arg("limit", () => Int, {defaultValue: 10}) limit: number,
        @Arg("bookingStatus", () => BookingStatus, {nullable: true}) bookingStatus?: BookingStatus,
    ){
        if(!context?.user || (context.user.role !== "ADMIN" && context.user.role !== "MANAGER")){
            throw new Error("Permission Denied")
        }
    
        const bookingRepo = AppDataSource.getRepository(Booking)

        const skip = (page - 1) * limit;
        const take = limit

        let bookings: Booking[] = []
        let totalCount = 0

        if(bookingStatus){
            [bookings, totalCount] = await bookingRepo.findAndCount({
                where: {
                    status: bookingStatus 
                },
                relations:{
                    employee: true,
                    meetingRoom: true,
                    equipments: true
                },
                order: {
                    createdAt: 'DESC'
                },
                skip: skip,
                take: take 
            })
        }
        else{
            [bookings, totalCount] = await bookingRepo.findAndCount({
                relations:{
                    employee: true,
                    meetingRoom: true,
                    equipments: true
                },
                skip: skip,
                take: take,
                order: { id: "DESC" },
            })
        }
    
        return {
            bookings,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit) || 1
        }
    }

    @Authorized()
    @Query(() => Booking)
    async booking(
        @Arg("id", () => Int) id: number,
        @Ctx() context: AppContext,
    ){
        if(!context?.user){
            throw new Error('Unauthorized')
        }

        const bookingRepo = AppDataSource.getRepository(Booking)

        const booking = await bookingRepo.findOne({
            where: {
                id
            },
            relations:{
                employee: true,
                meetingRoom: true,
                equipments: true
            },
        })

        if(!booking){
            throw new Error('Booking not found')
        }

        return booking
    }

    @Authorized("EMPLOYEE")
    @Query(() => PaginatedBookings)
    async viewOwnBooking(
        @Ctx() context: AppContext,
        @Arg("page", () => Int, {defaultValue: 1}) page: number,
        @Arg("limit", () => Int, {defaultValue: 10}) limit: number,
        @Arg("bookingStatus", () => BookingStatus, {nullable: true}) bookingStatus?: BookingStatus,
    ){
        if (!context?.user || context.user.role !== "EMPLOYEE") {
            throw new Error("Permission Denied")
        }

        const empId = context.user.id 

        const bookingRepo = AppDataSource.getRepository(Booking)

        const skip = (page - 1) * limit;
        const take = limit

        let bookings: Booking[] = []
        let totalCount = 0

        if(bookingStatus){
            [bookings, totalCount] = await bookingRepo.findAndCount({
                where: {
                    employeeId: empId,
                    status: bookingStatus 
                },
                relations:{
                    employee: true,
                    meetingRoom: true,
                    equipments: true
                },
                order: {
                    createdAt: 'DESC'
                },
                skip: skip,
                take: take 
            })
        }
        else{
            [bookings, totalCount] = await bookingRepo.findAndCount({
                where: {
                    employeeId: empId,
                },
                relations:{
                    employee: true,
                    meetingRoom: true,
                    equipments: true
                },
                skip: skip,
                take: take,
                order: { id: "DESC" },
            })
        }
    
        return {
            bookings,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit) || 1
        }
    }

    @Authorized()
    @Query(() => PaginatedEmployees)
    async employees(
        @Ctx() context: AppContext,
        @Arg("page", () => Int, {defaultValue: 1}) page: number,
        @Arg("limit", () => Int, {defaultValue: 10}) limit: number,
        @Arg("searchTerm", () => String, {nullable: true}) searchTerm?: string
    ){
        if(!context?.user){
            throw new Error('Unauthorized')
        }

        const skip = (page - 1) * limit
        const take = limit

        const empRepo = AppDataSource.getRepository(Employee)

        let employees: Employee[] = []
        let totalCount = 0

        if(searchTerm){
            [employees, totalCount] = await empRepo.findAndCount({
                where:{
                    firstName: ILike(`%${searchTerm}%`)
                },
                relations:{
                    bookings: {
                        meetingRoom: true,
                        employee: true,
                        equipments: true
                    },
                    auditLogs: true
                },
                order: { id: "DESC" },
                skip: skip,
                take: take,
            })
        }
        else{
            [employees, totalCount] = await empRepo.findAndCount({
                relations:{
                    bookings: {
                        meetingRoom: true,
                        employee: true,
                        equipments: true
                    },
                    auditLogs: true
                },
                skip: skip,
                take: take,
                order: { id: "DESC" },
            })
        }

        return {
            employees,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit) || 1
        }
    }

    @Authorized()
    @Query(() => Employee)
    async employee(
        @Arg("id", () => Int) id: number,
        @Ctx() context: AppContext,
    ){
        if(!context?.user){
            throw new Error('Unauthorized')
        }

        const empRepo = AppDataSource.getRepository(Employee)

        const employee = await empRepo.findOne({
            where: {id},
            relations:{
                bookings: {
                    meetingRoom: true,
                    employee: true,
                    equipments: true
                },
                auditLogs: true
            },
        })

        if(!employee){
            throw new Error('Employee not found')
        }

        return employee
    }

    @Authorized()
    @Query(() => PaginatedRooms)
    async rooms(
        @Ctx() context: AppContext,
        @Arg("page", () => Int, {defaultValue: 1}) page: number,
        @Arg("limit", () => Int, {defaultValue: 10}) limit: number,
        @Arg("searchTerm", () => String, {nullable: true}) searchTerm?: string
    ){
        if(!context?.user){
            throw new Error('Unauthorized')
        }

        const skip = (page - 1) * limit
        const take = limit

        const roomRepo = AppDataSource.getRepository(MeetingRoom)

        let rooms: MeetingRoom[] = []
        let totalCount = 0

        if(searchTerm){
            [rooms, totalCount] = await roomRepo.findAndCount({
                where: {
                    name: ILike(`%${searchTerm}%`)
                },
                relations:{
                    bookings:{
                        employee: true,
                        equipments: true,
                        meetingRoom: true
                    }
                },
                order: {id: 'DESC'},
                skip,
                take,
            })
        }
        else{
            [rooms, totalCount] = await roomRepo.findAndCount({
                relations:{
                    bookings:{
                        employee: true,
                        equipments: true,
                        meetingRoom: true
                    }
                },
                skip,
                take,
                order: {id: 'DESC'}
            })
        }

        return {
            rooms,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit) || 1
        }
    }

    @Authorized()
    @Query(() => MeetingRoom)
    async room(
        @Arg("id", () => Int) id: number,
        @Ctx() context: AppContext,
    ){
        if(!context?.user){
            throw new Error('Unauthorized')
        }

        const roomRepo = AppDataSource.getRepository(MeetingRoom)

        const room = await roomRepo.findOne({
            where: {id},
            relations:{
                bookings:{
                    employee: true,
                    equipments: true,
                    meetingRoom: true
                }
            },
        })

        if(!room){
            throw new Error('Meeting room not found')
        }

        return room
    }

    @Authorized()
    @Query(() => PaginatedEquipments)
    async equipments(
        @Ctx() context: AppContext,
        @Arg("page", () => Int, {defaultValue: 1}) page: number,
        @Arg("limit", () => Int, {defaultValue: 10}) limit: number,
        @Arg("searchTerm", () => String, {nullable: true}) searchTerm?: string
    ){
        if(!context?.user){
            throw new Error('Unauthorized')
        }

        const skip = (page - 1) * limit
        const take = limit

        const equipRepo = AppDataSource.getRepository(Equipment)

        let equipments: Equipment[] = []
        let totalCount = 0

        if(searchTerm){
            [equipments, totalCount] = await equipRepo.findAndCount({
                where: {
                    name: ILike(`%${searchTerm}%`)
                },
                relations:{
                    bookings:{
                        employee: true,
                        equipments: true,
                        meetingRoom: true
                    }
                },
                order: {id: 'DESC'},
                skip,
                take,
            })
        }
        else{
            [equipments, totalCount] = await equipRepo.findAndCount({
                relations:{
                    bookings:{
                        employee: true,
                        equipments: true,
                        meetingRoom: true
                    }
                },
                skip,
                take,
                order: {id: 'DESC'}
            })
        }

        return {
            equipments,
            total: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit) || 1
        }
    }

    @Authorized()
    @Query(() => Equipment)
    async equipment(
        @Arg("id", () => Int) id: number,
        @Ctx() context: AppContext,
    ){
        if(!context?.user){
            throw new Error('Unauthorized')
        }

        const equipRepo = AppDataSource.getRepository(Equipment)

        const equipment = await equipRepo.findOne({
            where: {id},
            relations:{
                bookings:{
                    employee: true,
                    equipments: true,
                    meetingRoom: true
                }
            },
        })

        if(!equipment){
            throw new Error('Equipment not found')
        }

        return equipment
    }
    
}