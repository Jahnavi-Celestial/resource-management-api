import { UpdatePermissionInput } from "../dto/index.ts";
import { NotFoundError } from "../errors/AppErrors.ts";
import { PermissionRepository, RolePermissionRepository } from "../repositories/index.ts";

export class PermissionService{
  constructor(private permissionRepo = new PermissionRepository()) {}
  private rolePermissionRepo = new RolePermissionRepository()

  async updatePermission(input: UpdatePermissionInput){
    const { name, id } = input

    const isExist = await this.permissionRepo.findPermissionById(id);

    if(!isExist){
      throw new NotFoundError("Permission", "id");
    }

    return this.permissionRepo.savePermission({
      ...isExist,
      permission_name: name.toUpperCase(),
    });
  }

  async deletePermission(id: number){
    const isExist = await this.permissionRepo.findPermissionById(id);
    if(!isExist){
      throw new NotFoundError("Permission", "id");
    }

    return this.permissionRepo.deletePermission(id);
  }

  async getAllPermission(){
    const permissions = await this.permissionRepo.findPermission();
    return permissions
  }

  async getAllPermissionForRole(roleId: number){
    const isExist = await this.rolePermissionRepo.findByRoleId(roleId)

    if(!isExist){
      throw new NotFoundError('Role', "roleId")
    }

    return isExist
  }
}
