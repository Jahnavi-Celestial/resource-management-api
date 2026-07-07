import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import { Equipment } from "../entities/Equipment.ts";
import { EquipmentService } from "../services/equipment.service.ts";
import { CreateEquipmentInput, EquipmentsFilterInput, PaginatedEquipments, UpdateEquipmentInput } from "../dto/equipment.input.ts";

@Resolver()
export class EquipmentResolver {
  constructor(private equipmentService = new EquipmentService()) {}

  @Authorized("ADMIN")
  @Mutation(() => Equipment)
  async createEquipment(
    @Arg("input", ()=>CreateEquipmentInput) input: CreateEquipmentInput
  ){
    return this.equipmentService.createEquipment(input);
  }

  @Authorized("ADMIN")
  @Mutation(() => Equipment)
  async updateEquipment(
    @Arg("input", ()=>UpdateEquipmentInput) input: UpdateEquipmentInput
  ){
    return this.equipmentService.updateEquipment(input);
  }

  @Authorized("ADMIN")
  @Mutation(() => Boolean)
  async deleteEquipment(
    @Arg("id", () => Int) id: number
  ){
    return this.equipmentService.deleteEquipment(id);
  }

  @Authorized()
  @Query(() => PaginatedEquipments)
  async equipments(
    @Arg("input", ()=>EquipmentsFilterInput) input: EquipmentsFilterInput
  ){
    return this.equipmentService.getEquipments(input);
  }

  @Authorized()
  @Query(() => Equipment)
  async equipment(
    @Arg("id", () => Int) id: number
  ){
    return this.equipmentService.getEquipmentById(id);
  }
}
