import { Resolver, Query, Arg, Ctx } from "type-graphql";
import { OptionAvailability, OptionInventory } from "../entities/Inventory";
import { GraphQLError } from "graphql";
import { getInventoryByOptionsService } from "../services/InventoryService";

@Resolver()
export class InventoryResolver {
  @Query(() => [OptionInventory])
  async getInventoryByOptions(
    @Arg("startDate") startDate: string,
    @Arg("endDate") endDate: string,
    @Arg("productId", { nullable: true }) productId?: number, 
    @Ctx() context?: any,
  ) {

    if(!productId){
        if(context.user.role !== "ADMIN"){
             throw new GraphQLError("Only admins can query all inventory", {
            extensions: { code: "FORBIDDEN" },
            });
        }
    }

    return getInventoryByOptionsService(startDate, endDate, productId)
  }

  @Query(() => OptionAvailability)
  async checkProductAvailability(
    @Arg("startDate") startDate: string,
    @Arg("endDate") endDate: string,
    @Arg("product_id") productId: number,
    @Arg("quantity") quantity: number
  ) {
    const productInventory = await this.getInventoryByOptions(
      startDate,
      endDate,
      productId
    );
    const reservations = productInventory[0].reservations;

    const minAvailableQty =
      reservations.length > 0
        ? Math.min(...reservations.map((r) => r.availableQty))
        : productInventory[0].totalQty;

    if (minAvailableQty >= quantity) {
      return {
        productOptionId: productId,
        available: true,
        availableQty: minAvailableQty,
      };
    }
    return {
      productOptionId: productId,
      available: false,
      availableQty: minAvailableQty,
    };
  }

  
}
