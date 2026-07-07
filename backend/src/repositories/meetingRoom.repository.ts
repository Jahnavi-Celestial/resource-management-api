import { FindOptionsWhere } from "typeorm";
import AppDataSource from "../config/db.ts";
import { MeetingRoom } from "../entities/MeetingRoom.ts";


export class MeetingRoomRepository {
  private repo = AppDataSource.getRepository(MeetingRoom)

  async findById(id: number){
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<MeetingRoom>): MeetingRoom {
    return this.repo.create(data);
  }

  async save(room: MeetingRoom | Partial<MeetingRoom>){
    return this.repo.save(room);
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

  async findAndCountRooms(
    whereConditions: FindOptionsWhere<MeetingRoom>,
    skip: number,
    take: number
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
      order: { id: "DESC" },
      skip,
      take
    });
  }
}
