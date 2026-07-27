import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { PermissionService } from "../services/index.ts";
import { Permission, RolePermission } from "../entities/index.ts";
import { UpdatePermissionInput } from "../dto/index.ts";
import { PermissionMiddleware } from "../middleware/permission.middleware.ts";
import { type AppContext } from "../index.ts";

@Resolver(() => Permission)
export class PermissionResolver {
  private permissionService = new PermissionService();

  @FieldResolver(() => [RolePermission])
  async rolePermissions(
    @Root() permission: Permission, 
    @Ctx() context: AppContext
  ){
    return context.loaders.rolePermissionsByPermissionLoader.load(permission.id)
  }

  @Mutation(() => Permission)
  @UseMiddleware(PermissionMiddleware("UPDATE_PERMISSION"))
  async updatePermission(
    @Arg("input", () => UpdatePermissionInput) input: UpdatePermissionInput,
  ){
    return this.permissionService.updatePermission(input);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PermissionMiddleware("DELETE_PERMISSION"))
  async deletePermission(@Arg("id", () => Int) id: number){
    return this.permissionService.deletePermission(id);
  }

  @Query(()=>[Permission])
  @UseMiddleware(PermissionMiddleware("VIEW_ALL_PERMISSION"))
  async getAllPermission(){
    return this.permissionService.getAllPermission()
  }

  @Query(() => [RolePermission])
  @UseMiddleware(PermissionMiddleware("VIEW_ALL_PERMISSION_FOR_ROLE"))
  async getAllPermissionForRole(@Arg("roleId", ()=>Int) roleId: number){
    return this.permissionService.getAllPermissionForRole(roleId)
  }
}
