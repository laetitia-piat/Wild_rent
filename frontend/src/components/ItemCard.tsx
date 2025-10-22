import { Link } from "react-router-dom";
import { GetProductByCategoryQuery } from "../generated/graphql-types";

type ProductType = GetProductByCategoryQuery["getProductByCategory"][0];

const ItemCard = ({ product }: { product: ProductType }) => {
  return (
    <div
      className="embla__slide flex-none flex basis-1/4 pl-4 p-2"
      key={product.id}
    >
      <div className="group relative rounded-md group shadow-md overflow-hidden hover:-translate-y-2 transition-transform duration-300 ease-out w-full">
        <div className="w-full flex flex-col items-center ">
          <div
            className="w-full relative overflow-hidden"
            style={{ paddingBottom: "100%" }}
          >
            <img
              src={product.pictures[0].url}
              className="absolute inset-0 object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
            />
            <div className="absolute inset-2 bg-black/10"></div>
          </div>
          <div className="w-full flex flex-col p-2 pt-0">
            <div className="text-green font-bold text-lg">{product.name}</div>
            <div className="w-full flex justify-between items-center mt-1">
              <div className="text-gray-500 font-semibold text-lg">
                {product.price} € / jour
              </div>
              <Link
                to={`/produit/${product.id}`}
                className="bg-green py-1 px-3 text-white rounded-md hover:bg-green/70"
              >
                Voir
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
