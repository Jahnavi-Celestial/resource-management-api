import { EquipmentRepository } from "../repositories/index.ts";
import { CreateEquipmentInput, EquipmentsFilterInput, UpdateEquipmentInput } from "../dto/index.ts";
import { Equipment } from "../entities/index.ts";
import { FindOptionsWhere, ILike } from "typeorm";
import { ConflictError, NotFoundError } from "../errors/AppErrors.ts";
import AppDataSource from "../config/db.ts";

export class EquipmentService {
  constructor(private equipmentRepo = new EquipmentRepository()) {}

  async createEquipment(input: CreateEquipmentInput){
    const {name} = input

    const isExist = await this.equipmentRepo.findByName(name.toLowerCase())

    if(isExist){
        throw new ConflictError("Equipment already exists, you can only update it.", "name");
    }

    const newEquip = this.equipmentRepo.create({
      ...input,
      name: input.name.toLowerCase()
    });
    return this.equipmentRepo.save(newEquip);
  }

  async updateEquipment(input: UpdateEquipmentInput){
    const searchEquip = await this.equipmentRepo.findById(input.id);
    if (!searchEquip) {
      throw new NotFoundError("Equipment", "id");
    }

    return this.equipmentRepo.save({
      ...searchEquip,
      ...input,
      name: input.name.toLowerCase()
    });
  }

  async deleteEquipment(id: number){
    const searchEquip = await this.equipmentRepo.findById(id);
    if (!searchEquip) {
      throw new NotFoundError("Equipment", "id");
    }

    await AppDataSource.query(`
      DELETE FROM booking_equipments
      WHERE "equipmentId" = $1
    `, [id]);

    return this.equipmentRepo.delete(id);
  }

  async getEquipments(input: EquipmentsFilterInput){
    const { page, limit, searchTerm, sortOrder } = input;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Equipment> = {};
    if (searchTerm) {
      whereConditions.name = ILike(`%${searchTerm}%`);
    }

    const [equipments, totalCount] = await this.equipmentRepo.findAndCountEquipments(
      whereConditions,
      skip,
      limit,
      String(sortOrder)
    );

    return {
      data: equipments,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1
    };
  }

  async getEquipmentById(id: number){
    const equipment = await this.equipmentRepo.findByIdWithRelations(id);
    if (!equipment) {
      throw new NotFoundError("Equipment", "id");
    }
    return equipment;
  }
}
