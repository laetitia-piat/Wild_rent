import { Order } from "../entities/Order";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { ChangeOrderStatusInput, OrderInput } from "../inputs/OrderInput";
import { User } from "../entities/User";
import { ProductOption } from "../entities/ProductOption";
import { ProductInOrder } from "../entities/ProductInOrder";

@Resolver(Order)
export class OrderResolver {
  @Query(() => [Order])
  async getAllOrders() {
    return await Order.find({
      relations: [
        "products_in_order",
        "products_in_order.productOption",
        "products_in_order.productOption.product",
        "user",
      ],
    });
  }

  @Query(() => Order)
  async getOrderById(@Arg("id") id: number) {
    const order = await Order.findOne({
      where: { id: id },
      relations: [
        "products_in_order",
        "products_in_order.productOption",
        "products_in_order.productOption.product",
        "user",
      ],
    });
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  @Query(() => [Order])
  async getOrdersByUserId(@Arg("id") id: number) {
    const user = await User.findOneByOrFail({ id });
    return await Order.find({
      where: { user },
      relations: [
        "products_in_order",
        "products_in_order.productOption",
        "products_in_order.productOption.product",
        "user",
      ],
    });
  }

  @Mutation(() => Order)
  async createNewOrder(@Arg("data") data: OrderInput) {
    const user = await User.findOne({ where: { id: data.userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const newOrder = Order.create({
      created_at: data.created_at,
      rental_start_date: data.rental_start_date,
      rental_end_date: data.rental_end_date,
      total_price: data.total_price,
      status: "PENDING",
      user,
    });
    await newOrder.save();

    for (const productData of data.products) {
      const productOption = await ProductOption.findOne({
        where: { id: productData.productOptionId },
      });

      if (!productOption) {
        throw new Error(
          `ProductOption with id ${productData.productOptionId} not found`
        );
      }

      const productInOrder = ProductInOrder.create({
        order: newOrder,
        productOption,
        quantity: productData.quantity,
      });

      await productInOrder.save();
    }

    return await Order.findOne({
      where: { id: newOrder.id },
      relations: [
        "products_in_order",
        "products_in_order.productOption",
        "products_in_order.productOption.product",
        "user",
      ],
    });
  }

  @Mutation(() => String)
  async deleteOrderById(@Arg("id") id: number) {
    const orderToDelete = await Order.findOneBy({ id });

    await orderToDelete?.remove();

    return "Order has been deleted";
  }

  @Mutation(() => String)
  async changeStatusOrderById(@Arg("data") data: ChangeOrderStatusInput) {
    const orderToChange = await Order.findOneByOrFail({ id: data.id });

    orderToChange.status = data.status;

    await orderToChange.save();

    return "Status changed";
  }
}
