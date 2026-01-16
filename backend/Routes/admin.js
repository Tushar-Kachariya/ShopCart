import express from 'express';
import  upload  from '../middleware/Multer.js';


import {productCreate,productGet,productDelete,productUpdate} from '../Controllers/productController.js'
const routes=express.Router();

routes.post('/create',upload.single('image'),productCreate);
routes.get('/get',productGet);

routes.delete('/delete/:id',productDelete);
routes.put('/update/:id',upload.single('image'),productUpdate);

export default routes;