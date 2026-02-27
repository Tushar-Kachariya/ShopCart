import express from "express";
import { getProduct, productSearch, placeOrder,getOneProduct } from "../Controllers/RegularUser.js";
import { isAuth,  } from "../middleware/auth.js";

const routes = express.Router();

routes.get("/getProduct", getProduct);
routes.get("/SearchProduct", productSearch);
routes.get("/getproduct/:id", getOneProduct);
routes.post("/place", isAuth, placeOrder);

export default routes;
