import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      if (!product?._id) return;

      const instock = Number(product.instock ?? 0);
      if (instock <= 0) return;

      // ✅ take image from product.image OR product.images[0]
      const image =
        product.image ||
        (product.images?.length ? product.images[0] : null);

      const existingItem = state.items.find((i) => i._id === product._id);

      if (existingItem) {
        // ✅ keep stock + image updated
        existingItem.instock = instock;
        existingItem.image = image;
        existingItem.images = product.images || existingItem.images || [];

        // ✅ do NOT increase above instock
        if (existingItem.quantity < existingItem.instock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({
          _id: product._id,
          name: product.name || "",
          price: Number(product.price ?? 0),
          category: product.category || "",
          instock,
          quantity: 1,
          image,                 // base64 OR "/uploads/xx.jpg"
          images: product.images || [], // ✅ store array too
        });
      }
    },

    incQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (!item) return;

      if (item.quantity < Number(item.instock ?? 0)) {
        item.quantity += 1;
      }
    },

    decQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (!item) return;

      if (item.quantity === 1) {
        state.items = state.items.filter((i) => i._id !== action.payload);
      } else {
        item.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
  },
});

export const { addToCart, incQty, decQty, clearCart, removeItem } =
  cartSlice.actions;

export default cartSlice.reducer;