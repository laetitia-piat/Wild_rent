import { Field, InputType } from "type-graphql";

@InputType()
export class CreateOrUpdateAddressInput {
  @Field({ nullable: true })
  userId: number;

  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  zipcode: string;

  @Field()
  country: string;
}
