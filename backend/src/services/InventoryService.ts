import { OptionInventory } from "../entities/Inventory";
import { ProductInOrder } from "../entities/ProductInOrder";
import { ProductOption } from "../entities/ProductOption";

export const getInventoryByOptionsService = async (
    startDate: string,
    endDate: string,
    productId?: number
)=>{
    const getAllDates = (startDate: string, endDate: string) => {
      const allDates = [];
      let currentDate = new Date(startDate);
      const lastDate = new Date(endDate);
      while (currentDate <= lastDate) {
        allDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return allDates;
    };

    const allDates = getAllDates(startDate, endDate);

    let productOptions;
    let reservations;

    if (productId) {
      productOptions = await ProductOption.find({
        where: { id: productId },
        relations: ["product"],
      });
      reservations = await ProductInOrder.find({
        where: { productOption: { id: productId } },
        relations: ["productOption.product"],
      });
    } else {
      productOptions = await ProductOption.find({ relations: ["product"] });
      reservations = await ProductInOrder.find({
        relations: ["productOption.product"],
      });
    }

    let inventory = [];

    for (const option of productOptions) {
      const optionInventory: OptionInventory = {
        id: option.id,
        product: option.product.name,
        category: option.product.category,
        option: option.size,
        totalQty: option.total_quantity,
        reservations: [],
      };
      for (const date of allDates) {
        const reservedItems = reservations.filter((item) => {
          return (
            item.productOption.id === option.id &&
            new Date(item.order.rental_start_date) <= date &&
            new Date(item.order.rental_end_date) >= date
          );
        });

        if (reservedItems.length > 0) {
          const reservedQty = reservedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const availableQty = option.total_quantity - reservedQty;
          optionInventory.reservations.push({
            date,
            reservedQty,
            availableQty,
          });
        }
      }
      inventory.push(optionInventory);
    }

    return inventory;
}