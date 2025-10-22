import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "./Address";
import { Order } from "./Order";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  first_name: string;

  @Field()
  @Column()
  last_name: string;

  @Field()
  @Column({ default: "USER" })
  role: string;

  @Field()
  @Column()
  email: string;

  @Column()
  hashed_password: string;

  @Field()
  @Column()
  phone_number: string;

  @Field()
  @Column()
  created_at: Date;

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Field(() => Address, { nullable: true })
  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  address: Address | null;

  @Column({ type: "varchar", nullable: true })
  reset_password_token: string | null;

  @Column({ type: "timestamp", nullable: true })
  reset_password_expires: Date | null;
}
