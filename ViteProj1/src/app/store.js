import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(
  persistConfig,
  cartReducer
);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
  }
});

export const persistor = persistStore(store);
