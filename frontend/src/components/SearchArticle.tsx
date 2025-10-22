import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_OPTIONS } from "../graphql/queries";
import { toast } from "react-toastify";
import { ArticleForm } from "./ArticleForm";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  pictures: { url: string }[];
  product_options: { size: string; total_quantity: number }[];
  category: { id: string; title: string };
  tags: { id: string; label: string }[];
}

interface SearchResult {
  searchProductsByOptions: Product[];
}

interface SearchVariables {
  options: {
    name: string;
    categoryId?: string;
    productOption?: string;
  };
}

type SearchArticleProps = {
  isReload?: boolean;
  onReload?: () => void;
};

export function SearchArticle({ isReload, onReload }: SearchArticleProps) {
  const [search, setSearch] = useState("");
  const [searchProducts, queryResult] = useLazyQuery<
    SearchResult,
    SearchVariables
  >(SEARCH_PRODUCTS_BY_OPTIONS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim().length >= 2) {
      searchProducts({
        variables: {
          options: { name: search },
        },
      });
      setSelectedProduct(null);
    } else {
      toast.error(`Erreur lors de l'envoie de la requette.`);
    }
  };

  useEffect(() => {
    if (isReload) {
      queryResult.refetch?.();
      onReload?.();
    }
  }, [isReload]);

  return (
    <div className="w-full mx-auto">
      <div className="mb-10">
        <form onSubmit={handleSubmit} className="flex justify-between w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full border pl-4 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <button
            type="submit"
            className="ml-2 border pr-2 pl-2 rounded cursor-pointer"
          >
            <img
              src="/assets/images/icons/loupe.png"
              alt="Recherche"
              className="w-5 h-5 "
            />
          </button>
        </form>

        {queryResult.loading && <p className="mt-4">Chargement...</p>}
        {queryResult.error && (
          <p className="mt-4 text-red-500">{queryResult.error.message}</p>
        )}

        {queryResult.data?.searchProductsByOptions.length === 0 ? (
          <p className="mt-4">Pas de résultat trouvé</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {queryResult.data?.searchProductsByOptions.map((product) => (
              <div
                key={product.id}
                className={`border p-2 rounded shadow-sm bg-white cursor-pointer transition-all ${
                  selectedProduct?.id === product.id
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "hover:border-gray-400"
                }`}
                onClick={() => {
                  setSelectedProduct(product);
                  console.log(product);
                }}
              >
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p>{product.price} €</p>
                {product.pictures?.[0] && (
                  <img
                    src={product.pictures[0].url}
                    alt={product.name}
                    className="w-full h-32 object-cover mt-2 rounded"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {selectedProduct && (
          <ArticleForm
            formId="form-2"
            createOrUpdate="update"
            previewDefault={true}
            productDefault={{
              id: parseInt(selectedProduct.id),
              name: selectedProduct.name,
              description: selectedProduct.description,
              price: selectedProduct.price,
              category: selectedProduct.category.id,
              pictures: selectedProduct.pictures,
              product_options: selectedProduct.product_options,
              tag_ids: selectedProduct.tags.map((el) => el.id),
            }}
            onDelete={() => {
              setSelectedProduct(null);
              queryResult.refetch?.();
            }}
          />
        )}
      </div>
    </div>
  );
}

// todo limiter le nombre d'item renvoyer par la requette (et ajouter un boutton pour load plus( peut etre garder le nmbre pour le reload))
// todo ajouter des options sur la recherche
