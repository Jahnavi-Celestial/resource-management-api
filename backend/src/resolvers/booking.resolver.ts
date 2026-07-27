import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { BookingService } from "../services/index.ts";
import { Booking, Equipment, MeetingRoom, Employee } from "../entities/index.ts";
import { ApproveBookingInput, BookingsFilterInput, CreateBookingInput, RejectBookingInput, PaginatedBookings } from "../dto/index.ts";
import { type AppContext } from "../index.ts";
import { PermissionMiddleware } from "../middleware/permission.middleware.ts";

@Resolver(()=>Booking)
export class BookingResolver {
  constructor(private bookingService = new BookingService()) {}

  @FieldResolver(() => Employee)
  async employee(
    @Root() booking: Booking, 
    @Ctx() context: AppContext
  ){
    return context.loaders.employeeLoader.load(booking.employeeId)
  }

  @FieldResolver(() => MeetingRoom)
  async meetingRoom(
    @Root() booking: Booking, 
    @Ctx() context: AppContext
  ){
    return context.loaders.meetingRoomLoader.load(booking.meetingRoomId)
  }

  @FieldResolver(() => [Equipment])
  async equipments(
    @Root() booking: Booking, 
    @Ctx() context: AppContext
  ){
    return context.loaders.equipmentLoader.load(booking.id)
  }

  @Mutation(() => Booking)
  @UseMiddleware(PermissionMiddleware("CREATE_BOOKING"))
  async createBooking(
    @Arg("input", ()=>CreateBookingInput) input: CreateBookingInput,
    @Ctx() context: AppContext
  ): Promise<Booking> {
    return this.bookingService.createBooking(input, context.user!, context.io);
  }

  @Mutation(() => Booking)
  @UseMiddleware(PermissionMiddleware("CANCEL_BOOKING"))
  async cancelBooking(
    @Arg("bookingId", () => Int) bookingId: number,
    @Ctx() context: AppContext
  ){
    return this.bookingService.cancelBooking(bookingId, context.user!, context.io);
  }

  @Mutation(() => Booking)
  @UseMiddleware(PermissionMiddleware("APPROVE_BOOKING"))
  async approveBooking(
    @Arg("input", ()=>ApproveBookingInput) input: ApproveBookingInput,
    @Ctx() context: AppContext
  ){
    return await this.bookingService.approveBooking(input, context.user!.id, context.io);
  }

  @Mutation(() => Booking)
  @UseMiddleware(PermissionMiddleware("REJECT_BOOKING"))
  async rejectBooking(
    @Arg("input", ()=>RejectBookingInput) input: RejectBookingInput,
    @Ctx() context: AppContext
  ){
    return await this.bookingService.rejectBooking(input, context.user!.id, context.io);
  }

  @Query(() => PaginatedBookings)
  @UseMiddleware(PermissionMiddleware("VIEW_ALL_BOOKINGS"))
  async bookings(
    @Arg("input", ()=>BookingsFilterInput) input: BookingsFilterInput
  ){
    return await this.bookingService.getBookings(input);
  }

  @Query(() => Booking)
  @UseMiddleware(PermissionMiddleware("VIEW_BOOKING"))
  async booking(
    @Arg("id", () => Int) id: number
  ){
    return await this.bookingService.getBookingById(id);
  }

  @Query(() => PaginatedBookings)
  @UseMiddleware(PermissionMiddleware("VIEW_OWN_BOOKINGS"))
  async viewOwnBooking(
    @Arg("input", ()=>BookingsFilterInput) input: BookingsFilterInput,
    @Ctx() context: AppContext
  ){
    return await this.bookingService.getOwnBookings(input, context.user!.id);
  }
}
