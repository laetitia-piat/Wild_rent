import { Field, InputType, Int } from "type-graphql";

@InputType()
export class ProductInOrderInput {
  @Field(() => Int)
  productOptionId: number;

  @Field(() => Int)
  quantity: number;
}
