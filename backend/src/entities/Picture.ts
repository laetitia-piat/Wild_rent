import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Product } from "./Product";
  import { Field, ObjectType } from "type-graphql";
  
  @ObjectType()
  @Entity()
  export class Picture extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column()
    url: string;
  
    @ManyToOne(() => Product, (product) => product.pictures, { onDelete: "CASCADE" })
    product: Product;
  }
  