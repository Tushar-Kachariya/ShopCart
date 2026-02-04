import express from "express";
import { isAuth } from "../middleware/auth.js";

import { createUser, login,updateUser,deleteUser,getalluser,logOut } from "../Controllers/User.js";

const routes = express.Router();

routes.post("/create", createUser);
routes.post("/login", login);
routes.post("/logout", logOut);
routes.put("/updateuser/:id", updateUser);
routes.delete('/deleteuser/:id',deleteUser);
routes.get('/getallUser',getalluser);
routes.get("/me", isAuth, (req, res) => {
console.log("Cookies:", req.cookies);

  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  });
});

export default routes;
