import { Field, InputType } from "type-graphql";

@InputType()
export class ProductOptionInput {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  total_quantity?: number;
}
