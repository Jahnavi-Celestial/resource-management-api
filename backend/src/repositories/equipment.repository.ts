import { EntityManager, FindOptionsWhere } from "typeorm";
import { Equipment } from "../entities/index.ts";
import { Manager } from "./index.ts";

export class EquipmentRepository extends Manager{
  constructor(manager?: EntityManager) {
    super(manager);
  }

  async findById(id: number){
    return this.manager.findOne(Equipment, { where: { id } });
  }
  
  async findByName(name: string){
    return this.manager.findOne(Equipment, { where: { name } });
  }

  create(data: Partial<Equipment>): Equipment {
    return this.manager.create(Equipment, data);
  }

  async save(equipment: Equipment | Partial<Equipment>){
    return this.manager.save(Equipment, equipment);
  }

  async delete(id: number){
    const result = await this.manager.delete(Equipment, id);
    return !!result.affected;
  }

  async findByIdWithRelations(id: number){
    return this.manager.findOne(Equipment, {
      where: { id },
      relations: {
        bookings: {
          employee: true,
          equipments: true,
          meetingRoom: true
        }
      }
    });
  }

  async findAndCountEquipments(
    whereConditions: FindOptionsWhere<Equipment>,
    skip: number,
    take: number,
    sortOrder: string
  ){
    return this.manager.findAndCount(Equipment, {
      where: whereConditions,
      relations: {
        bookings: {
          employee: true,
          equipments: true,
          meetingRoom: true
        }
      },
      order: { id: sortOrder as any },
      skip,
      take
    });
  }
}
