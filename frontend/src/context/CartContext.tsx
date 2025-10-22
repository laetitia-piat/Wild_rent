import { createContext, ReactNode, useEffect, useReducer } from "react";
import { toast } from "react-toastify";

interface ProductWithOptions {
  selectedOption: {
    id: number;
    size: string;
  };
  id: number;
  name: string;
  description?: string;
  price: number;
  created_at?: any;
  pictures?: {
    id: number;
    url: string;
  }[];
  product_options: {
    size: string;
    id: number;
    total_quantity: number;
  }[];
  tags?: {
    id: number;
    label: string;
  }[];
  quantity: number;
}

type CartState = {
  items: ProductWithOptions[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: ProductWithOptions }
  | { type: "REMOVE_ITEM"; payload: { index: number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } };

type CartContextType = {
  items: ProductWithOptions[];
  addItemToCart: (product: any) => void;
  removeItemFromCart: (product: any) => void;
  updateQuantity: (product: any) => void;
};

export const cartContext = createContext<CartContextType>({
  items: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  updateQuantity: () => {},
});

const getInitialCart = (): CartState => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { items: [] };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du panier depuis localStorage:",
      error
    );
    return { items: [] };
  }
};

const cartReducer = (state: CartState, action: CartAction) => {
  switch (action.type) {
    case "ADD_ITEM":
      toast.success("Vous avez ajouter un article à votre panier", {
        position: "bottom-right",
      });
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (_: any, i: number) => i !== action.payload.index
        ),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    default:
      return state;
  }
};

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, cartDispatch] = useReducer(
    cartReducer,
    undefined,
    getInitialCart
  );
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartState));
  }, [cartState]);

  const handleToAddItem = (
    product: ProductWithOptions,
    quantity: number = 1
  ) => {
    const productWithTotalPrice = {
      ...product,
      quantity,
    };
    cartDispatch({
      type: "ADD_ITEM",
      payload: productWithTotalPrice,
    });
  };

  const handleRemoveItem = (index: number) => {
    cartDispatch({
      type: "REMOVE_ITEM",
      payload: { index },
    });
  };
  const handleChangeQuantity = (product: { id: number; quantity: number }) => {
    cartDispatch({
      type: "UPDATE_QUANTITY",
      payload: product,
    });
  };

  const initialValue = {
    items: cartState.items,
    addItemToCart: handleToAddItem,
    removeItemFromCart: handleRemoveItem,
    updateQuantity: handleChangeQuantity,
  };
  return (
    <cartContext.Provider value={initialValue}>{children}</cartContext.Provider>
  );
};
