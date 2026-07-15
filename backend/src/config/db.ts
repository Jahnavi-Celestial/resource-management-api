import { DataSource } from "typeorm";
import { Employee } from "../entities/Employee.ts";
import { Equipment } from "../entities/Equipment.ts";
import { MeetingRoom } from "../entities/MeetingRoom.ts";
import { Booking } from "../entities/Booking.ts";
import { AuditLog } from "../entities/AuditLog.ts";
import dotenv from "dotenv";
import { Notification } from "../entities/Notification.ts";
import { Roles } from "../entities/Roles.ts";
import { Permission } from "../entities/Permission.ts";
import { RolePermission } from "../entities/RolePermission.ts";
import { UserRole } from "../entities/UserRole.ts";

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    entities: [Employee, Equipment, MeetingRoom, Booking, AuditLog, Notification, Roles, Permission, RolePermission, UserRole],
    url: process.env.DB_URL || "",
})

export default AppDataSource;