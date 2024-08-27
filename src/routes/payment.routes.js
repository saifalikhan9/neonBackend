import{verifyJWT} from "../middlewares/auth.middleware.js"
import {Router} from "express"
import { allOrders, apiKey, createOrder,userOrder,verifyPayment } from "../controllers/payment.controller.js"

const router = Router();

router.route("/pay").post(verifyJWT, createOrder)
router.route("/apiKey").get(verifyJWT, apiKey)
router.route("/verify").post( verifyPayment)
// user order
router.route("/userOrder").get(verifyJWT, userOrder);
router.route("/orders").get( allOrders);



export default router