import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { Field, ObjectType } from "type-graphql";
import { Category } from "./Category";

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  label: string;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.tags)
  category: Category;

  @Field(() => [Product])
  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];
}
