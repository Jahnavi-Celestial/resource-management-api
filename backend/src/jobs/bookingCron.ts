import cron from "node-cron";
import AppDataSource from "../config/db.ts";
import { Booking, BookingStatus } from "../entities/Booking.ts";
import { LessThan } from "typeorm";
import { Server } from "socket.io";
import { dispatchSystemNotification } from "../sockets/notification.socket.ts";

const bookingCron = (io: Server) => { 
  const task = async () => {
    const bookingRepo = AppDataSource.getRepository(Booking);
    const now = new Date();

    try {
      const expiredApproved = await bookingRepo.find({
        where: { status: BookingStatus.APPROVED, endTime: LessThan(now) }
      });

      if (expiredApproved.length > 0) {
        for (const booking of expiredApproved) {
          booking.status = BookingStatus.COMPLETED;
          await bookingRepo.save(booking);

          await dispatchSystemNotification(
            io,
            booking.employeeId,
            "Booking Completed",
            `Your booking for resource has been marked as completed.`,
            booking.id,
          );
        }
        console.log(`Successfully completed ${expiredApproved.length} expired bookings.`);
      }

      const expiredPending = await bookingRepo.find({
        where: { status: BookingStatus.PENDING, endTime: LessThan(now) }
      });

      if (expiredPending.length > 0) {
        for (const booking of expiredPending) {
          booking.status = BookingStatus.REJECTED;
          booking.rejectionReason = "Request time expired.";
          await bookingRepo.save(booking);

          await dispatchSystemNotification(
            io,
            booking.employeeId,
            "Booking Automatically Rejected",
            `Your pending booking request expired and was automatically rejected.`,
            booking.id
          );
        }
        console.log(`Booking successfully auto-rejected`);
      }

    } catch (error) {
      console.error("Error running booking cron job:", error);
    }
  };

  cron.schedule("* * * * *", task);
};

export default bookingCron;
