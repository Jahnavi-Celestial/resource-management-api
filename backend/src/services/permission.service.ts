import { CreatePermissionInput, UpdatePermissionInput } from "../dto/permission.input.ts";
import { ConflictError, NotFoundError } from "../errors/AppErrors.ts";
import { PermissionRepository } from "../repositories/permission.repository.ts";

export class PermissionService{
  constructor(private permissionRepo = new PermissionRepository()) {}

  async createPermission(input: CreatePermissionInput){
    const { name } = input;

    const isExist = await this.permissionRepo.findPermissionByName(
      name.toLowerCase(),
    );

    if(isExist){
      throw new ConflictError("Permission already exists, you can only update it.")
    }

    const newPermission = await this.permissionRepo.createPermission({
      permission_name: name
    })
    return await this.permissionRepo.savePermission(newPermission)
  }

  async updatePermission(input: UpdatePermissionInput){
    const { name, id } = input

    const isExist = await this.permissionRepo.findPermissionById(id);

    if(!isExist){
      throw new NotFoundError("Permission");
    }

    return this.permissionRepo.savePermission({
      ...isExist,
      permission_name: name,
    });
  }

  async deletePermission(id: number){
    const isExist = await this.permissionRepo.findPermissionById(id);
    if(!isExist){
      throw new NotFoundError("Permission");
    }

    return this.permissionRepo.deletePermission(id);
  }
}
