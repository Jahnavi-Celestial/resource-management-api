import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { RoleService } from "../services/roles.service.ts";
import { Roles } from "../entities/Roles.ts";
import { AssignPermissionInput, CreateRoleInput, RemovePermissionInput, UpdateRoleInput } from "../dto/role.input.ts";
import { PermissionMiddleware } from "../middleware/permission.middleware.ts";
import { RolePermission } from "../entities/RolePermission.ts";
import { type AppContext } from "../index.ts";
import { UserRole } from "../entities/UserRole.ts";

@Resolver(() => Roles)
export class RoleResolver {
  private roleService = new RoleService();

  @FieldResolver(() => [RolePermission])
  async rolePermissions(
    @Root() role: Roles, 
    @Ctx() ctx: AppContext
  ){
    return ctx.loaders.permissionsByRoleLoader.load(role.id)
  }

  @FieldResolver(() => [UserRole])
  async userRoles(
    @Root() role: Roles,
    @Ctx() context: AppContext
  ){
    return context.loaders.userRolesByRoleLoader.load(role.id)
  }

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
      this.roleService.assignPermissionToRole(input)
      return true
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PermissionMiddleware("REMOVE_PERMISSION"))
  async removePermission(
    @Arg("input", ()=>RemovePermissionInput) input: RemovePermissionInput
  ){
      this.roleService.removePermissionFromRole(input)
      return true
  }

  @Query(()=>[Roles])
  async getAllRoles(){
    return this.roleService.getAllRoles()
  }
}
