import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { EmployeeService } from "../services/index.ts";
import { CreateEmployeeInput, EmployeesFilterInput, UpdateEmployeeInput, PaginatedEmployees, AssignRemoveRoleInput } from "../dto/index.ts";
import { Employee, Booking, AuditLog, UserRole } from "../entities/index.ts";
import { PermissionMiddleware } from "../middleware/permission.middleware.ts";
import { type AppContext } from "../index.ts";

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private employeeService = new EmployeeService()) {}

  @FieldResolver(() => [Booking])
  async bookings(
    @Root() employee: Employee, 
    @Ctx() ctx: AppContext
  ){
    return ctx.loaders.bookingsByEmployeeLoader.load(employee.id)
  }

  @FieldResolver(() => [AuditLog])
  async auditLogs(
    @Root() employee: Employee, 
    @Ctx() ctx: AppContext
  ){
    return ctx.loaders.auditLogsByEmployeeLoader.load(employee.id)
  }

  @FieldResolver(() => [UserRole])
  async userRoles(
    @Root() employee: Employee, 
    @Ctx() ctx: AppContext
  ){
    return ctx.loaders.userRolesByEmployeeLoader.load(employee.id)
  }

  @Mutation(() => Employee)
  @UseMiddleware(PermissionMiddleware("CREATE_EMPLOYEE"))
  async createEmployee(
    @Arg("input", ()=>CreateEmployeeInput) input: CreateEmployeeInput
  ){
    return this.employeeService.createEmployee(input);
  }

  @Mutation(() => Employee)
  @UseMiddleware(PermissionMiddleware("UPDATE_EMPLOYEE"))
  async updateEmployee(
    @Arg("input", ()=>UpdateEmployeeInput) input: UpdateEmployeeInput
  ){
    return this.employeeService.updateEmployee(input);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PermissionMiddleware("DELETE_EMPLOYEE"))
  async deleteEmployees(
    @Arg("ids", () => [Int]) ids: number[]
  ){
    return this.employeeService.deleteEmployees(ids);
  }

  @Query(() => PaginatedEmployees)
  @UseMiddleware(PermissionMiddleware("VIEW_ALL_EMPLOYEE"))
  async employees(
    @Arg("input", ()=>EmployeesFilterInput) input: EmployeesFilterInput
  ){
    return await this.employeeService.getEmployees(input);
  }

  @Query(() => Employee)
  @UseMiddleware(PermissionMiddleware("VIEW_EMPLOYEE"))
  async employee(
    @Arg("id", () => Int) id: number
  ){
    return await this.employeeService.getEmployeeById(id);
  }

  @Mutation(()=>Employee)
  @UseMiddleware(PermissionMiddleware("ASSIGN_ROLE"))
  async assignRole(
    @Arg("input", ()=>AssignRemoveRoleInput) input: AssignRemoveRoleInput
  ){
    return await this.employeeService.assignRole(input)
  }

  @Mutation(()=>Boolean)
  @UseMiddleware(PermissionMiddleware("REMOVE_ROLE"))
  async removeRole(
    @Arg("input", ()=>AssignRemoveRoleInput) input: AssignRemoveRoleInput
  ){
    return await this.employeeService.removeRole(input)
  }
}
