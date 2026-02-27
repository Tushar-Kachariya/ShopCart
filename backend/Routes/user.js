import express from "express";
import { getUserProfile } from "../Controllers/User.js";
import { toggleBlockUser } from "../Controllers/User.js";
import { isAuth, isAdmin } from "../middleware/auth.js";

import { createUser, login,updateUser,deleteUser,getalluser,logOut,getuseroreder } from "../Controllers/User.js";

const routes = express.Router();

routes.post("/create", createUser);
routes.post("/login", login);
routes.get('/getuserorder',isAuth,getuseroreder)
routes.post("/logout", logOut);

routes.put("/updateuser/:id", updateUser);
routes.delete("/deleteuser/:id", deleteUser);

routes.put("/block/:id", isAuth, isAdmin, toggleBlockUser);

routes.get("/profile", isAuth, getUserProfile);
routes.get("/getallUser", isAuth, isAdmin, getalluser);

routes.get("/me", isAuth, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    address: req.user.address

  });
});


export default routes;
