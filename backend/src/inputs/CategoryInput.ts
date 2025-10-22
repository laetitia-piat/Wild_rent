import { Field, InputType } from "type-graphql";

@InputType()
export class CategoryInput {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  image?: string;
}
