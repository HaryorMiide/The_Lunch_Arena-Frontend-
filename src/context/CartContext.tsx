// CartContext.tsx
import React, { createContext, useContext, useReducer, useMemo } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "food" | "rental";
}

interface CartState {
  cart: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "INCREASE_QTY"; payload: string }
  | { type: "DECREASE_QTY"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const CartContext = createContext<
  { cart: CartItem[]; dispatch: React.Dispatch<CartAction> } | undefined
>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case "INCREASE_QTY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case "DECREASE_QTY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "LOAD_CART":
      return { ...state, cart: action.payload };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });

  const value = useMemo(() => ({ cart: state.cart, dispatch }), [state.cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return {
    cart: context.cart,
    addToCart: (item: CartItem) =>
      context.dispatch({ type: "ADD_TO_CART", payload: item }),
    removeFromCart: (id: string) =>
      context.dispatch({ type: "REMOVE_FROM_CART", payload: id }),
    increaseQty: (id: string) =>
      context.dispatch({ type: "INCREASE_QTY", payload: id }),
    decreaseQty: (id: string) =>
      context.dispatch({ type: "DECREASE_QTY", payload: id }),
    clearCart: () => context.dispatch({ type: "CLEAR_CART" }),
  };
};

export const useCartDispatch = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCartDispatch must be used within a CartProvider");
  return context.dispatch;
};
