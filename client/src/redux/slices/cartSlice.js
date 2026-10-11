import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array of novel items added to cart
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item._id === newItem._id);

      if (!existingItem) {
        state.items.push({ ...newItem, quantity: 1 });
      }

      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item._id !== id);
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
