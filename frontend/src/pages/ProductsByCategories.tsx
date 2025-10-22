import { useLocation } from "react-router-dom";
import {
  useGetAvailableProductForDatesQuery,
  useGetProductWithFiltersQuery,
  useGetTagsByCategoryQuery,
} from "../generated/graphql-types";
import Loader from "../components/Loader";
import ItemCard from "../components/ItemCard";

import { ProductFilters } from "@/components/ProductFilters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectRentalDates } from "@/components/SelectRentalDates";
import { useRentalDates } from "@/hooks/useRentalDates";
import { toUTCISOString } from "@/components/CategoryCarousel";

function ProductsByCategories() {
  const location = useLocation();
  const { id, title, image } = location.state;
  const { startDate, endDate } = useRentalDates();
  const imageBasePath = "/assets/images/categories/";
  const imageSrc = image?.startsWith("/img/") ? image : imageBasePath + image;
  const {
    data: dataAvailable,
    loading: loadingAvailable,
    error: errorAvailable,
    refetch: refetchAvailable,
  } = useGetAvailableProductForDatesQuery({
    variables: {
      categoryId: id,
      startDate: startDate ? toUTCISOString(startDate) : "",
      endDate: endDate ? toUTCISOString(endDate) : "",
      keyword: "",
      tags: [],
    },
    skip: !startDate || !endDate,
  });

  const { data, loading, error, refetch } = useGetProductWithFiltersQuery({
    variables: {
      categoryId: id,
      minPrice: 0,
      maxPrice: 500,
      keyword: "",
      tags: [],
    },
  });
  const { data: tagsData } = useGetTagsByCategoryQuery({
    variables: {
      category: id,
    },
  });

  let products;
  if (startDate && endDate) {
    products = dataAvailable?.getAvailableProductForDates;
  } else {
    products = data?.getProductWithFilters;
  }
  const tags = tagsData?.getTagsByCategory;

  if (loading || loadingAvailable) return <Loader />;
  if (error || errorAvailable) console.error(error);
  return (
    <div className="w-full flex flex-col items-center pb-5">
      <div className="w-full aspect-video md:aspect-[7/2] relative overflow-hidden flex flex-col justify-center items-center mb-2">
        <img src={imageSrc} className="object-cover w-full object-center" />
        <div className="absolute bottom-0 h-3/4 w-full bg-gradient-to-b from-transparent to-black/70 z-10"></div>
        <h1 className="absolute text-body font-semibold text-4xl lg:text-5xl xl:text-7xl text-white z-20">
          {title}
        </h1>
      </div>
      <SelectRentalDates />
      <div className="flex flex-col sm:flex-row w-full px-5 lg:px-10 xl:px-20 mt-10 gap-10">
        <div className="w-full sm:w-1/4">
          <div className="sm:hidden flex flex-col">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-2xl lg:text-3xl text-title font-bold text-black mb-5">
                  Filtres
                </AccordionTrigger>
                <AccordionContent>
                  {tags && (
                    <ProductFilters
                      tags={tags}
                      refetch={
                        startDate && endDate ? refetchAvailable : refetch
                      }
                      categoryId={id}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="hidden sm:flex flex-col">
            <h2 className="text-2xl lg:text-3xl text-title font-bold text-black mb-5">
              Filtres
            </h2>
            {tags && (
              <ProductFilters
                tags={tags}
                refetch={startDate && endDate ? refetchAvailable : refetch}
                categoryId={id}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:w-3/4 w-full">
          {products &&
            products.map((product) => (
              <div className="aspect-square" key={product.id}>
                <ItemCard product={product} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsByCategories;
