import { Field, InputType } from "type-graphql";
import { CategoryInput } from "./CategoryInput";
import { PictureInput } from "./PictureInput";
import { ProductOptionInput } from "./ProductOptionInput";

@InputType()
export class ProductInput {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field(() => [PictureInput], { nullable: true })
  pictures?: PictureInput[];

  @Field(() => [ProductOptionInput], { nullable: true })
  product_options?: ProductOptionInput[];

  @Field(() => CategoryInput, { nullable: true })
  category?: CategoryInput;

  @Field(() => [Number], { nullable: true })
  tag_ids?: number[];
}

@InputType()
export class ProductSearchOptions {
  @Field()
  name: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  productOption?: string;
}
