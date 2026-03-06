import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { store,persistor } from "./app/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from 'react-redux'
import { LoadingProvider } from "./global/LoadingContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadingProvider>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App/>
        </PersistGate>
      </Provider>
    </BrowserRouter>
    </LoadingProvider>
  </React.StrictMode>
);
