import { GetProductByCategoryQuery } from "../generated/graphql-types";

export type ProductType = GetProductByCategoryQuery["getProductByCategory"][0];

export const ItemCardPreview = ({ product }: { product: ProductType }) => {
  return (
    <div className="flex-none basis-1/4 p-2" key={product.id}>
      <div className="rounded-md shadow-md overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="w-full h-64 relative">
            <img
              src={product.pictures[0].url}
              alt={product.name}
              className="object-contain w-full h-full p-4"
              style={{ maxHeight: "256px" }}
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="w-full p-2 pt-1">
            <div className="text-green font-bold text-lg">{product.name}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-gray-700 font-bold text-lg">
                {product.price} €
              </div>
              <p className="bg-green py-1 px-3 text-white rounded-md cursor-pointer">
                Voir
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// todo le voir pas implémenter
