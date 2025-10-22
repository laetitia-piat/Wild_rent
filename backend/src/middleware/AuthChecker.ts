import { AuthContextType } from "src/auth";
import { MiddlewareFn } from "type-graphql";
import { GraphQLError } from "graphql";

// Middleware TypeGraphQL : utilisé pour sécuriser l'accès à certains champs ou résolveurs.
// Ici, `IsUser` permet de restreindre l'accès aux données personnelles (email, téléphone, adresse...)
// uniquement à l'utilisateur concerné ou à un administrateur.
// root correspond à l'utilisateur actuellement connecté
// Voir la doc pour plus d'infos sur les middlewares -> https://typegraphql.com/docs/middlewares.html
export const IsCurrentUserOrAdmin: MiddlewareFn<AuthContextType> = async (
  { context, args },
  next
) => {
  if (context.user.role === "ADMIN" || context.user.id === args.data.userId) {
    return next(); // on exécute le code du resolver si la condition est remplie
  } else {
    throw new GraphQLError("You are not authorized to perform this action.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
};

// Uniquement pour les admins, exemple dans le resolver User.ts pour récupérer tous les utilisateurs
export const IsAdmin: MiddlewareFn<AuthContextType> = async (
  { context },
  next
) => {
  if (context.user.role === "ADMIN") {
    return next();
  }
  throw new GraphQLError("You are not authorized to perform this action.", {
    extensions: {
      code: "FORBIDDEN",
    },
  });
};
