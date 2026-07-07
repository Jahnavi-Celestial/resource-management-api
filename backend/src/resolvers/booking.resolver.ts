import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { BookingService } from "../services/booking.service.ts";
import { Booking } from "../entities/Booking.ts";
import { ApproveBookingInput, BookingsFilterInput, CreateBookingInput, RejectBookingInput, PaginatedBookings } from "../dto/booking.input.ts";
import { type AppContext } from "../index.ts";

@Resolver()
export class BookingResolver {
  constructor(private bookingService = new BookingService()) {}

  @Authorized("EMPLOYEE")
  @Mutation(() => Booking)
  async createBooking(
    @Arg("input", ()=>CreateBookingInput) input: CreateBookingInput,
    @Ctx() context: AppContext
  ): Promise<Booking> {
    return this.bookingService.createBooking(input, context.user);
  }

  @Authorized("EMPLOYEE")
  @Mutation(() => Booking)
  async cancelBooking(
    @Arg("bookingId", () => Int) bookingId: number,
    @Ctx() context: AppContext
  ){
    return this.bookingService.cancelBooking(bookingId, context.user);
  }

  @Authorized("MANAGER")
  @Mutation(() => Booking)
  async approveBooking(
    @Arg("input", ()=>ApproveBookingInput) input: ApproveBookingInput,
    @Ctx() context: AppContext
  ){
    return await this.bookingService.approveBooking(input, context.user.id);
  }

  @Authorized("MANAGER")
  @Mutation(() => Booking)
  async rejectBooking(
    @Arg("input", ()=>RejectBookingInput) input: RejectBookingInput,
    @Ctx() context: AppContext
  ){
    return await this.bookingService.rejectBooking(input, context.user.id);
  }

  @Authorized(["ADMIN", "MANAGER"])
  @Query(() => PaginatedBookings)
  async bookings(
    @Arg("input", ()=>BookingsFilterInput) input: BookingsFilterInput
  ){
    return await this.bookingService.getBookings(input);
  }

  @Authorized()
  @Query(() => Booking)
  async booking(
    @Arg("id", () => Int) id: number
  ){
    return await this.bookingService.getBookingById(id);
  }

  @Authorized("EMPLOYEE")
  @Query(() => PaginatedBookings)
  async viewOwnBooking(
    @Arg("input", ()=>BookingsFilterInput) input: BookingsFilterInput,
    @Ctx() context: AppContext
  ){
    return await this.bookingService.getOwnBookings(input, context.user.id);
  }
}
