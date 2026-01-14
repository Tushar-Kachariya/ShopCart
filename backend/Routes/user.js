import express from "express";


import { createUser, login,updateUser,deleteUser,getalluser,logOut } from "../Controllers/User.js";

const routes = express.Router();

routes.post("/create", createUser);
routes.post("/login", login);
routes.post("/logout", logOut);
routes.put("/updateuser/:id", updateUser);
routes.delete('/deleteuser/:id',deleteUser);
routes.get('/getallUser',getalluser);

export default routes;
