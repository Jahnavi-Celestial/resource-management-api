import { DataSource } from "typeorm";
import { Employee } from "../entities/Employee.ts";
import { Equipment } from "../entities/Equipment.ts";
import { MeetingRoom } from "../entities/MeetingRoom.ts";
import { Booking } from "../entities/Booking.ts";
import { AuditLog } from "../entities/AuditLog.ts";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: String(process.env.DB_PASSWORD)!,
    database: "resource_management_db",
    entities: [Employee, Equipment, MeetingRoom, Booking, AuditLog],
    synchronize: true
})

export default AppDataSource;