import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAvailableProductOptionsQuery,
  useGetProductByIdQuery,
} from "../generated/graphql-types";
import { useState } from "react";
import { useRentalDates } from "@/hooks/useRentalDates";
import { ShieldAlert } from "lucide-react";
import { toUTCISOString } from "@/components/CategoryCarousel";
import { SelectRentalDates } from "@/components/SelectRentalDates";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/features/cart/cartSlice";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id }: any = useParams();
  const { startDate, endDate } = useRentalDates();
  const isE2E = import.meta.env.VITE_E2E_TEST === "true";
  const dispatch = useDispatch();
  const { loading, error, data } = useGetProductByIdQuery({
    variables: { getProductByIdId: parseInt(id) },
  });

  const {
    loading: loadingOptions,
    error: errorOptions,
    data: dataOptions,
  } = useGetAvailableProductOptionsQuery({
    variables: {
      productId: parseInt(id),
      endDate: endDate ? toUTCISOString(endDate) : "",
      startDate: startDate ? toUTCISOString(startDate) : "",
    },
    skip: !startDate || !endDate,
  });

  const availableOptions = dataOptions?.getAvailableProductOptions;

  const [selectedOption, setSelectedOption] = useState<{
    id: number;
    size: string;
  } | null>(null);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const products = data?.getProductById;

  const isDisabled = selectedOption === null || !startDate || !endDate;

  if (loading || loadingOptions) return <p>Loading...</p>;
  if (error) return <p>Error loading product</p>;
  if (errorOptions) return <p>Error loading option</p>;
  const mainImage = activeImage || products?.pictures[0].url;

  return (
    <div className="flex flex-col items-center py-5">
      <SelectRentalDates />
      {(!startDate || !endDate) && (
        <p className="flex items-center gap-2 text-red-600">
          <ShieldAlert />
          Veuillez renseigner vos dates de location pour voir la disponibilité
          du produit
        </p>
      )}
      <div className="flex flex-col md:flex-row items-start gap-10 p-10 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
        {/* Image Section */}
        <div className="flex flex-row md:flex-col gap-4 m-auto">
          {/* Image principale */}
          <img
            src={mainImage}
            alt={products?.name}
            className="w-64 h-64 object-contain rounded-lg"
          />
          {/* Miniatures */}
          <div className="flex flex-col md:flex-row gap-2 justify-around">
            {products?.pictures.slice(0, 4).map((pic: any, index: number) => {
              const fullUrl = pic.url;
              return (
                <img
                  key={index}
                  src={fullUrl}
                  alt="Preview"
                  className={`w-20 h-20 rounded-lg cursor-pointer border object-contain ${
                    fullUrl === mainImage
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(fullUrl)}
                />
              );
            })}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 m-auto">
          <h2 className="text-2xl font-semibold mb-2 ">{products?.name}</h2>
          {/* Description */}
          <p className="mt-4 mb-4 text-gray-700">{products?.description}</p>
          <div className="flex flex-col md:flex-row justify-around">
            <div className="w-full md:w-1/2">
              {/* Taille Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-4 mt-5">
                  Taille :
                </label>
                <select
                  aria-label="Sélecteur d'options"
                  className="border rounded-md p-2 w-full"
                  value={selectedOption ? JSON.stringify(selectedOption) : ""}
                  onChange={(e) => {
                    const parsed = JSON.parse(e.target.value);
                    setSelectedOption(parsed);
                  }}
                >
                  <option value="" disabled>
                    -- Sélectionnez une taille --
                  </option>
                  {availableOptions?.map((el: any) => (
                    <option
                      key={el.id}
                      value={JSON.stringify({
                        id: el.id,
                        size: el.size,
                      })}
                    >
                      {el.size}
                    </option>
                  ))}
                </select>
                {availableOptions?.length === 0 && (
                  <p className="text-red-600 text-sm">
                    Ce produit n'est pas disponible pour vos dates
                  </p>
                )}
              </div>
              <div className="mt-7 text-sm font-medium">
                Niveau: Intermédiaire
              </div>
            </div>
            <div className="flex mt-3 md:flex-col justify-evenly  ">
              {/* Pricing and CTA */}
              <div className=" bg-gray-100 p-3 rounded-lg shadow-sm">
                <div className="text-xl font-bold">
                  {products?.price}€ / jour
                </div>
              </div>

              <button
                onClick={() => {
                  const productWithOptions = {
                    ...products,
                    selectedOption,
                  };
                  dispatch(addItemToCart(productWithOptions));
                  if (!isE2E) {
                    navigate(-1);
                  }
                }}
                disabled={isDisabled}
                className="h-15 md:mt-7 md:w-full bg-[#4F6F64] text-white py-3 rounded-lg font-medium shadow-md hover:bg-[#3e5b51] transition disabled:bg-green/50 px-2 cursor-pointer"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
