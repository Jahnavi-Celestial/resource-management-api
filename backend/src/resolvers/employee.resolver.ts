import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { EmployeeService } from "../services/employee.service.ts";
import { CreateEmployeeInput, EmployeesFilterInput, UpdateEmployeeInput, PaginatedEmployees } from "../dto/employee.input.ts";
import { Employee } from "../entities/Employee.ts";

@Resolver()
export class EmployeeResolver {
  constructor(private employeeService = new EmployeeService()) {}

  @Authorized("ADMIN")
  @Mutation(() => Employee)
  async createEmployee(
    @Arg("input", ()=>CreateEmployeeInput) input: CreateEmployeeInput
  ){
    return this.employeeService.createEmployee(input);
  }

  @Authorized("ADMIN")
  @Mutation(() => Employee)
  async updateEmployee(
    @Arg("input", ()=>UpdateEmployeeInput) input: UpdateEmployeeInput
  ){
    return this.employeeService.updateEmployee(input);
  }

  @Authorized("ADMIN")
  @Mutation(() => Boolean)
  async deleteEmployee(
    @Arg("id", () => Int) id: number
  ){
    return this.employeeService.deleteEmployee(id);
  }

  @Authorized(["ADMIN", "MANAGER"])
  @Query(() => PaginatedEmployees)
  async employees(
    @Arg("input", ()=>EmployeesFilterInput) input: EmployeesFilterInput
  ){
    return await this.employeeService.getEmployees(input);
  }

  @Authorized(["ADMIN", "MANAGER"])
  @Query(() => Employee)
  async employee(
    @Arg("id", () => Int) id: number
  ){
    return await this.employeeService.getEmployeeById(id);
  }
}
