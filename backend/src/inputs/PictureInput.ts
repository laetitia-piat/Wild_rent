import { Field, InputType } from "type-graphql";

@InputType()
export class PictureInput {
  @Field({ nullable: true })
  id?: number;

  @Field()
  url: string;
}
