import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createCartItems = asyncHandler(async (req, res) => {
  const { text, font, price, totalAmount } = req.body;
  const color = req.body.color;
  const size = req.body.size;

  const file = req.files?.imageUrl[0]?.path; // File uploaded via multer

  if (!file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  try {
    // Upload the image to Cloudinary
    const result = await uploadOnCloudinary(file);

    if (!result) {
      return res
        .status(500)
        .json({ error: "Image upload to Cloudinary failed" });
    }

    const imageUrl = result.secure_url;

    const newCartItems = new Cart({
      text,
      font,
      color,
      size,
      price,
      totalAmount,
      imageUrl,
      userId: req.user._id,
    });
    await newCartItems.save();

    return res.status(201).json(newCartItems);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const getAllItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({ error: "Failed" });
  }

  try {
    const cartItems = await Cart.find({ userId: userId });

    if (!cartItems) {
      throw new ApiError(404, "no Items");
    }

    return res.status(200).json(new ApiResponse(200, cartItems, "Success"));
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
  const cartItemsId = req.params.id;

  if (!cartItemsId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    const cartItem = await Cart.findById(cartItemsId);

    if (!cartItem) {
      throw new ApiError(404, "Item not found");
    }

    if (cartItem.userId.toString() !== userId.toString()) {
      throw new ApiError(401, "Not authorized to delete this item");
    }

    const removedOrder = await Cart.findByIdAndDelete(cartItem);

    return res
      .status(200)
      .json(new ApiResponse(200, [removedOrder], "Item deleted successfully"));
  } catch (error) {
    console.error("Error in deleteOrder:", error); // Add this line to log the error details

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json(new ApiError(500, "Server error"));
  }
});

export { createCartItems, getAllItems, deleteOrder };
