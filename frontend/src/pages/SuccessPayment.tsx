import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateNewOrderMutation } from "../generated/graphql-types";
import { cartContext } from "../context/CartContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useUser } from "@/hooks/useUser";

const Success = () => {
  const [createOrderMutation] = useCreateNewOrderMutation();
  const cartInfos = localStorage.getItem("cartInfos");
  const cartInfosParsed = cartInfos ? JSON.parse(cartInfos) : null;
  const startDate = cartInfosParsed ? cartInfosParsed.startDate : null;
  const endDate = cartInfosParsed ? cartInfosParsed.endDate : null;
  const totalAmount = cartInfosParsed ? cartInfosParsed.total : null;

  const { items } = useContext(cartContext);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const createOrderAfterPayment = async () => {
      if (items.length === 0) return;

      const orderData = {
        rental_start_date: startDate,
        rental_end_date: endDate,
        created_at: new Date(),
        total_price: totalAmount,
        products: items.map((item: any) => ({
          quantity: item.quantity,
          productOptionId: item.selectedOption.id,
        })),
        userId: user?.id || 0,
      };

      try {
        await createOrderMutation({
          variables: { data: orderData },
          onCompleted: (data) => {
            console.log("commande créé:", data);
            localStorage.removeItem("cart");
            localStorage.removeItem("cartInfos");
            toast.success(
              "Votre commande a bien été enregistrée, vous allez être redirigée vers la page d'accueil"
            );
            setTimeout(() => {
              navigate("/");
            }, 3000);
          },
        });
      } catch (err) {
        console.error(err);
      }
    };
    createOrderAfterPayment();
  }, [user, items]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold">Merci pour votre paiement !</h1>
      <p>Votre commande est en cours de traitement...</p>
    </div>
  );
};

export default Success;
