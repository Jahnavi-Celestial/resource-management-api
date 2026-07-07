import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { MeetingRoomService } from "../services/meetingRoom.service.ts";
import { MeetingRoom } from "../entities/MeetingRoom.ts";
import { CreateMeetingRoomInput, RoomsFilterInput, UpdateMeetingRoomInput, PaginatedRooms } from "../dto/meetingRoom.input.ts";

@Resolver()
export class MeetingRoomResolver {
  constructor(private meetingRoomService = new MeetingRoomService()) {}

  @Authorized("ADMIN")
  @Mutation(() => MeetingRoom)
  async createRoom(
    @Arg("input", ()=>CreateMeetingRoomInput) input: CreateMeetingRoomInput
  ){
    return this.meetingRoomService.createRoom(input);
  }

  @Authorized("ADMIN")
  @Mutation(() => MeetingRoom)
  async updateRoom(
    @Arg("input", ()=>UpdateMeetingRoomInput) input: UpdateMeetingRoomInput
  ){
    return this.meetingRoomService.updateRoom(input);
  }

  @Authorized("ADMIN")
  @Mutation(() => Boolean)
  async deleteRoom(
    @Arg("id", () => Int) id: number
  ){
    return this.meetingRoomService.deleteRoom(id);
  }

  @Authorized()
  @Query(() => PaginatedRooms)
  async rooms(
    @Arg("input", ()=>RoomsFilterInput) input: RoomsFilterInput
  ){
    return this.meetingRoomService.getRooms(input);
  }

  @Authorized()
  @Query(() => MeetingRoom)
  async room(
    @Arg("id", () => Int) id: number
  ){
    return this.meetingRoomService.getRoomById(id);
  }
}
