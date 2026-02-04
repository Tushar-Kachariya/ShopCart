import express from "express";
import {getProduct, productSearch} from '../Controllers/RegularUser.js'
import { isAuth,requireSession } from "../middleware/auth.js";
import { placeOrder } from "../Controllers/RegularUser.js";


const routes = express.Router();
routes.post("/place",isAuth,requireSession, placeOrder);
routes.get("/getProduct",isAuth ,getProduct);
routes.get('/SearchProduct',isAuth,productSearch);

export default routes;
