import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { Booking, BookingStatus } from "../../entities/Booking.ts";
import { type AppContext } from "./AdminResolver.ts";
import { isNotEmpty } from "class-validator";
import AppDataSource from "../../database/db.ts";
import { MeetingRoom } from "../../entities/MeetingRoom.ts";
import { LessThan, MoreThan } from "typeorm";
import { Equipment } from "../../entities/Equipment.ts";
import { AuditAction, AuditLog } from "../../entities/AuditLog.ts";
import { EquipRequestInput } from "../../types/InputType.ts";

@Resolver()
export class EmployeeResolver{
    @Authorized("EMPLOYEE")
    @Mutation(()=>Booking)
    async createBooking(
        @Arg("startTime", () => Date) startTime: Date,
        @Arg("endTime", () => Date) endTime: Date,
        @Arg("purpose", () => String) purpose: string,
        @Arg("numberOfAttendees", () => Int) numberOfAttendees: number,
        @Arg("meetingRoomId", () => Int) meetingRoomId: number,
        @Arg("equipmentRequested", () => [EquipRequestInput], { nullable: true }) equipmentRequested: EquipRequestInput[],
        @Ctx() context: AppContext
    ){
        if (!context?.user || context.user.role !== "EMPLOYEE") {
            throw new Error("Permission Denied")
        }

        if(!isNotEmpty(startTime) || !isNotEmpty(endTime) || !isNotEmpty(purpose) || !isNotEmpty(numberOfAttendees) || !isNotEmpty(meetingRoomId)){
            throw new Error("Start time, end-time, purpose, numberOfAttendees and room id can't be empty")
        }

        if(numberOfAttendees < 0){
            throw new Error("number of attendees cant be negative")
        }

        if (new Date(startTime) >= new Date(endTime)) {
            throw new Error("Start time must be before end time.");
        }

        return await AppDataSource.transaction(async (tem) => {
            const room = await tem.findOne(MeetingRoom, {
                where: { id: meetingRoomId},
                relations: {
                    bookings: {
                        employee: true,
                        equipments: true
                    }
                }
            })

            if(!room){
                throw new Error('Meeting Room not found')
            }

            if(!room.isActive){
                throw new Error('Meeting Room is not active')
            }

            if(room.capacity < numberOfAttendees){
                throw new Error(`Meeting Room only have capacity of ${room.capacity}`)
            }

            const checkOverlapping = await tem.findOne(Booking, {
                where: {
                    meetingRoomId,
                    status: BookingStatus.APPROVED,
                    startTime: LessThan(endTime),
                    endTime: MoreThan(startTime)
                }
            })

            if(checkOverlapping){
                throw new Error('Meeting room is already booked for this time period')
            }

            const requestedEquipments: Equipment[] = []

            if(equipmentRequested?.length > 0){
                for (const eqObj of equipmentRequested) {
                    const equipment = await tem.findOne(Equipment, { 
                        where: { id: eqObj.equipId } 
                    })

                    if(!equipment){
                        throw new Error(`Equipment ID ${eqObj.equipId} was not found`)
                    }

                    if(!equipment.isActive){
                        throw new Error(`Equipment ${equipment.name} is inactive`)
                    }

                    if(eqObj.quantity < 0){
                        throw new Error('Equipment quantity requested cant be negative')
                    }
    
                    if(equipment.quantityAvailable < eqObj.quantity){
                        throw new Error(`Equipment ${equipment.name} only has ${equipment.quantityAvailable} units available`)
                    }

                    equipment.quantityAvailable -= eqObj.quantity
                    const savedEquipment = await tem.save(equipment)
    
                    requestedEquipments.push(savedEquipment)
                }
            }

            const newBooking = tem.create(Booking, {
                startTime,
                endTime,
                purpose,
                numberOfAttendees,
                status: BookingStatus.PENDING,
                employeeId: context.user.id,
                meetingRoomId,
                equipments: requestedEquipments
            });

            const savedBooking = await tem.save(newBooking);

            await tem.save(AuditLog, {
                bookingId: savedBooking.id,
                action: AuditAction.BOOKING_CREATED,
                performedById: context.user.id,
                oldStatus: null,
                newStatus: BookingStatus.PENDING
            });

            return savedBooking
        })
    }

    @Authorized("EMPLOYEE")
    @Mutation(() => Booking)
    async cancelBooking(
        @Arg("bookingId", () => Int) bookingId: number,
        @Ctx() context: AppContext
    ){
        if(!context?.user || context.user.role !== 'EMPLOYEE'){
            throw new Error("Permission Denied")
        }

        return AppDataSource.transaction(async (tem) => {
            const booking = await tem.findOne(Booking, {
                where: { id: bookingId },
                relations: {
                    equipments: true
                }
            })

            if(!booking){
                throw new Error('Booking not found')
            }

            if(booking.employeeId !== context.user.id){
                throw new Error('You cannot cancel another employees booking')
            }

            if(booking.status !== BookingStatus.PENDING){
                throw new Error('Only pending bookings can be cancelled')
            }

            if(booking.equipments && booking.equipments.length > 0){
                const equipMap = new Map()

                for(const equip of booking.equipments){
                    const currentCount = equipMap.get(equip.id) || 0
                    equipMap.set(equip.id, currentCount + 1)
                }

                for(const [equipId, quantityToRestore] of equipMap) {
                    const equipment = await tem.findOne(Equipment, {
                        where: { id: equipId }
                    })

                    if (equipment) {
                        equipment.quantityAvailable += quantityToRestore
                        await tem.save(equipment)
                    }
                }
            }

            const oldStatus = booking.status
            booking.status = BookingStatus.CANCELLED
            const updatedBooking = await tem.save(booking)

            await tem.save(AuditLog, {
                bookingId: updatedBooking.id,
                action: AuditAction.BOOKING_CANCELLED,
                performedById: context.user.id,
                oldStatus,
                newStatus: BookingStatus.CANCELLED
            })

            return updatedBooking
        })  
    }
}