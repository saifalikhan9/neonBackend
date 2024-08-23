import{verifyJWT} from "../middlewares/auth.middleware.js"
import {Router} from "express"
import { apiKey, createOrder } from "../controllers/payment.controller.js"

const router = Router();

router.route("/pay").post(verifyJWT, createOrder)
router.route("/apiKey").get(verifyJWT, apiKey)

export default router