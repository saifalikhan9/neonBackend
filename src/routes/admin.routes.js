import { Router } from "express";
import { getAllUsers } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import adminAuth from "../middlewares/admin.auth.middleware.js";


const router = Router();

router.route("/allUsers").get(verifyJWT , adminAuth  ,getAllUsers)

export default router