import Razorpay from "razorpay";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { OrderItem } from '../models/orderItems.model.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
    const { amount,selectedAddress,userID, cart} = req.body;

    console.log(amount,"amount");
    console.log(cart,"cart");
    console.log(selectedAddress,"address");
    console.log(userID,"userId");
    

  var options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };
    try {
        const razorpayOrder = await razorpay.orders.create(options);
        res.json({ razorpayOrderId: razorpayOrder.id,
            amount: amount,
            cart,
            selectedAddress,
            userID,
            payStatus: "created",});
    } catch (error) {
        res.status(500).json({ message: 'Failed to create Razorpay order', error });
    }
});

const apiKey = asyncHandler((req, res) => {
    const keyid = process.env.RAZORPAY_API_KEY;
    res.json({ keyid });
});

export { createOrder, apiKey };
