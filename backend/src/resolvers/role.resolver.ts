import { Arg, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { RoleService } from "../services/roles.service.ts";
import { Roles } from "../entities/Roles.ts";
import { AssignPermissionInput, CreateRoleInput, RemovePermissionInput, UpdateRoleInput } from "../dto/role.input.ts";
import { PermissionMiddleware } from "../middleware/permission.middleware.ts";

@Resolver()
export class RoleResolver {
  private roleService = new RoleService();

  @Mutation(() => Roles)
  @UseMiddleware(PermissionMiddleware("CREATE_ROLE"))
  async createRole(
    @Arg("input", () => CreateRoleInput) input: CreateRoleInput,
  ){
    return this.roleService.createRole(input);
  }

  @Mutation(() => Roles)
  @UseMiddleware(PermissionMiddleware("UPDATE_ROLE"))
  async updateRole(
    @Arg("input", () => UpdateRoleInput) input: UpdateRoleInput,
  ){
    return this.roleService.updateRole(input);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PermissionMiddleware("DELETE_ROLE"))
  async deleteRole(@Arg("id", () => Int) id: number){
    return this.roleService.deleteRole(id);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PermissionMiddleware("ASSIGN_PERMISSION"))
  async assignPermission(
    @Arg("input", ()=>AssignPermissionInput) input: AssignPermissionInput
  ){
        return this.roleService.assignPermissionToRole
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PermissionMiddleware("REMOVE_PERMISSION"))
  async removePermission(
    @Arg("input", ()=>RemovePermissionInput) input: RemovePermissionInput
  ){
        return this.roleService.removePermissionFromRole
  }

  @Query(()=>[Roles])
  async getAllRoles(){
    return this.roleService.getAllRoles()
  }
}
