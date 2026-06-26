import { Arg, Authorized, Ctx, Int, Query, Resolver } from "type-graphql";
import { BookingsPerEmployee, EquipmentUsage, MonthlyBookingStatics, MostBookedRoom } from "../../types/ObjectType.ts";
import { type AppContext } from "../mutations/AdminResolver.ts";
import AppDataSource from "../../database/db.ts";
import { Booking } from "../../entities/Booking.ts";
import { Employee } from "../../entities/Employee.ts";
import { Equipment } from "../../entities/Equipment.ts";


@Resolver()
export class ReportQueries{
    
    @Authorized()
    @Query(() => MostBookedRoom)
    async mostBookedRoom(
        @Ctx() context: AppContext
    ){
        if(!context?.user){
            throw new Error('Unauthorized')
        }

        const result = await AppDataSource.query(`
            select count(b.id) as total, m.id, m.name  
            from bookings b
            join
            meeting_room m 
            on m.id = b."meetingRoomId"
            group by m.id
            order by total desc
            limit 1
            `,
        )

        return {
            name: result[0].name,
            total: result[0].total
        }
    }

    @Authorized(["ADMIN", "MANAGER"])
    @Query(() => BookingsPerEmployee)
    async bookingsPerEmployee(
        @Arg("empId", () => Int) empId: number,
        @Ctx() context: AppContext
    ){
        if(!context?.user || (context.user.role !== "ADMIN" && context.user.role !== "MANAGER")){
            throw new Error("Permission Denied")
        }

        const emp = await AppDataSource.getRepository(Employee).findOne({where: {id: empId}})

        if(!emp){
            throw new Error('Employee not found')
        }

        const bookingRepo = AppDataSource.getRepository(Booking)

        const booking = await bookingRepo.find({
            where: {
                employeeId: empId
            },
            relations: {
                employee: true,
                equipments: true,
                meetingRoom: true
            }
        })

        
        return {
            employeeName: emp.firstName,
            bookingCount: booking.length
        }
    }

    @Authorized(["ADMIN", "MANAGER"])
    @Query(() => EquipmentUsage)
    async equipmentUsage(
        @Arg("equipId", () => Int) equipId: number,
        @Ctx() context: AppContext
    ){
        if(!context?.user || (context.user.role !== "ADMIN" && context.user.role !== "MANAGER")){
            throw new Error("Permission Denied")
        }

        const equipRepo = AppDataSource.getRepository(Equipment)

        const equipment = await equipRepo.findOne({
            where: {id: equipId},
            relations: {
                bookings: true
            }
        })

        if(!equipment){
            throw new Error('Equipment not found')
        }

        const result = await AppDataSource.query(`
            select count(*) from booking_equipments where "equipmentId" = $1;
            `,
            [equipId]
        ) 

        return {
            equipmentName: equipment.name,
            timesUsage: result[0].count
        }
    }

    @Authorized(["MANAGER"])
    @Query(() => MonthlyBookingStatics)
    async monthlyBookingStatics(
        @Arg("month", () => Int) month: number,
        @Arg("year", () => Int) year: number,
        @Ctx() context: AppContext
    ){
        if(!context?.user || (context.user.role !== "MANAGER")){
            throw new Error("Permission Denied")
        }

        if(month < 1 || month > 12){
            throw new Error('Invalid Month')
        }

        const result = await AppDataSource.query(
            `select 
            count(*) as "totalBookings",
            count(case when status = 'APPROVED' then 1 end) as "approvedBookings",
            count(case when status = 'REJECTED' then 1 end) as "rejectedBookings"
            from bookings
            where 
            extract(month from "createdAt") = $1
            and extract(year from "createdAt") = $2
            `,
            [month, year]
        )

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const monthName = months[month - 1]

        return {
            month: monthName,
            totalBookings: result[0].totalBookings,
            approvedBookings: result[0].approvedBookings,
            rejectedBookings: result[0].rejectedBookings
        }
    }

}