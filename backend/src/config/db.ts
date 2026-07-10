import { DataSource } from "typeorm";
import { Employee } from "../entities/Employee.ts";
import { Equipment } from "../entities/Equipment.ts";
import { MeetingRoom } from "../entities/MeetingRoom.ts";
import { Booking } from "../entities/Booking.ts";
import { AuditLog } from "../entities/AuditLog.ts";
import dotenv from "dotenv";
import { Notification } from "../entities/Notification.ts";

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_URL || "",
    entities: [Employee, Equipment, MeetingRoom, Booking, AuditLog, Notification],
})

export default AppDataSource;