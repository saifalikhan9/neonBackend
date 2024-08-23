import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createCartItems,
    getAllItems,
    deleteOrder
} from '../controllers/cart.controller.js'
import {upload} from '../middlewares/multer.js'


const router = Router();

router.route("/addToCart").post( verifyJWT, upload.fields([{
    name : "imageUrl",
    maxCount: 1
}])  ,createCartItems)


router.route("/items").get(verifyJWT,getAllItems)
router.route('/delete/:id')
    .delete(verifyJWT,deleteOrder);

export default router;