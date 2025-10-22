import { useState } from "react";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav
      className={`${
        isOpen ? "sm:w-60" : "w-fit"
      }   bg-light-beige p-4 flex flex-col flex-1 transition-all duration-400 shadow-md`}
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-6 w-full">
          <div
            className={`md:px-4 gap-2 flex justify-center ${
              isOpen && "sm:justify-start"
            } w-full text-nowrap items-center gap-x-2`}
          >
            <Settings size={25} aria-label="admin logo" />
            {isOpen && (
              <h1 className="text-xl hidden sm:flex font-semibold text-gray-800">
                Menu
              </h1>
            )}
          </div>
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="text-light-beige hover:text-green hover:bg-light-beige rounded-full bg-green cursor-pointer hover:border-1 border-1 border-green hidden sm:flex"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div
          className={`flex flex-col items-center ${
            isOpen ? "sm:items-start" : "sm:items-center"
          } gap-4 text-gray-700 ${isOpen ? "w-full" : "w-fit"}`}
        >
          <Link
            to="/admin/utilisateurs"
            className={`gap-2 w-full flex text-nowrap md:text-xl px-4 py-2 rounded-md transition-all duration-300 border border-transparent hover:border-gray-500/20 hover:shadow-sm hover:bg-gray-50 ${
              pathname === "/admin/utilisateurs" &&
              "!border-gray-500/20 bg-gray-50"
            }`}
          >
            👥 {isOpen && <p className="hidden sm:flex">Utilisateurs</p>}
          </Link>

          <Link
            to="/admin/categories"
            className={`gap-2 w-full flex text-nowrap md:text-xl px-4 py-2 rounded-md transition-all duration-300 border border-transparent hover:border-gray-500/20 hover:shadow-sm hover:bg-gray-50 ${
              pathname === "/admin/categories" &&
              "!border-gray-500/20 bg-gray-50"
            }`}
          >
            📂 {isOpen && <p className="hidden sm:flex">Catégories</p>}
          </Link>

          <Link
            to="/admin/article"
            className={`gap-2 w-full flex text-nowrap md:text-xl px-4 py-2 rounded-md transition-all duration-300 border border-transparent hover:border-gray-500/20 hover:shadow-sm hover:bg-gray-50 ${
              pathname === "/admin/article" && "!border-gray-500/20 bg-gray-50"
            }`}
          >
            📝 {isOpen && <p className="hidden sm:flex">Articles</p>}
          </Link>

          <Link
            to="/admin/commandes"
            className={`gap-2 w-full flex text-nowrap md:text-xl px-4 py-2 rounded-md transition-all duration-300 border border-transparent hover:border-gray-500/20 hover:shadow-sm hover:bg-gray-50 ${
              pathname === "/admin/commandes" &&
              "!border-gray-500/20 bg-gray-50"
            }`}
          >
            📦 {isOpen && <p className="hidden sm:flex">Commandes</p>}
          </Link>

          <Link
            to="/admin/inventaire"
            className={`gap-2 w-full flex text-nowrap md:text-xl px-4 py-2 rounded-md transition-all duration-300 border border-transparent hover:border-gray-500/20 hover:shadow-sm hover:bg-gray-50 ${
              pathname === "/admin/inventaire" &&
              "!border-gray-500/20 bg-gray-50"
            }`}
          >
            📊 {isOpen && <p className="hidden sm:flex">Inventaire</p>}
          </Link>
        </div>
      </div>
    </nav>
  );
};
