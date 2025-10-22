import { Product } from "../entities/Product";
import { ProductOption } from "../entities/ProductOption";
import { Resolver, Query, Arg } from "type-graphql";

@Resolver(ProductOption)
export class ProductOptionResolver {
  @Query(() => [ProductOption])
  async getProductOptions(@Arg("productId") productId: number) {
    const product = await Product.findOne({
      where: { id: productId },
    });
    return product?.product_options;
  }
}
