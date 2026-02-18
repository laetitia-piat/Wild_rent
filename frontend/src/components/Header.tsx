import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useWhoamiQuery } from "../generated/graphql-types";
import { Settings, ShoppingCart, UserRound } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCartCount } from "../features/cart/cartSlice";

const Header = () => {
  const { loading, error, data } = useWhoamiQuery();
  const count = useSelector(selectCartCount);

  const location = useLocation();
  const pathname = location.pathname;

  const isAdminPath = pathname.includes("/admin");

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <>
        <h2>An error occured</h2>
        <p>Error : {error.message}</p>
      </>
    );
  if (data) {
    return (
      <header className="sticky top-0 z-30">
        <div
          className={`${
            isAdminPath ? "bg-green" : "bg-light-beige"
          } flex items-center justify-between px-4 md:px-8 py-3`}
        >
          <Link to={"/"} className="flex items-center gap-x-2 md:flex-1">
            <img
              src="/assets/images/icons/logo.png"
              alt="Wild Rent logo"
              className="w-8 h-8 sm:w-10 sm:h-10  md:w-12 md:h-12"
            />
            <h1 className="sm:text-lg lg:text-2xl font-bold text-gray-800">
              Wild Rent
            </h1>
          </Link>

          <div className="flex items-center gap-x-4">
            {data.whoami?.role === "ADMIN" && !isAdminPath && (
              <Link
                className={`flex flex-col items-center hover:underline ${
                  isAdminPath ? "text-black" : "text-green"
                } `}
                to={"/admin/utilisateurs"}
              >
                <Settings size={27} />
                <span className=" hidden md:flex text-sm">Dashboard Admin</span>
              </Link>
            )}
            {data?.whoami?.email ? (
              <Link
                className={`flex flex-col items-center hover:underline ${
                  isAdminPath ? "text-black" : "text-green"
                } `}
                to={"/moncompte"}
              >
                <UserRound size={27} />
                <span className=" hidden md:flex text-sm">Mon compte</span>
              </Link>
            ) : (
              <Link
                className={`flex flex-col items-center hover:underline ${
                  isAdminPath ? "text-black" : "text-green"
                } `}
                to={"/login"}
              >
                <UserRound size={27} />
                <span className=" text-sm ">Connexion</span>
              </Link>
            )}
            {!isAdminPath && (
              <Link
                className="flex flex-col items-center hover:underline text-green"
                to={"/panier"}
              >
                <div className="relative">
                  <ShoppingCart />
                  <div className="absolute w-4 h-4 -top-1 -right-3 text-xs flex justify-center items-center font-bold text-white rounded-full bg-green">
                    {count}
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-x-1">
                  <span className="hidden md:block text-sm text-green">
                    Mon panier
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
        {!isAdminPath && <Navbar />}
      </header>
    );
  }
};

export default Header;
