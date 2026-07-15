import { MiddlewareFn } from "type-graphql";
import { GraphQLError } from "graphql";
import AppDataSource from "../config/db.ts";
import { Employee } from "../entities/Employee.ts";
import { AppContext } from "../index.ts";
import { AppError, NotFoundError } from "../errors/AppErrors.ts";

export function PermissionMiddleware(permission: string): MiddlewareFn<AppContext>{
  return async ({ context }, next) => {
    if (!context.user) {
      throw new AppError("Authentication required", 401, 'UNAUTHORIZED')
    }

    const employeeRepo = AppDataSource.getRepository(Employee)

    const employee = await employeeRepo.findOne({
      where: {
        id: context.user.id,
      },
      relations: {
        userRoles: {
          role: {
            rolePermissions: {
              permission: true,
            },
          },
        },
      },
    })

    if (!employee) {
      throw new NotFoundError("User not found")
    }

    const permissions: string[] = []

    for(const userRole of employee.userRoles){
      for(const rolePermission of userRole.role.rolePermissions){
        permissions.push(rolePermission.permission.permission_name)
      }
    }

    if(!permissions.includes(permission)){
      throw new GraphQLError("You do not have permission to perform this action")
    }

    return next()
  }
}
