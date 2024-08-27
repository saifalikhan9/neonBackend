import Razorpay from "razorpay";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Payment } from "../models/payment.model.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const createOrder = asyncHandler(async (req, res) => {
    const { amount,selectedAddress,userID, cart} = req.body;
  var options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };
    try {
        const Order = await razorpay.orders.create(options);
        res.json({ OrderId: Order.id,
            amount: amount,
            orderItems:cart,
            shippingAddress:selectedAddress,
            userID,
            payStatus: "created",});
    } catch (error) {
        throw new ApiError(500, error,"server error cannot create orders")
    }
});

const apiKey = asyncHandler((req, res) => {
    const keyid = process.env.RAZORPAY_API_KEY;
    res.json({ keyid });
});

export const verifyPayment = asyncHandler(  async (req, res) => {
const {
      orderId,
      paymentId,
      signature,
      amount,
      orderItems,
      userID,
      shippingAddress,
    } = req.body;


    
  
    let orderConfirm = await Payment.create({
      orderId,
      paymentId,
      signature,
      amount,
      orderItems,
      userID,
      shippingAddress,
      payStatus: "paid",
    });
  
    res.json( new ApiResponse(200, "payment successfull", orderConfirm )) 
  });

  export const userOrder = async (req,res) =>{
    const userId = req.user._id.toString();
    console.log("user",userId)
    const orders = await Payment.find({ userID: userId }).sort({ orderDate :-1});
    res.json(new ApiResponse(201,orders))
  }
  
  // user specificorder
  export const allOrders = asyncHandler( async (req,res) =>{
   
    let orders = await Payment.find().sort({ orderDate :-1});

    res.json(new ApiResponse(201, orders))
  })

export { createOrder, apiKey };
