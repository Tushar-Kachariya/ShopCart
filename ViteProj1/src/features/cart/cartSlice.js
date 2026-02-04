import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {

    addToCart: (state, action) => {
      const item = action.payload;

      if (!item._id) { 
        console.error("Product _id not found", item);
        return;
      }

      const existingItem = state.items.find(i => i._id === item._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },

    incQty: (state, action) => {
      const item = state.items.find(i => i._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decQty: (state, action) => {
      const item = state.items.find(i => i._id === action.payload);

      if (!item) return;

      if (item.quantity === 1) {
        state.items = state.items.filter(i => i._id !== action.payload);
      } else {
        item.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
  },
});

export const { addToCart, incQty, decQty, clearCart, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
