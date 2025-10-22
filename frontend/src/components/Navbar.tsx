import { Link } from "react-router-dom";
import { useGetAllCategoriesQuery } from "../generated/graphql-types";
import { normalizeString } from "../assets/utils";

const Navbar = () => {
  const { loading, error, data } = useGetAllCategoriesQuery();

  if (loading) return <p>Loading ...</p>;
  if (error) return <p> Error : {error.message}</p>;
  if (data) {
    return (
      <div className="flex flex-col items-center w-full">
        <nav className="bg-green hidden md:flex items-center justify-center sm:justify-between px-8 py-3 w-full">
          {data.getAllCategories.map((category) => (
            <Link
              key={category.id}
              to={`/categorie/${normalizeString(category.title)}`}
              state={{
                id: category.id,
                title: category.title,
                image: category.image,
              }}
              className="text-white font-bold hover:underline  gap-x-6 text-sm md:text-base"
            >
              {category.title}
            </Link>
          ))}
        </nav>
      </div>
    );
  }
};

export default Navbar;
