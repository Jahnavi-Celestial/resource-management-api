import { EntityManager, FindOptionsWhere } from "typeorm";
import { MeetingRoom } from "../entities/index.ts";
import { Manager } from "./index.ts";


export class MeetingRoomRepository extends Manager{
  constructor(manager?: EntityManager) {
    super(manager);
  }

  async findById(id: number){
    return this.manager.findOne(MeetingRoom, { where: { id } });
  }

  create(data: Partial<MeetingRoom>): MeetingRoom {
    return this.manager.create(MeetingRoom, data);
  }

  async save(room: MeetingRoom | Partial<MeetingRoom>){
    return this.manager.save(MeetingRoom, room);
  }

  async delete(id: number){
    const result = await this.manager.delete(MeetingRoom, id);
    return !!result.affected;
  }

  async findByIdWithRelations(id: number){
    return this.manager.findOne(MeetingRoom, {
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
    take: number,
    sortOrder: string
  ){
    return this.manager.findAndCount(MeetingRoom, {
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

  async findOneByNameAndLocation(name: string, location: string){
    return this.manager.findOne(MeetingRoom, {
      where: {
        name: name,
        location: location
      }
    })
  };
}
