import DataLoader from "dataloader";
import AppDataSource from "../config/db.ts";
import { Employee } from "../entities/Employee.ts";
import { MeetingRoom } from "../entities/MeetingRoom.ts";
import { Equipment } from "../entities/Equipment.ts";
import { Booking } from "../entities/Booking.ts";
import { AuditLog } from "../entities/AuditLog.ts";
import { UserRole } from "../entities/UserRole.ts";
import { RolePermission } from "../entities/RolePermission.ts";
import { In } from "typeorm";

export const createLoaders = () => {
    return {
        employeeLoader: new DataLoader<number, Employee>(async (ids) => {
            const employees = await AppDataSource.getRepository(Employee).findBy({ id: In([...ids]) });
            const employeeMap = new Map(employees.map(emp => [emp.id, emp]));
            return ids.map(id => employeeMap.get(id) || new Error(`Employee missing: ${id}`));
        }),

        meetingRoomLoader: new DataLoader<number, MeetingRoom>(async (ids) => {
            const rooms = await AppDataSource.getRepository(MeetingRoom).findBy({ id: In([...ids]) });
            const roomMap = new Map(rooms.map(room => [room.id, room]));
            return ids.map(id => roomMap.get(id) || new Error(`Room missing: ${id}`));
        }),

        bookingsByEmployeeLoader: new DataLoader<number, Booking[]>(async (employeeIds) => {
            const bookings = await AppDataSource.getRepository(Booking).findBy({ employeeId: In([...employeeIds]) });
            const map = new Map<number, Booking[]>();
            employeeIds.forEach(id => map.set(id, []));
            bookings.forEach(b => map.get(b.employeeId)?.push(b));
            return employeeIds.map(id => map.get(id) || []);
        }),

        auditLogsByEmployeeLoader: new DataLoader<number, AuditLog[]>(async (employeeIds) => {
            const logs = await AppDataSource.getRepository(AuditLog).findBy({ performedById: In([...employeeIds]) });
            const map = new Map<number, AuditLog[]>();
            employeeIds.forEach(id => map.set(id, []));
            logs.forEach(l => map.get(l.performedById)?.push(l));
            return employeeIds.map(id => map.get(id) || []);
        }),

        userRolesByEmployeeLoader: new DataLoader<number, UserRole[]>(async (employeeIds) => {
            const userRoles = await AppDataSource.getRepository(UserRole).find({
                where: { employee: { id: In([...employeeIds]) } },
                relations: {
                    role: true,
                    employee: true
                }
            });
            const map = new Map<number, UserRole[]>();
            employeeIds.forEach(id => map.set(id, []));
            userRoles.forEach(ur => map.get(ur.employee.id)?.push(ur));
            return employeeIds.map(id => map.get(id) || []);
        }),

        permissionsByRoleLoader: new DataLoader<number, RolePermission[]>(async (roleIds) => {
            const rolePermissions = await AppDataSource.getRepository(RolePermission).find({
                where: { role: { id: In([...roleIds]) } },
                relations: {
                    permission: true
                }
            });
            const map = new Map<number, RolePermission[]>();
            roleIds.forEach(id => map.set(id, []));
            rolePermissions.forEach(rp => map.get(rp.role.id)?.push(rp));
            return roleIds.map(id => map.get(id) || []);
        }),

        equipmentLoader: new DataLoader<number, Equipment[]>(async (bookingIds) => {
            const equipments = await AppDataSource.getRepository(Equipment)
                .createQueryBuilder("equipment")
                .innerJoinAndSelect("equipment.bookings", "booking")
                .where("booking.id IN (:...bookingIds)", { bookingIds: [...bookingIds] })
                .getMany();

            const equipmentMap = new Map<number, Equipment[]>();
            bookingIds.forEach(id => equipmentMap.set(id, []));
            equipments.forEach(eq => {
                eq.bookings.forEach(b => {
                    if (equipmentMap.has(b.id)) equipmentMap.get(b.id)!.push(eq);
                });
            });
            return bookingIds.map(id => equipmentMap.get(id) || []);
        }),

        bookingsByEquipmentLoader: new DataLoader<number, Booking[]>(async (equipmentIds) => {
            const bookings = await AppDataSource.getRepository(Booking)
                .createQueryBuilder("booking")
                .innerJoinAndSelect("booking.equipments", "equipment")
                .where("equipment.id IN (:...equipmentIds)", { equipmentIds: [...equipmentIds] })
                .getMany();

            const bookingsMap = new Map<number, Booking[]>();
            equipmentIds.forEach(id => bookingsMap.set(id, []));

            bookings.forEach(booking => {
                booking.equipments.forEach(eq => {
                    if (bookingsMap.has(eq.id)) {
                        bookingsMap.get(eq.id)!.push(booking);
                    }
                });
            });

            return equipmentIds.map(id => bookingsMap.get(id) || []);
        }),

        bookingsByMeetingRoomLoader: new DataLoader<number, Booking[]>(async (meetingRoomIds) => {
            const bookings = await AppDataSource.getRepository(Booking).findBy({
                meetingRoomId: In([...meetingRoomIds]),
            });

            const map = new Map<number, Booking[]>();
            meetingRoomIds.forEach((id) => map.set(id, []));
            bookings.forEach((b) => map.get(b.meetingRoomId)?.push(b));

            return meetingRoomIds.map((id) => map.get(id) || []);
        }),

        rolePermissionsByPermissionLoader: new DataLoader<number, RolePermission[]>(async (permissionIds) => {
            const rolePermissions = await AppDataSource.getRepository(RolePermission).find({
                where: { permission: { id: In([...permissionIds]) } },
                relations: {
                    role: true
                }
            });

            const map = new Map<number, RolePermission[]>();
            permissionIds.forEach(id => map.set(id, []));
            rolePermissions.forEach(rp => map.get(rp.permission.id)?.push(rp));

            return permissionIds.map(id => map.get(id) || []);
        }),

        userRolesByRoleLoader: new DataLoader<number, UserRole[]>(async (roleIds) => {
            const userRoles = await AppDataSource.getRepository(UserRole).find({
                where: { role: { id: In([...roleIds]) } },
                relations: {
                    employee: true
                }
            });

            const map = new Map<number, UserRole[]>();
            roleIds.forEach(id => map.set(id, []));
            userRoles.forEach(ur => map.get(ur.role.id)?.push(ur));

            return roleIds.map(id => map.get(id) || []);
        })
    };
};

export type RecordLoaders = ReturnType<typeof createLoaders>;
