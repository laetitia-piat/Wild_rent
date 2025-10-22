import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { Picture } from "./Picture";
import { ProductOption } from "./ProductOption";
import { Field, ObjectType } from "type-graphql";
import { Tag } from "./Tag";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Field(() => [Picture])
  @OneToMany(() => Picture, (picture) => picture.product, {
    cascade: true, // lorsque nous sauvegardons un produit, nous voulons sauvegarder les images, et suppr cascade coté code
    eager: true, // lorsque nous demandons un produit, nous voulons les images
    onDelete: "CASCADE", // supprimer les images si le produit est supprimé, et suppr cascade coté BDD
  })
  pictures: Picture[];

  @Field(() => [ProductOption])
  @OneToMany(() => ProductOption, (product_option) => product_option.product, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  product_options: ProductOption[];

  @Field()
  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @Field(() => [Tag])
  @ManyToMany(() => Tag, (tag) => tag.products, { eager: true })
  @JoinTable()
  tags: Tag[];
}
