// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    incrementQty: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity += 1;
    },
    decrementQty: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;

      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    removeItemFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});
export const {
  addItemToCart,
  removeItemFromCart,
  incrementQty,
  decrementQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
