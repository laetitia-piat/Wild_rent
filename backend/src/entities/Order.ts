import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ProductInOrder } from "./ProductInOrder";
import { User } from "./User";

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  created_at: Date;

  @Field()
  @Column()
  total_price: number;

  @Field()
  @Column()
  rental_start_date: Date;

  @Field()
  @Column()
  rental_end_date: Date;

  @Field()
  @Column({ default: "PENDING" })
  status: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders, {
    eager: true, // lorsque l'on récupère un order, on récupère aussi la data du user
  })
  user: User;

  @Field(() => [ProductInOrder])
  @OneToMany(() => ProductInOrder, (productInOrder) => productInOrder.order)
  products_in_order: ProductInOrder[];
}
