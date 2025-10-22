import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Product } from "./Product";
import { Field, ObjectType } from "type-graphql";
import { Tag } from "./Tag";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  title: string;

  @Field()
  @Column()
  image: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Field(() => [Tag])
  @OneToMany(() => Tag, (tag) => tag.category)
  tags: Tag[];
}
