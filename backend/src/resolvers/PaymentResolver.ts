import { Arg, Field, InputType, Int, Mutation, Resolver } from "type-graphql";

import { GraphQLJSON } from "graphql-scalars";
import paymentServices from "../services/paymentServices";

@InputType()
export class ProductForSessionInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  name: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  quantity: number;
}

@Resolver()
export default class PaymentResolver {
  /**----------------------
   *? le type ici est volontairement large puisque la session de Stripe
   *?  retourne énormément d'informations, impossible de tout couvrir
   *? facilement avec un type custom à nous
   *------------------------**/
  @Mutation(() => GraphQLJSON)
  async createCheckoutSession(
    @Arg("data", () => [ProductForSessionInput]) data: ProductForSessionInput[]
  ) {
    return await paymentServices.createCheckoutSession(data);
  }
}
