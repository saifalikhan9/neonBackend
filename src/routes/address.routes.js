import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {deleteAddress,getAllAddresses,editAddress,createAddress} from "../controllers/address.controller.js"

const router = Router();
router.use(verifyJWT)
router.route("/addAddress").post(createAddress)
router.route("/editAddress/:id").put(editAddress)
router.route("/getAllAddress").get(getAllAddresses)
router.route("/delete/:id").delete(deleteAddress)

export default router