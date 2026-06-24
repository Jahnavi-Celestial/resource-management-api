import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { type AppContext } from "./AdminResolver.ts";
import { Booking, BookingStatus } from "../../entities/Booking.ts";
import AppDataSource from "../../database/db.ts";
import { AuditAction, AuditLog } from "../../entities/AuditLog.ts";
import { LessThan, MoreThan } from "typeorm";

@Resolver()
export class ManagerResolver{
    @Authorized("MANAGER")
    @Mutation(() => Booking)
    async approveBooking(
        @Arg("bookingId", () => Int) bookingId: number,
        @Ctx() context: AppContext
    ){
        if(!context?.user || context.user.role !== "MANAGER"){
            throw new Error("Permission Denied")
        }

        return await AppDataSource.transaction(async (tem) => {
            const booking = await tem.findOne(Booking, { 
                where: { id: bookingId },
                relations:{
                    employee: true,
                    equipments: true,
                    meetingRoom: true
                }
            })

            if(!booking){
                throw new Error("Booking record not found.")
            }

            if(booking.status !== BookingStatus.PENDING){
                throw new Error("Only pending requests can be resolved")
            }

            const alreadyApproved = await tem.findOne(Booking, {
                where: {
                    meetingRoom: { id: booking.meetingRoom.id },
                    status: BookingStatus.APPROVED,
                    startTime: LessThan(booking.endTime),
                    endTime: MoreThan(booking.startTime),
                }
            })

            if(alreadyApproved){
                throw new Error("This room is already booked and approved for this time slot")
            }

            const oldStatus = booking.status;
            booking.status = BookingStatus.APPROVED;

            const updatedBooking = await tem.save(booking);

            await tem.save(AuditLog, {
                bookingId: updatedBooking.id,
                action: AuditAction.BOOKING_APPROVED,
                performedById: context.user.id,
                oldStatus,
                newStatus: BookingStatus.APPROVED
            });

            return updatedBooking
        });
    }


    @Authorized("MANAGER")
    @Mutation(() => Booking)
    async rejectBooking(
        @Arg("bookingId", () => Int) bookingId: number,
        @Ctx() context: AppContext
    ){
        if(!context?.user || context.user.role !== "MANAGER"){
            throw new Error("Permission Denied")
        }

        return await AppDataSource.transaction(async (tem) => {
            const booking = await tem.findOne(Booking, { 
                where: { id: bookingId },
                relations:{
                    employee: true,
                    equipments: true,
                    meetingRoom: true
                }
            })

            if (!booking){
                throw new Error("Booking record not found")
            }

            if (booking.status !== BookingStatus.PENDING){
                throw new Error("Only pending requests can be resolved")
            }

            const oldStatus = booking.status;
            booking.status = BookingStatus.REJECTED;

            const updatedBooking = await tem.save(booking);

            await tem.save(AuditLog, {
                bookingId: updatedBooking.id,
                action: AuditAction.BOOKING_REJECTED,
                performedById: context.user.id,
                oldStatus,
                newStatus: BookingStatus.REJECTED
            });

            return updatedBooking
        });
    }
}