import { FindOptionsWhere, ILike } from "typeorm";
import { CreateMeetingRoomInput, RoomsFilterInput, UpdateMeetingRoomInput } from "../dto/index.ts";
import { MeetingRoom } from "../entities/index.ts";
import { MeetingRoomRepository } from "../repositories/index.ts";
import { ConflictError, NotFoundError } from "../errors/AppErrors.ts";

export class MeetingRoomService {
  constructor(private meetingRoomRepo = new MeetingRoomRepository()) {}

  async createRoom(input: CreateMeetingRoomInput){
    const existingRoom = await this.meetingRoomRepo.findOneByNameAndLocation(input.name.toLowerCase(), input.location.toLowerCase());

    if (existingRoom) {
        throw new ConflictError("This room already exists. You cannot create a room with the same name at the same location.");
    }

    const newRoom = this.meetingRoomRepo.create({
      ...input,
      name: input.name.toLowerCase(),
      location: input.location.toLowerCase()
    });
    return this.meetingRoomRepo.save(newRoom);
  }

  async updateRoom(input: UpdateMeetingRoomInput){
    const searchRoom = await this.meetingRoomRepo.findById(input.id);
    if (!searchRoom) {
      throw new NotFoundError("Meeting Room", "id");
    }

    if(searchRoom.name.toLowerCase() != input.name.toLowerCase() || searchRoom.location.toLowerCase() != input.location.toLowerCase()){
        const existingRoom = await this.meetingRoomRepo.findOneByNameAndLocation(input.name.toLowerCase(), input.location.toLowerCase());

        if(existingRoom){
            throw new ConflictError("This room already exists. You cannot create a room with the same name at the same location.");
        }
    }

    return this.meetingRoomRepo.save({
      ...searchRoom,
      ...input,
      name: input.name.toLowerCase(),
      location: input.location.toLowerCase()
    });
  }

  async deleteRoom(id: number){
    const searchRoom = await this.meetingRoomRepo.findById(id);
    if (!searchRoom) {
      throw new NotFoundError("Meeting Room", "id");
    }

    return this.meetingRoomRepo.delete(id);
  }

  async getRooms(input: RoomsFilterInput){
    const { page, limit, searchTerm, sortOrder } = input;
    const skip = (page - 1) * limit;

    const whereConditions: FindOptionsWhere<MeetingRoom> = {};
    if (searchTerm) {
      whereConditions.name = ILike(`%${searchTerm}%`);
    }

    const [rooms, totalCount] = await this.meetingRoomRepo.findAndCountRooms(
      whereConditions,
      skip,
      limit,
      String(sortOrder)
    );

    return {
      data: rooms,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1
    };
  }

  async getRoomById(id: number){
    const room = await this.meetingRoomRepo.findByIdWithRelations(id);
    if (!room) {
      throw new NotFoundError("Meeting Room", "id");
    }
    return room;
  }
}
