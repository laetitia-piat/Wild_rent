import { useLogoutMutation } from "@/generated/graphql-types";
import { WHO_AM_I } from "@/graphql/queries";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

type MenuProps = {
  setShowForms: Dispatch<SetStateAction<boolean>>[];
};

function Menu({ setShowForms }: MenuProps) {
  const navigate = useNavigate();

  const resetForms = () => {
    setShowForms.forEach((setForm) => setForm(false));
  };

  const [logout] = useLogoutMutation({
    refetchQueries: [{ query: WHO_AM_I, fetchPolicy: "no-cache" }],
  });

  return (
    <section className="w-64 border rounded-md p-6 space-y-6 text-sm font-semibold text-gray-700">
      <div
        className="text-green-900 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Accueil
      </div>
      <div
        className="text-green-900 cursor-pointer"
        onClick={() => {
          {
            resetForms();
          }
          navigate("/moncompte");
        }}
      >
        Mes informations
      </div>
      <div
        className="text-green-900 cursor-pointer"
        onClick={() => navigate("/moncompte/mes-commandes")}
      >
        Mes commandes
      </div>
      <div
        className="text-green-900 cursor-pointer"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Se déconnecter
      </div>
    </section>
  );
}

export default Menu;
