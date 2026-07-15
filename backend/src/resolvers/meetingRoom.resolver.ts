import { Arg, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { MeetingRoomService } from "../services/meetingRoom.service.ts";
import { MeetingRoom } from "../entities/MeetingRoom.ts";
import { CreateMeetingRoomInput, RoomsFilterInput, UpdateMeetingRoomInput, PaginatedRooms } from "../dto/meetingRoom.input.ts";
import { PermissionMiddleware } from "../middleware/permission.middleware.ts";

@Resolver()
export class MeetingRoomResolver {
  constructor(private meetingRoomService = new MeetingRoomService()) {}

  @Mutation(() => MeetingRoom)
  @UseMiddleware(PermissionMiddleware("CREATE_ROOM"))
  async createRoom(
    @Arg("input", ()=>CreateMeetingRoomInput) input: CreateMeetingRoomInput
  ){
    return this.meetingRoomService.createRoom(input);
  }

  @Mutation(() => MeetingRoom)
  @UseMiddleware(PermissionMiddleware("UPDATE_ROOM"))
  async updateRoom(
    @Arg("input", ()=>UpdateMeetingRoomInput) input: UpdateMeetingRoomInput
  ){
    return this.meetingRoomService.updateRoom(input);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PermissionMiddleware("DELETE_ROOM"))
  async deleteRoom(
    @Arg("id", () => Int) id: number
  ){
    return this.meetingRoomService.deleteRoom(id);
  }

  @Query(() => PaginatedRooms)
  @UseMiddleware(PermissionMiddleware("VIEW_ALL_ROOM"))
  async rooms(
    @Arg("input", ()=>RoomsFilterInput) input: RoomsFilterInput
  ){
    return this.meetingRoomService.getRooms(input);
  }

  @Query(() => MeetingRoom)
  @UseMiddleware(PermissionMiddleware("VIEW_ROOM"))
  async room(
    @Arg("id", () => Int) id: number
  ){
    return this.meetingRoomService.getRoomById(id);
  }
}
