import { Tag } from "../entities/Tag";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver(Tag)
export class TagResolver {
  @Query(() => [Tag])
  async getAllTags() {
    return await Tag.find();
  }

  @Query(() => [Tag])
  async getTagsByCategory(@Arg("category") categoryId: number)
    {
      const tags= await Tag.find({
          order: {
            id: "ASC"
          },
          where: {
            category: {
              id: categoryId
            },
          }
        })
      return tags;
    }
}
