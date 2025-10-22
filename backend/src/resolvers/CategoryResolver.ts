import { Category } from "../entities/Category";
import { CategoryInput } from "../inputs/CategoryInput";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  async getAllCategories() {
    return await Category.find();
  }

  @Mutation(() => Category)
  async createNewCategory(@Arg("data") data: CategoryInput) {
    const newCategory = await Category.save({
      title: data.title,
      image: data.image,
    });
    return newCategory;
  }

  @Mutation(() => Category)
  async modifyCategory(@Arg("data") newData: CategoryInput) {
    let categoryToUpdate = await Category.findOneByOrFail({ id: newData.id });
    categoryToUpdate = Object.assign(categoryToUpdate, newData);
    const newCategory = await categoryToUpdate.save();
    return newCategory;
  }

  @Mutation(() => String)
  async deleteCategory(@Arg("id") id: number) {
    const result = await Category.delete(id);
    if (result.affected === 1) {
      return "Category as been deleted";
    } else {
      throw new Error("Category has not been found");
    }
  }
}
