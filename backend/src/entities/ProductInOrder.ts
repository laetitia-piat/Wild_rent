import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order";
import { ProductOption } from "./ProductOption";

@ObjectType()
@Entity()
export class ProductInOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  quantity: number;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.products_in_order, {
    eager: true,
    onDelete: "CASCADE",
  })
  order: Order;

  @Field(() => ProductOption)
  @ManyToOne(() => ProductOption, (option) => option.orders, { eager: true })
  productOption: ProductOption;
}
