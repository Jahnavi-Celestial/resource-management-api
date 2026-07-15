import { FindOptionsWhere } from "typeorm";
import AppDataSource from "../config/db.ts";
import { Equipment } from "../entities/Equipment.ts";


export class EquipmentRepository {
  private repo = AppDataSource.getRepository(Equipment);

  async findById(id: number){
    return this.repo.findOne({ where: { id } });
  }
  
  async findByName(name: string){
    return this.repo.findOne({ where: { name } });
  }

  create(data: Partial<Equipment>): Equipment {
    return this.repo.create(data);
  }

  async save(equipment: Equipment | Partial<Equipment>){
    return this.repo.save(equipment);
  }

  async delete(id: number){
    const result = await this.repo.delete(id);
    return !!result.affected;
  }

  async findByIdWithRelations(id: number){
    return this.repo.findOne({
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
    return this.repo.findAndCount({
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
