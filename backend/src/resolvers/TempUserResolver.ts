import { IsAdmin } from "../middleware/AuthChecker";
import { TempUser } from "../entities/TempUser";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

@Resolver(TempUser)
export class TempUserResolver {

  @Query(() => [TempUser])
  @UseMiddleware(IsAdmin)
  async getAllTempUsers( ) {
    const tempUsers = await TempUser.find( {order: {
        id: "ASC",
    },})
    
    return tempUsers;
  }

  @Mutation(() => String)
  @UseMiddleware(IsAdmin)
  async deleteTempUser(@Arg("id") id: number) {
    const result = await TempUser.delete(id);
    if (result.affected === 1) {
      return "L'utilisateur a bien été supprimé";
    } else {
      throw new Error("L'utilisateur n'a pas été trouvé");
    }
  }

}