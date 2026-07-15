import { Arg, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { EmployeeService } from "../services/employee.service.ts";
import { CreateEmployeeInput, EmployeesFilterInput, UpdateEmployeeInput, PaginatedEmployees, AssignRemoveRoleInput } from "../dto/employee.input.ts";
import { Employee } from "../entities/Employee.ts";
import { PermissionMiddleware } from "../middleware/permission.middleware.ts";

@Resolver()
export class EmployeeResolver {
  constructor(private employeeService = new EmployeeService()) {}

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
  async deleteEmployee(
    @Arg("id", () => Int) id: number
  ){
    return this.employeeService.deleteEmployee(id);
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
