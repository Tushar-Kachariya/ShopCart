import express from "express";
import {getProduct} from '../Controllers/RegularUser.js'


const routes = express.Router();

routes.get("/getProduct", getProduct);

export default routes;
