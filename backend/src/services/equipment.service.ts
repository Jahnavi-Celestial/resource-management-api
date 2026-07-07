import { EquipmentRepository } from "../repositories/equipment.respository.ts";
import { CreateEquipmentInput, EquipmentsFilterInput, UpdateEquipmentInput } from "../dto/equipment.input.ts";
import { Equipment } from "../entities/Equipment.ts";
import { FindOptionsWhere, ILike } from "typeorm";
import { NotFoundError } from "../errors/AppErrors.ts";

export class EquipmentService {
  constructor(private equipmentRepo = new EquipmentRepository()) {}

  async createEquipment(input: CreateEquipmentInput){
    const newEquip = this.equipmentRepo.create(input);
    return this.equipmentRepo.save(newEquip);
  }

  async updateEquipment(input: UpdateEquipmentInput){
    const searchEquip = await this.equipmentRepo.findById(input.id);
    if (!searchEquip) {
      throw new NotFoundError("Equipment");
    }

    return this.equipmentRepo.save({
      ...searchEquip,
      ...input,
    });
  }

  async deleteEquipment(id: number){
    const searchEquip = await this.equipmentRepo.findById(id);
    if (!searchEquip) {
      throw new NotFoundError("Equipment");
    }

    return this.equipmentRepo.delete(id);
  }

  async getEquipments(input: EquipmentsFilterInput){
    const { page, limit, searchTerm } = input;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<Equipment> = {};
    if (searchTerm) {
      whereConditions.name = ILike(`%${searchTerm}%`);
    }

    const [equipments, totalCount] = await this.equipmentRepo.findAndCountEquipments(
      whereConditions,
      skip,
      limit
    );

    return {
      equipments,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1
    };
  }

  async getEquipmentById(id: number){
    const equipment = await this.equipmentRepo.findByIdWithRelations(id);
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }
    return equipment;
  }
}
