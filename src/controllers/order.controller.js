import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createOrder = asyncHandler(async (req, res) => {

  const { text, font , price } = req.body;
  const color = req.body.color
  const textSize = req.body.textSize

  const file = req.files?.imageUrl[0]?.path; // File uploaded via multer
  
  if (!file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  try {
    // Upload the image to Cloudinary
    const result = await uploadOnCloudinary(file);
    
    if (!result) {
      return res.status(500).json({ error: "Image upload to Cloudinary failed" });
    }

    const imageUrl = result.secure_url;

    const newOrder = new Order({ text, font, color, textSize, price, imageUrl, owner: req.user._id });
    await newOrder.save();

    return res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
      return res.status(400).json({ error: "Failed" });
  }

  try {
      const orders = await Order.find({ owner: userId });

      if (!orders) {
        throw new ApiError(404, "no orders")
          
      }

      return res.status(200).json(new ApiResponse(200, orders, "Success"));
  } catch (error) {
      return res.status(500).json(new ApiResponse(500, [], "Server error"));
  }
});

// const deleteOrder = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const orderId = req.params.id;

//   if (!userId) {
//       return res.status(400).json({ error: "User not authenticated" });
//   }

//   try {
//       const order = await Order.findById(orderId);
//       console.log(orderId);
      
//       if (!order) {
//         throw new ApiError(404, "Order not found")
          
//       }

        
//       if (order.user.toString() !== userId.toString()) {
//         throw new ApiError(401,"Not authorized to delete this order")
          
//       }

//        const remove =  await Order.findByIdAndDelete(order._id)
       

//       return res.status(200).json(new ApiResponse(200, [remove], "Order deleted successfully"));
//   } catch (error) {
//     throw new ApiError(500, "Server error" )
      
//   }
// });

const deleteOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orderId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.owner.toString() !== userId.toString()) {
      throw new ApiError(401, "Not authorized to delete this order");
    }

    const removedOrder = await Order.findByIdAndDelete(order._id);

    return res.status(200).json(new ApiResponse(200, [removedOrder], "Order deleted successfully"));
  } catch (error) {
    console.error('Error in deleteOrder:', error);  // Add this line to log the error details

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json(new ApiError(500, "Server error"));
  }
});



export { createOrder,getOrders,deleteOrder };
