import { Field, InputType } from "type-graphql";
import { ProductInOrderInput } from "./ProductInOrderInput";

@InputType()
export class OrderInput {
  @Field()
  created_at?: Date;

  @Field()
  total_price?: number;

  @Field()
  rental_start_date?: Date;

  @Field()
  rental_end_date?: Date;

  @Field()
  userId: number;

  @Field(() => [ProductInOrderInput])
  products: ProductInOrderInput[];
}

@InputType()
export class ChangeOrderStatusInput {
  @Field()
  id: number;

  @Field()
  status: string;
}
