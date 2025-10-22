// permet l'utilisation de process.env (example: process.env.RESEND_API_KEY)
import "dotenv/config";
import {
  Query,
  Mutation,
  Resolver,
  Arg,
  Ctx,
  Int,
  ObjectType,
  Field,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import { TempUser } from "../entities/TempUser";
import {
  ChangePasswordInput,
  DeleteUserInput,
  ForgottenPasswordRequestInput,
  ResetPasswordInput,
  UpdateOrCreateUserInput,
  UpdateUserInput,
  UserInput,
} from "../inputs/UserInput";
import { LoginInput } from "../inputs/LoginInput";
import { ContextType } from "../auth";
import { Resend } from "resend";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import { Address } from "../entities/Address";
import { IsAdmin, IsCurrentUserOrAdmin } from "../middleware/AuthChecker";
import { CreateOrUpdateAddressInput } from "../inputs/AddressInput";
import { GraphQLError } from "graphql";

@ObjectType()
class PaginatedUsers {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  totalUsersLength: number;
}

@ObjectType()
class WhoAmI {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  role: string;
}

@ObjectType()
class GetUserInfo {
  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field()
  phone_number: string;

  @Field()
  created_at: string;

  @Field(() => Address, { nullable: true })
  address: Address;
}

@ObjectType()
class UserInfo {
  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  phone_number: string;
}

let baseUrl = process.env.BASE_URL_DEV;

if (process.env.APP_ENV === "staging") {
  baseUrl = process.env.BASE_URL_STAGING;
}

if (process.env.APP_ENV === "production") {
  baseUrl = process.env.BASE_URL_PRODUCTION;
}

@Resolver(User)
export class UserResolver {
  @Query(() => PaginatedUsers)
   @UseMiddleware(IsAdmin)
  async getAllUsers(
    @Arg("offset") offset: number,
    @Arg("limit") limit: number,
    @Arg("role", { nullable: true }) role?: string,
    @Arg("search", { nullable: true }) search?: string
  ) {
    const query = User.createQueryBuilder("user").leftJoinAndSelect(
      "user.address",
      "address"
    );
    if (role) {
      query.andWhere("user.role = :role", { role });
    }
    if (search) {
      query.andWhere(
        "user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search",
        { search: `%${search}%` }
      );
    }
    const totalUsersLength = await query.getCount();
    const users = await query
      .orderBy("user.id", "ASC")
      .skip(offset)
      .take(limit)
      .getMany();

    return { users: users, totalUsersLength: totalUsersLength };
  }

  @Mutation(() => String)
  async register(@Arg("data") new_user_data: UserInput) {
    const random_code = uuidv4();
    const result = TempUser.save({
      first_name: new_user_data.first_name,
      last_name: new_user_data.last_name,
      email: new_user_data.email,
      phone_number: new_user_data.phone_number,
      hashed_password: await argon2.hash(new_user_data.password),
      random_code: random_code,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);

    (async function () {
      const { data, error } = await resend.emails.send({
        from: "wild-rent@test.anniec.eu",
        to: [new_user_data.email],
        subject: "Validation email",
        html: `
                <p>Veuillez cliquer sur le lien suivant pour confirmer votre adresse mail</p>
                <a href=${baseUrl}/confirmation/${random_code}>
                ${baseUrl}/confirmation/${random_code}</a>
                `,
      });
      if (error) {
        return console.error({ error });
      }
      console.log({ data });
    })();
    console.log("result", result);
    return "Temp user was created, validate with confirmation email";
  }

  @Mutation(() => String)
  async login(
    @Arg("data") login_user_data: LoginInput,
    @Ctx() context: ContextType
  ) {
    let is_password_correct = false;
    const user = await User.findOneBy({ email: login_user_data.email });
    if (user) {
      is_password_correct = await argon2.verify(
        user.hashed_password,
        login_user_data.password
      );
    }
    if (is_password_correct === true && user !== null) {
      const token = jwt.sign(
        // On signe le jwt avec l'id de l'utilisateur qu'on va ensuite récupérer au moment de déchiffrer le token (auth.ts)
        { id: user.id, email: user.email, user_role: user.role },
        process.env.JWT_SECRET_KEY as jwt.Secret
      );

      const cookies = new Cookies(context.req, context.res);
      cookies.set("token", token, {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 72,
      });

      return "ok";
    } else {
      throw new Error("Incorrect login");
    }
  }

  // Sert pour le front afin de récupérer l'utilisateur courant (via le contexte) sans faire de requête à la BDD
  @Query(() => WhoAmI, { nullable: true })
  async whoami(@Ctx() context: ContextType): Promise<User | null | undefined> {
    return context.user;
  }

  // Sert pour récupérer les données de l'utilisateur connecté
  @Query(() => GetUserInfo)
  async getUserInfo(@Ctx() context: ContextType): Promise<User> {
    if (!context.user) {
      throw new Error("Vous devez être authentifié");
    }
    // On utilise ici findOne afin de pouvoir accéder à Option et récupérer la relation
    const user = (await User.findOne({
      where: { email: context.user.email },
      relations: ["address"],
    })) as User;
    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", { maxAge: 0 });
    return true;
  }

  @Mutation(() => String)
  async confirmEmail(@Arg("code_by_user") code_by_user: string) {
    const tempUser = await TempUser.findOneByOrFail({
      random_code: code_by_user,
    });
    await User.save({
      first_name: tempUser.first_name,
      last_name: tempUser.last_name,
      email: tempUser.email,
      phone_number: tempUser.phone_number,
      hashed_password: tempUser.hashed_password,
      created_at: new Date(),
    });
    tempUser.remove();
    return "ok";
  }

  @Mutation(() => String)
  @UseMiddleware(IsCurrentUserOrAdmin)
  async deleteUser(@Arg("data") data: DeleteUserInput) {
    const result = await User.delete(data.userId);
    if (result.affected === 1) {
      return "L'utilisateur a bien été supprimé";
    } 
    throw new GraphQLError("L'utilisateur n'a pas été trouvé",{ extensions: { code: "NOT_FOUND" }});
  }

  @Mutation(() => User)
  @UseMiddleware(IsCurrentUserOrAdmin)
  async editUser(
    @Arg("data") updateUserData: UpdateOrCreateUserInput
  ) {
    let userToUpdate = await User.findOne({
      where: { id: updateUserData.userId },
      relations: ["address"],
    });
    if (!userToUpdate) {
      throw new GraphQLError("L'utilisateur n'a pas été trouvé",{ extensions: { code: "NOT_FOUND" }});
    }

    // Modifie les champs users
    userToUpdate.first_name = updateUserData.first_name;
    userToUpdate.last_name = updateUserData.last_name;
    userToUpdate.email = updateUserData.email;
    userToUpdate.phone_number = updateUserData.phone_number;
    userToUpdate.created_at = userToUpdate.created_at;
    userToUpdate.role = updateUserData.role;

    // Modifie l'adresse
    if (userToUpdate.address) {
      userToUpdate.address.street = updateUserData.street;
      userToUpdate.address.city = updateUserData.city;
      userToUpdate.address.zipcode = updateUserData.zipcode;
      userToUpdate.address.country = "France";
      await userToUpdate.address.save();
    } else {
      const newAddress = Address.create({
        street: updateUserData.street,
        city: updateUserData.city,
        zipcode: updateUserData.zipcode,
        country: "France",
      });
      await newAddress.save();
      userToUpdate.address = newAddress;
    }
    await userToUpdate.save();

    return userToUpdate;
  }

  @Mutation(() => String)
  @UseMiddleware(IsAdmin)
  async addUser(@Arg("data") new_user_data: UpdateOrCreateUserInput) {
    const existing = await User.findOne({ where: { email: new_user_data.email } });

    if(existing){
      throw new GraphQLError("Un compte existe déjà avec cette adresse mail", {
      extensions: { code: "EMAIL_TAKEN" },
    });
    }

    const random_code = uuidv4();
    const result = await TempUser.save({
      first_name: new_user_data.first_name,
      last_name: new_user_data.last_name,
      email: new_user_data.email,
      phone_number: new_user_data.phone_number,
      street: new_user_data.street,
      city: new_user_data.city,
      zipcode: new_user_data.zipcode,
      random_code: random_code,
      role: new_user_data.role,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "wild-rent@test.anniec.eu",
      to: [new_user_data.email],
      subject: "Verify Email",
      html: `
              <p>Veuillez cliquer sur le lien suivant pour compléter votre inscription à Wild Rent</p>
              <a href=http://localhost:7000/confirmation/enregistrement/${random_code}>
              http://localhost:7000/confirmation/enregistrement/${random_code}</a>
              `,
    });
    if (error) {
      console.error({ error });
      throw new GraphQLError("Erreur lors de l'envoi de l'email", {
        extensions: { code: "EMAIL_ERROR" },
      });
    }
    console.log({ data });
    console.log("result", result);
    return "Temp user was created, validate with confirmation email";
  }

  @Mutation(() => User)
  async addUserConfirmation(
    @Arg("random_code") random_code: string,
    @Arg("password") password: string
  ) {
      const tempUser = await TempUser.findOne({
        where:{ random_code: random_code}
      });

      if(!tempUser){
        throw new GraphQLError("Code de confirmation invalide ou expiré", {
          extensions: { code: "INVALID_CODE" },
        });
      }

      const hashed_password = await argon2.hash(password);

      const newAddress = Address.create({
        street: tempUser.street,
        city: tempUser.city,
        zipcode: tempUser.zipcode,
        country: "France",
      });

      await newAddress.save();

      const userResult = await User.save({
        first_name: tempUser.first_name,
        last_name: tempUser.last_name,
        email: tempUser.email,
        phone_number: tempUser.phone_number,
        hashed_password: hashed_password,
        created_at: new Date(),
        address: newAddress,
        role: tempUser.role,
      });
      await tempUser.remove();
      return userResult;
  }

  // Mutation pour enregistrer une adresse de facturation dans les détails du compte
  @Mutation(() => Address)
  @UseMiddleware(IsCurrentUserOrAdmin)
  async createOrUpdateAddress(
    @Arg("data") createOrUpdateAddress: CreateOrUpdateAddressInput
  ): Promise<Address> {
    try {
      const user = await User.findOne({
        where: { id: createOrUpdateAddress.userId },
        relations: ["address"],
      });

      if (!user) {
        throw new Error("Utilisateur introuvable");
      }

      if (user.address) {
        user.address.street = createOrUpdateAddress.street;
        user.address.city = createOrUpdateAddress.city;
        user.address.zipcode = createOrUpdateAddress.zipcode;
        user.address.country = createOrUpdateAddress.country;

        await Address.save(user.address);
        return user.address;
      } else {
        const newAddress = Address.create({
          street: createOrUpdateAddress.street,
          city: createOrUpdateAddress.city,
          zipcode: createOrUpdateAddress.zipcode,
          country: createOrUpdateAddress.country,
        });

        user.address = newAddress;
        await User.save(user);

        return newAddress;
      }
    } catch (error) {
      console.error("Erreur lors de la création d'adresse :", error);
      throw new Error("Impossible de créer l'adresse de facturation.");
    }
  }

  @Mutation(() => UserInfo)
  @UseMiddleware(IsCurrentUserOrAdmin)
  async updateUser(
    @Arg("data") updateUser: UpdateUserInput
  ): Promise<UserInfo> {
    let user = await User.findOneByOrFail({ id: updateUser.userId });

    user.first_name = updateUser.first_name;
    user.last_name = updateUser.last_name;
    user.email = updateUser.email;
    user.phone_number = updateUser.phone_number;

    await user.save();

    return user;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsCurrentUserOrAdmin)
  async changePassword(
    @Arg("data") data: ChangePasswordInput,
    @Ctx() context: ContextType
  ): Promise<boolean> {
    const user = await User.findOneByOrFail({ id: context.user?.id });

    const isPasswordValid = await argon2.verify(
      user.hashed_password,
      data.old_password
    );

    if (isPasswordValid && data.new_password === data.password_confirmation) {
      user.hashed_password = await argon2.hash(data.new_password);
      await user.save();
      return true;
    }

    if (!isPasswordValid) {
      throw new Error("Ancien mot de passe incorrect");
    }

    if (data.new_password !== data.password_confirmation) {
      throw new Error("Les mots de passe ne correspondent pas");
    }

    return false;
  }

  @Query(() => Boolean)
  async getResetPasswordToken(@Arg("token") token: string): Promise<boolean> {
    const user = await User.findOneBy({ reset_password_token: token });
    if (!user) return false;

    if (
      !user.reset_password_expires ||
      user.reset_password_expires < new Date()
    ) {
      return false;
    }

    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(@Arg("data") data: ResetPasswordInput): Promise<boolean> {
    const user = await User.findOneBy({ reset_password_token: data.token });
    if (!user) throw new Error("Token invalide");

    if (
      !user.reset_password_expires ||
      user.reset_password_expires < new Date()
    ) {
      throw new Error("Token expiré");
    }

    if (data.new_password !== data.password_confirmation) {
      throw new Error("Les mots de passe ne correspondent pas");
    }

    user.hashed_password = await argon2.hash(data.new_password);
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    return true;
  }

  @Mutation(() => Boolean)
  async forgottenPasswordRequest(
    @Arg("data") emailInput: ForgottenPasswordRequestInput
  ): Promise<boolean> {
    const user = await User.findOneBy({ email: emailInput.email });
    if (!user) {
      return true;
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    user.reset_password_token = token;
    user.reset_password_expires = expiresAt;
    await user.save();

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "wild-rent@test.anniec.eu",
      to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <p>Bonjour,</p>
        <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
        <a href="${baseUrl}/mdp-reset?token=${token}">Réinitialiser le mot de passe</a>
        <p>Ce lien expirera dans 1 heure.</p>
      `,
    });

    return true;
  }
}
