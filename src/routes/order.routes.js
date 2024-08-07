import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    getOrders,
    deleteOrder
} from '../controllers/order.controller.js'
import {upload} from '../middlewares/multer.js'


const router = Router();

router.route("/order").post( verifyJWT, upload.fields([{
    name : "imageUrl",
    maxCount: 1
}])  ,createOrder)


router.route("/getOrders").get(verifyJWT,getOrders)
router.route('/delete/:id')
    .delete(verifyJWT,deleteOrder);

export default router;