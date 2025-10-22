import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
@ObjectType()
export class TempUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  first_name: string;

  @Column()
  @Field()
  last_name: string;

  @Column()
  @Field()
  email: string;

  @Column({nullable: true})
  hashed_password: string;

  @Column()
  random_code: string;

  @Column()
  @Field()
  phone_number: string;

  @Column({nullable:true})
  street: string;

  @Column({nullable:true})
  city: string;

  @Column({nullable:true})
  zipcode: string;

  @Column({nullable: true})
  @Field()
  role: string
}
