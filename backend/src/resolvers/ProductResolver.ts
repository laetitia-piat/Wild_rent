import { ProductInput, ProductSearchOptions } from "../inputs/ProductInput";
import { Product } from "../entities/Product";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Picture } from "../entities/Picture";
import { ProductOption } from "../entities/ProductOption";
import { Category } from "../entities/Category";
import { FindManyOptions, In, Raw } from "typeorm";
import { merge } from "../assets/utils";
import { Tag } from "../entities/Tag";
//import { ProductInOrder } from "../entities/ProductInOrder";
import { getInventoryByOptionsService } from "../services/InventoryService";

@Resolver(Product)
export class ProductResolver {
  @Query(() => Product)
  async getProductById(@Arg("id") id: number) {
    const product = await Product.findOne({
      where: { id: id },
    });
    return product;
  }

  @Query(() => [Product])
  async searchProductsByOptions(
    @Arg("options")
    options: ProductSearchOptions
  ) {
    let findOptions: FindManyOptions = {
      where: {
        name: Raw(
          (alias) => `unaccent(${alias}) ILIKE unaccent('%${options.name}%')`
        ),
      },
    };
    if (options.categoryId) {
      findOptions.where = {
        ...findOptions.where,
        category: { id: options.categoryId },
      };
    }
    if (options.productOption) {
      findOptions.where = {
        ...findOptions.where,
        product_options: { size: options.productOption },
      };
    }
    return await Product.find(findOptions);
  }

  @Query(() => [Product])
  async getProductByCategory(@Arg("category") categoryId: number) {
    const products = await Product.find({
      order: {
        id: "ASC",
      },
      where: {
        category: {
          id: categoryId,
        },
      },
    });
    return products;
  }

  @Query(() => [Product])
  async getProductWithFilters(
    @Arg("categoryId") categoryId: number,
    @Arg("minPrice") minPrice: number,
    @Arg("maxPrice") maxPrice: number,
    @Arg("keyword") keyword: string,
    @Arg("tags", () => [String]) tags: string[]
  ) {
    const queryBuilder = Product.createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.tags", "tag")
      .leftJoinAndSelect("product.pictures", "pictures")
      .where("product.categoryId = :categoryId", { categoryId: categoryId })
      .andWhere("product.price <= :maxPrice", { maxPrice: maxPrice })
      .andWhere("product.price >= :minPrice", { minPrice: minPrice });

    if (keyword.length > 0) {
      queryBuilder.andWhere("product.name ILIKE :keyword", {
        keyword: `%${keyword}%`,
      });
    }

    if (tags && tags.length > 0) {
      queryBuilder.andWhere("tag.label IN (:...tags)", { tags });
    }

    const products = await queryBuilder.distinct(true).getMany();

    return products;
  }

  @Query(() => [ProductOption])
  async getAvailableProductOptions(
    @Arg("startDate") startDate: Date,
    @Arg("endDate") endDate: Date,
    @Arg("categoryId", { nullable: true }) categoryId?: number,
    @Arg("keyword", { nullable: true }) keyword?: string,
    @Arg("minPrice", { nullable: true }) minPrice?: number,
    @Arg("maxPrice", { nullable: true }) maxPrice?: number,
    @Arg("tags", () => [String], { nullable: true }) tags?: string[],
    @Arg("productId", { nullable: true }) productId?: number
  ) {
    const queryBuilder = ProductOption.createQueryBuilder("po")
      .leftJoinAndSelect("po.product", "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.tags", "tag")
      .leftJoinAndSelect("product.pictures", "pictures");
    // Filtre par catégorie
    if (categoryId) {
      queryBuilder.andWhere("category.id = :categoryId", { categoryId });
    }
    // Filtre par mot-clé
    if (keyword) {
      queryBuilder.andWhere("product.name ILIKE :keyword", {
        keyword: `%${keyword}%`,
      });
    }
    // Filtre par prix
    if (maxPrice) {
      queryBuilder.andWhere("product.price <= :maxPrice", {
        maxPrice: maxPrice,
      });
    }
    if (minPrice) {
      queryBuilder.andWhere("product.price >= :minPrice", {
        minPrice: minPrice,
      });
    }
    // Filtre par tags
    if (tags && tags.length > 0) {
      queryBuilder.andWhere("tag.label IN (:...tags)", { tags });
    }
    // Filtre par product ID
    if (productId) {
      queryBuilder.andWhere("product.id = :productId", {
        productId: productId,
      });
    }

    const productOptions = await queryBuilder.getMany();

    const inventoryForDates = await getInventoryByOptionsService(
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );

    const unavailableProducts = inventoryForDates.filter((item) => {
      if (!item.reservations || item.reservations.length === 0) {
        return false;
      }
      const maxReserved = Math.max(
        ...item.reservations.map((r) => r.reservedQty)
      );
      return maxReserved >= item.totalQty;
    });

    const availableProductOptions = productOptions.filter((option) => {
      return !unavailableProducts.find((item) => item.id === option.id);
    });

    return availableProductOptions;
  }

  @Query(() => [Product])
  async getAvailableProductForDates(
    @Arg("startDate") startDate: Date,
    @Arg("endDate") endDate: Date,
    @Arg("categoryId", { nullable: true }) categoryId?: number,
    @Arg("keyword", { nullable: true }) keyword?: string,
    @Arg("minPrice", { nullable: true }) minPrice?: number,
    @Arg("maxPrice", { nullable: true }) maxPrice?: number,
    @Arg("tags", () => [String], { nullable: true }) tags?: string[]
  ) {
    const availableProductOptions = await this.getAvailableProductOptions(
      startDate,
      endDate,
      categoryId,
      keyword,
      minPrice,
      maxPrice,
      tags
    );

    // Extrait les Products disponibles à partir des products Options dispo
    let availableProducts: Product[] = [];

    availableProductOptions.forEach((option) => {
      const product = option.product;
      if (!availableProducts.some((item) => item.id === product.id)) {
        availableProducts.push(product);
      }
    });

    return availableProducts;
  }

  @Mutation(() => Product)
  async createProduct(@Arg("data") data: ProductInput) {
    const pictures = data.pictures?.map((pic) => {
      return Picture.create({ url: pic.url });
    });

    const productOptions = data.product_options?.map((opt) =>
      ProductOption.create({
        size: opt.size,
        total_quantity: opt.total_quantity,
      })
    );

    const category = await Category.findOneByOrFail({ id: data.category?.id });

    const tags = data.tag_ids
      ? await Promise.all(
          data.tag_ids.map((id) => Tag.findOneByOrFail({ id: id }))
        )
      : [];

    const newProduct = await Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      pictures: pictures,
      product_options: productOptions,
      category: category,
      tags: tags,
    });

    return await newProduct.save();
  }

  @Mutation(() => Product)
  async modifyProductById(@Arg("data") data: ProductInput) {
    let productToUpdate = await Product.findOneOrFail({
      where: { id: data.id },
      relations: ["category", "pictures", "product_options", "tags"],
    });

    console.log("found product", productToUpdate);

    productToUpdate = merge(productToUpdate, data);

    if (data.tag_ids) {
      const newTags = await Tag.findBy({ id: In(data.tag_ids) });
      productToUpdate.tags = newTags;
    }

    console.log("change product", merge(productToUpdate, data));

    await productToUpdate.save();

    const finalProduct = await Product.findOneOrFail({
      where: { id: data.id },
      relations: ["category", "pictures", "product_options", "tags"],
    });
    console.log("finalProduct", finalProduct);
    return finalProduct;
  }

  @Mutation(() => String)
  async deleteProductById(@Arg("id") id: number) {
    let productToDelete = await Product.findOneOrFail({ where: { id: id } });

    await productToDelete.remove();

    return "Product has been deleted";
  }
}
