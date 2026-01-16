import express from "express";
import {getProduct, productSearch} from '../Controllers/RegularUser.js'
import { isAuth } from "../middleware/auth.js";



const routes = express.Router();

routes.get("/getProduct",isAuth ,getProduct);
routes.get('/SearchProduct',isAuth,productSearch);

export default routes;
