import { AuthResolver } from "./auth.resolver.ts";
import { BookingResolver } from "./booking.resolver.ts";
import { EmployeeResolver } from "./employee.resolver.ts";
import { EquipmentResolver } from "./equipment.resolver.ts";
import { MeetingRoomResolver } from "./meetingRoom.resolver.ts";
import { PermissionResolver } from "./permission.resolver.ts";
import { ReportResolver } from "./report.reolver.ts";
import { RoleResolver } from "./role.resolver.ts";


export const resolver = [AuthResolver, EmployeeResolver, MeetingRoomResolver, EquipmentResolver, BookingResolver, ReportResolver, RoleResolver, PermissionResolver] as const