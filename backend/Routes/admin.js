import express from 'express';
import  upload  from '../middleware/Multer.js';
import { getAdminOrder } from '../Controllers/adminshoworder.js';
import { isAuth,isAdmin } from '../middleware/auth.js';

import {productCreate,productGet,productDelete,productUpdate,updateOrderStatus,deleteUser,productGetOne} from '../Controllers/productController.js'
const routes=express.Router()

routes.post("/create", isAuth, isAdmin, upload.array("images", 6), productCreate);
routes.get('/get', productGet);
routes.get('/get/:id', productGetOne); 
routes.delete('/deleteUser/:id', isAuth, isAdmin, deleteUser);
routes.get("/getAdminOrder", isAuth, isAdmin, getAdminOrder);
routes.delete('/delete/:id', isAuth, isAdmin ,productDelete);
routes.put('/update/:id', upload.single('image'),productUpdate);
routes.put('/updateOrderStatus/:id',isAuth,isAdmin ,updateOrderStatus);


export default routes;