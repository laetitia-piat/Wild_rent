import "dotenv/config";
import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { User } from "./entities/User";
import Cookies from "cookies";

export type ContextType = { req: any; res: any; user: User | null | undefined };
export type AuthContextType = ContextType & { user: User }; // Intersection de types, user ici est forcémment User et non plus null ou undefined

export async function getUserFromContext(
  context: ContextType
): Promise<User | null> {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token");
  if (!token) {
    return null;
  }
  try {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }

    // On récupère dans le payload l'id de l'utilisateur qui vient de se connecter, 
    // on fait passer l'id lors de la signature du token (UserResolver.ts)
    const payload = verify(token, secret) as {
      id: number;
      email: string;
      user_role: string;
    };

    const user = await User.findOneBy({
      id: payload.id,
    });

    if (user) {
      console.log(`Access authorized for user ${user.first_name} ${user.last_name}, ID : ${user.id}`);
    }

    return user;
  } catch {
    console.log("Invalid JWT");
    return null;
  }
}

export const authChecker: AuthChecker<ContextType> = async (
  { context },
  roles
) => {
  // Exemple du fonctionnement des autorisations venant de la doc (https://typegraphql.com/docs/authorization.html)
  // @Authorized(["admin", "user"]) → roles = ["admin", "user"]
  // @Authorized() → roles = []

  // Si aucun rôle n’est spécifié dans le décorateur @Authorized(),
  // Alors, par défaut, seul un utilisateur avec le rôle "admin" pourra accéder à cette ressource
  if (roles.length === 0) {
    roles = ["ADMIN"];
  }

  // L'utilisateur connecté est déjà défini dans le contexte (index.ts)
  const user = context.user;
  if (user && roles.includes(user.role)) {
    return true;
  } else {
    return false;
  }
};
