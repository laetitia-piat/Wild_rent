import { Link } from "react-router-dom";
import { categoryProps } from "./CategoryCard";
import {
  useGetAvailableProductForDatesQuery,
  useGetProductByCategoryQuery,
} from "../generated/graphql-types";
import Carousel from "./Carousel";
import ItemCard from "./ItemCard";
import { normalizeString } from "../assets/utils";
import { useRentalDates } from "@/hooks/useRentalDates";
import Loader from "./Loader";

export const toUTCISOString = (date: Date) => date.toISOString();

function CategoryCarousel({ title, id, image }: categoryProps) {
  const { startDate, endDate } = useRentalDates();

  const {
    data: dataAvailable,
    loading: loadingAvailable,
    error: errorAvailable,
  } = useGetAvailableProductForDatesQuery({
    variables: {
      categoryId: id,
      startDate: startDate ? toUTCISOString(startDate) : "",
      endDate: endDate ? toUTCISOString(endDate) : "",
      tags: [],
    },
    skip: !startDate || !endDate,
  });

  const { data, loading, error } = useGetProductByCategoryQuery({
    variables: {
      category: id,
    },
  });

  let products;

  if (startDate && endDate) {
    products = dataAvailable?.getAvailableProductForDates;
  } else {
    products = data?.getProductByCategory;
  }

  if (error || errorAvailable) {
    console.log(errorAvailable);
    return <p>error</p>;
  }
  if (loading || loadingAvailable)
    return <Loader text={"chargement des produits..."} />;
  return (
    <div className="w-full px-20 max-w-[1280px] mb-4">
      <div className="flex w-full justify-between px-4">
        <div className="font-bold font-title text-xl mb-4">{title}</div>
        <Link
          to={`/categorie/${normalizeString(title)}`}
          className="text-body font-semibold text-green border-1 text-center self-center px-3 py-2 rounded-md border-gray-200 hover:bg-green/20"
          state={{
            id: id,
            title: title,
            image: image,
          }}
        >
          Voir tous les articles
        </Link>
      </div>
      <Carousel>
        {products &&
          products.map((product) => (
            <ItemCard key={product.id} product={product} />
          ))}
      </Carousel>
    </div>
  );
}

export default CategoryCarousel;
