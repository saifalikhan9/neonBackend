import { OrderItem } from '../models/orderItems.model.js';
import { Cart } from "../models/cart.model.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";

export const createOrderItem = asyncHandler(async (req, res) => {
  try {
    const ids = req.params.id.split(","); // Split product IDs into an array
    console.log("Product IDs:", ids); // Debug log

    if (!ids || ids.length === 0) {
      throw new ApiError(400, false, 'No product IDs provided');
    }

    // Check if all IDs exist in the cart
    const count = await Cart.countDocuments({ _id: { $in: ids } });

    if (count !== ids.length) {
      throw new ApiError(404, false, 'Some products not found in the cart');
    }

    // Total price is sent from the frontend
    const totalPrice = req.body.totalAmount;
    if (!totalPrice || isNaN(totalPrice)) {
      throw new ApiError(400, false, 'Invalid total price provided');
    }



    // Check if the same order already exists
    const existingOrderItem = await OrderItem.findOne({
      productId: { $all: ids, $size: ids.length }, // Match exactly these product IDs
      totalPrice: totalPrice,
    });

    if (existingOrderItem) {
      return res.json(new ApiResponse(200, existingOrderItem, "Order item already exists"));
    }

    // Create a single OrderItem with the total price and product IDs
    const newOrderItem = new OrderItem({
      productId: ids, // Store product IDs
      totalPrice: totalPrice,
    });

    console.log("New OrderItem:", newOrderItem); // Debug log

    await newOrderItem.save();

    // Return success response
    res.json(new ApiResponse(201, totalPrice, "Order item created successfully"));

  } catch (error) {
    console.error("Error creating order item:", error); // Debug log
    throw new ApiError(500, false, "Server error", error);
  }
});





export const getorders = asyncHandler(async (req,res)=>{
  const orders = await OrderItem.find({})
  if (!orders) {
    throw new ApiError(401,"there is no order")
  }



  res.json(new ApiResponse(200,orders,"success"))

})
