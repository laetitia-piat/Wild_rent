import { ObjectType, Field, Int } from "type-graphql";
import { Category } from "./Category";

@ObjectType()
export class ReservationItem {
  @Field()
  date: Date; // or string if you want a formatted date

  @Field(() => Int)
  reservedQty: number;

  @Field(() => Int)
  availableQty: number;
}

@ObjectType()
export class OptionInventory {
  @Field()
  id: number;

  @Field()
  product: string;

  @Field()
  category: Category;

  @Field()
  option: string;

  @Field(() => Int)
  totalQty: number;

  @Field(() => [ReservationItem])
  reservations: ReservationItem[];
}

@ObjectType()
export class OptionAvailability {
  @Field()
  productOptionId: number;

  @Field()
  available: boolean;

  @Field()
  availableQty: number;
}
