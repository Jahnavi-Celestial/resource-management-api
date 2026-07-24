import {
  AssignPermissionInput,
  CreateRoleInput,
  RemovePermissionInput,
  UpdateRoleInput,
} from "../dto/role.input.ts";
import { ConflictError, NotFoundError } from "../errors/AppErrors.ts";
import { PermissionRepository } from "../repositories/permission.repository.ts";
import { RoleRepository } from "../repositories/role.repository.ts";
import { RolePermissionRepository } from "../repositories/rolePermission.repository.ts";

export class RoleService{
  constructor(
    private roleRepo = new RoleRepository(),
    private permissionRepo = new PermissionRepository(),
    private rolePermissionRepo = new RolePermissionRepository(),
  ) {}
  async createRole(input: CreateRoleInput){
    const { name } = input;

    const isExist = await this.roleRepo.findRoleByName(name.toLowerCase());

    if(isExist){
      throw new ConflictError("Role already exists, you can only update it.", "name");
    }

    const newRole = await this.roleRepo.createRole({ role_name: name });
    return await this.roleRepo.saveRole(newRole);
  }

  async updateRole(input: UpdateRoleInput){
    const { name, id } = input;

    const isExist = await this.roleRepo.findRoleById(id);

    if(!isExist){
      throw new NotFoundError("Role", "id");
    }

    return this.roleRepo.saveRole({
      ...isExist,
      role_name: name,
    });
  }

  async deleteRole(id: number){
    const isExist = await this.roleRepo.findRoleById(id);
    if(!isExist){
      throw new NotFoundError("Role", "id");
    }

    const roleCount = await this.roleRepo.findRole()
    if(roleCount.length <= 1){
      throw new Error("Cannot delete role. At least one role must exist in the system.");
    }

    return this.roleRepo.deleteRole(id);
  }

  async assignPermissionToRole(input: AssignPermissionInput){
    const { roleId, permissionIds } = input;

    const role = await this.roleRepo.findRoleById(roleId);

    if(!role){
        throw new NotFoundError("Role", "roleId");
    }

    for(const permissionId of permissionIds){

        const permission = await this.permissionRepo.findPermissionById(permissionId);

        if(!permission){
            throw new NotFoundError("Permission", "permissionIds");
        }

        const exists = await this.rolePermissionRepo.findByRoleAndPermission(
            roleId,
            permissionId
        );

        if(!exists){
            const rolePermission = await this.rolePermissionRepo.create({
                role,
                permission
            });

            await this.rolePermissionRepo.save(rolePermission);
        }
    }

    return this.roleRepo.findRoleById(roleId);
  }

  async removePermissionFromRole(input: RemovePermissionInput){
    const { roleId, permissionIds } = input;

    const role = await this.roleRepo.findRoleById(roleId);

    if(!role){
        throw new NotFoundError("Role", "roleId");
    }

    for(const permissionId of permissionIds){

        const rolePermission = await this.rolePermissionRepo.findByRoleAndPermission(
            roleId,
            permissionId
        );

        if(rolePermission){
            await this.rolePermissionRepo.remove(rolePermission);
        }
    }

    return this.roleRepo.findRoleById(roleId);
  }

    async getAllRoles(){
        const roles = await this.roleRepo.findRole();
        return roles
    }
}
