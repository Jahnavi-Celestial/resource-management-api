import cron from "node-cron";
import AppDataSource from "../config/db.ts";
import { Booking, BookingStatus } from "../entities/Booking.ts";
import { LessThan } from "typeorm";

const bookingCron = () => {
  const task = async () => {
    const bookingRepo = AppDataSource.getRepository(Booking);
    const now = new Date();

    try {
      const approvedResult = await bookingRepo.update(
        {
          status: BookingStatus.APPROVED,
          endTime: LessThan(now),
        },
        {
          status: BookingStatus.COMPLETED,
        }
      );
      
      if (approvedResult.affected && approvedResult.affected > 0) {
        console.log(`Successfully completed ${approvedResult.affected} expired bookings.`);
      }

      const pendingResult = await bookingRepo.update(
        {
          status: BookingStatus.PENDING,
          endTime: LessThan(now),
        },
        {
          status: BookingStatus.REJECTED,
          rejectionReason: "Request time expired.",
        }
      );

      if (pendingResult.affected && pendingResult.affected > 0) {
        console.log(`Successfully auto-rejected ${pendingResult.affected} expired pending requests.`);
      }

    } catch (error) {
      console.error("Error running booking cron job:", error);
    }
  };

  cron.schedule("* * * * *", task);
};

export default bookingCron;
