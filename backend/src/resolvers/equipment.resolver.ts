import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Equipment } from "../entities/Equipment.ts";
import { EquipmentService } from "../services/equipment.service.ts";
import { CreateEquipmentInput, EquipmentsFilterInput, PaginatedEquipments, UpdateEquipmentInput } from "../dto/equipment.input.ts";
import { PermissionMiddleware } from "../middleware/permission.middleware.ts";
import { Booking } from "../entities/Booking.ts";
import { type AppContext } from "../index.ts";

@Resolver(() => Equipment)
export class EquipmentResolver {
  constructor(private equipmentService = new EquipmentService()) {}

  @FieldResolver(() => [Booking])
  async bookings(
    @Root() equipment: Equipment, 
    @Ctx() context: AppContext
  ){
    return context.loaders.bookingsByEquipmentLoader.load(equipment.id)
  }

  @Mutation(() => Equipment)
  @UseMiddleware(PermissionMiddleware("CREATE_EQUIPMENT"))
  async createEquipment(
    @Arg("input", ()=>CreateEquipmentInput) input: CreateEquipmentInput
  ){
    return this.equipmentService.createEquipment(input);
  }

  @UseMiddleware(PermissionMiddleware("UPDATE_EQUIPMENT"))
  @Mutation(() => Equipment)
  async updateEquipment(
    @Arg("input", ()=>UpdateEquipmentInput) input: UpdateEquipmentInput
  ){
    return this.equipmentService.updateEquipment(input);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(PermissionMiddleware("DELETE_EQUIPMENT"))
  async deleteEquipment(
    @Arg("id", () => Int) id: number
  ){
    return this.equipmentService.deleteEquipment(id);
  }

  @Query(() => PaginatedEquipments)
  @UseMiddleware(PermissionMiddleware("VIEW_ALL_EQUIPMENT"))
  async equipments(
    @Arg("input", ()=>EquipmentsFilterInput) input: EquipmentsFilterInput
  ){
    return this.equipmentService.getEquipments(input);
  }

  @UseMiddleware(PermissionMiddleware("VIEW_EQUIPMENT"))
  @Query(() => Equipment)
  async equipment(
    @Arg("id", () => Int) id: number
  ){
    return this.equipmentService.getEquipmentById(id);
  }
}
