import { User } from "../entities/User";
import { Field, InputType } from "type-graphql";
import { IsEmail } from 'class-validator';


@InputType()
export class UserInput implements Partial<User> {
  @Field({ nullable: true })
  first_name?: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  phone_number: string;

  @Field()
  password: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  userId: number;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  phone_number: string;
}

@InputType()
export class UpdateOrCreateUserInput {
  @Field({ nullable: true })
  userId: number;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  phone_number: string;

  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  zipcode: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  created_at: Date;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  old_password: string;

  @Field()
  new_password: string;

  @Field()
  password_confirmation: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  token: string;

  @Field()
  new_password: string;

  @Field()
  password_confirmation: string;
}


@InputType()
export class ForgottenPasswordRequestInput {
  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class DeleteUserInput {
  @Field()
  userId!: number;
}