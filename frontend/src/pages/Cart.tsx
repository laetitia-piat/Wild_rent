import { useContext, useEffect, useState } from "react";
import { cartContext } from "../context/CartContext";
import "react-datepicker/dist/react-datepicker.css";
import {
  useCheckProductAvailabilityLazyQuery,
  useCreateCheckoutSessionMutation,
} from "../generated/graphql-types";
import { useRentalDates } from "@/hooks/useRentalDates";
import { SelectRentalDates } from "@/components/SelectRentalDates";
import { Button } from "@/components/ui/button";

type AvailabilityResult = {
  available: boolean | undefined;
  availableQty: number | undefined;
};

const Cart = () => {
  const { items, removeItemFromCart, updateQuantity } = useContext(
    cartContext
  ) as {
    items: any[];
    removeItemFromCart: (index: number) => void;
    updateQuantity: (quantity: number) => void;
  };
  const { startDate, endDate } = useRentalDates();
  const [availabilityResults, setAvailabilityResults] = useState<
    Record<number, AvailabilityResult>
  >({});
  const [getStripeSession] = useCreateCheckoutSessionMutation();
  const [checkProductAvailability] = useCheckProductAvailabilityLazyQuery();

  const calculateDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const duration =
    startDate && endDate ? calculateDuration(startDate, endDate) : 0;

  const total = items
    .map((item: any) => item.price * item.quantity * duration)
    .reduce((acc, price) => acc + price, 0);

  useEffect(() => {
    if (!items || items.length === 0 || !startDate || !endDate) return;
    items.forEach((item) => {
      checkProductAvailability({
        variables: {
          productId: item.selectedOption.id,
          quantity: item.quantity,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
      }).then((response) => {
        if (response.data) {
          setAvailabilityResults((prev) => ({
            ...prev,
            [item.selectedOption.id]: {
              available: response.data?.checkProductAvailability.available,
              availableQty:
                response.data?.checkProductAvailability.availableQty,
            },
          }));
        }
      });
    });
  }, [items, startDate, endDate]);

  const handleRemoveClick = (index: number) => {
    removeItemFromCart(index);
  };
  const handleAddQuantity = (product: any) => {
    updateQuantity(product.quantity++);
  };
  const handleRemoveQuantity = (product: any) => {
    updateQuantity(product.quantity--);
  };

  const handleCheckout = async () => {
    localStorage.setItem(
      "cartInfos",
      JSON.stringify({ startDate, endDate, total })
    );
    getStripeSession({
      variables: {
        data: items.map((item: any) => ({
          name: item.name,
          quantity: Number(item.quantity * duration),
          price: Number(item.price),
        })),
      },
      onCompleted(data) {
        console.log(data);
        console.log("Stripe session response:", data);
        if (data?.createCheckoutSession?.url) {
          window.location.href = data.createCheckoutSession.url;
        } else {
          console.error("❌ Pas d'URL Stripe retournée");
        }
      },
      onError(error) {
        console.error("❌ Erreur Stripe:", error);
      },
    });
  };

  const allProductAvailable = Object.values(availabilityResults).every(
    (result) => result.available
  );

  if (!startDate || !endDate || items.length === 0)
    return items.length === 0 ? (
      <div className="flex flex-col items-center p-5">
        <SelectRentalDates />
        <p className="text-center text-2xl mt-16 mb-16">
          Votre panier est vide
        </p>
      </div>
    ) : (
      <div className="flex flex-col items-center p-5">
        <SelectRentalDates />
        <p className="w-full mx-10 flex justify-center mt-5 font-bold">
          Vous devez délectionner des dates de location pour voir le contenu de
          votre panier et assuer la disponibilité des produits
        </p>
      </div>
    );

  return (
    <div className="flex flex-col flex-1 items-center w-full">
      <SelectRentalDates />
      {items.length === 0 && (
        <p className="text-center text-2xl mt-16 mb-16">
          Votre panier est vide
        </p>
      )}
      {items.length !== 0 && (
        <div className="w-full py-5">
          <div className="w-[90%] lg:w-[70%] m-auto">
            <div>
              {duration ? (
                <p className="italic">
                  Vous souhaitez louer du {""}
                  <span className="font-bold">
                    {startDate ? startDate.toLocaleDateString() : "?"}
                  </span>{" "}
                  au {""}
                  <span className="font-bold">
                    {endDate ? endDate.toLocaleDateString() : "?"}
                  </span>{" "}
                  soit un total de <span className="font-bold">{duration}</span>{" "}
                  jour(s)
                </p>
              ) : (
                <></>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl pt-6 font-semibold">
              Contenu de mon panier:
            </h3>
          </div>
          <div className="bg-white flex justify-center flex-col md:p-4 items-center">
            {items.map((item, index) => {
              const itemAvailable =
                availabilityResults[item.selectedOption.id]?.available;
              const availableQty =
                availabilityResults[item.selectedOption.id]?.availableQty;
              return (
                <div className="w-[95%] lg:w-[80%] flex flex-col">
                  <div
                    className=" w-full p-2 bg-green rounded-lg m-auto mt-4 flex justify-between items-center"
                    key={index}
                  >
                    <div className="w-[20%] md:w-[25%] flex justify-center mt-2 mb-2">
                      <img
                        className="max-w-full max-h-14 md:max-h-16 lg:max-h-24 rounded-lg ml-1"
                        src={item.pictures?.[0].url ?? ""}
                        alt={item.name}
                      />
                    </div>
                    <div className="bg-[#D9D9D9] w-[40%] lg:w-[50%] p-1 rounded-lg">
                      <p className="text-base sm:text-xl">
                        {" "}
                        {item.name} - {item.selectedOption.size}
                      </p>

                      <p className="text-xs sm:text-base">
                        {item.price}€ / jour
                      </p>
                    </div>
                    <div className="w-[30%] flex flex-col items-center">
                      <div className="flex flex-row mt-4">
                        <div>
                          <div className="flex flex-row">
                            <button
                              className="bg-[#D9D9D9] w-6 h-6 md:w-8 lg:w-10 xl:w-14 rounded-tl-lg rounded-bl-lg text-center hover:cursor-pointer"
                              onClick={() => handleRemoveQuantity(item)}
                            >
                              -
                            </button>
                            <div
                              aria-label="quantity"
                              className="bg-[#D9D9D966] w-6 md:w-8 lg:w-10 xl:w-14 text-center"
                            >
                              {item.quantity}
                            </div>
                            <button
                              className="bg-[#D9D9D9] w-6 md:w-8 lg:w-10 xl:w-14 rounded-tr-lg rounded-br-lg text-center hover:cursor-pointer"
                              onClick={() => handleAddQuantity(item)}
                            >
                              +
                            </button>
                          </div>
                          <div className="text-center mt-2 text-white">
                            {!duration || duration === 0 ? (
                              <p>{item.price * item.quantity}€</p>
                            ) : (
                              <p>{item.price * item.quantity * duration}€</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-1 ml-2 md:ml-3  lg:mb-4 lg:ml-5 ">
                          <button
                            onClick={() => handleRemoveClick(index)}
                            className="hover:cursor-pointer"
                          >
                            <img
                              src="/assets/images/icons/corbeille.png"
                              alt="corbeille"
                              className="w-4 h-4  lg:w-6 lg:h-6  m-auto"
                            />{" "}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!itemAvailable && (
                    <p className="text-red-600">
                      {`Ce produit n'est pas disponible pour vos dates, il reste ${availableQty} exemplaires pour ces dates`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-1/2 m-auto mt-4 flex justify-between items-center mb-4">
            <p className="text-2xl">Total: </p>
            <p className="text-2xl">{total}€</p>
          </div>
          <div className="flex justify-center pb-8 pt-8">
            <Button
              className="md:w-1/4 m-auto bg-green hover:bg-green/50 hover:cursor-pointer text-white p-2  sm:text-xl py-5"
              onClick={handleCheckout}
              disabled={!allProductAvailable}
            >
              Payer avec Stripe
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
