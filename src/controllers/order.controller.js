import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { Order } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import { Address } from '../models/address.model.js';
import { User } from '../models/user.model.js';

// Create a new order
const createOrder =  asyncHandler(async (req, res) => {
  
  
  try {
    const { product, totalAmount, shippingAddress, orderItems } = req.body;
    const userId = req.user._id

   // Validate user, product, and address existence
    const user = await User.findById(userId);
    const cartItem = await Cart.findById(product);
    const address = await Address.findById(shippingAddress);

    if (!user || !cartItem || !address) {
      throw new ApiError(404, "User, Product, or Address not found");
      

    }

    // Create the order
    const newOrder = new Order({
      userId,
      orderItems,
      product,
      totalAmount,
      shippingAddress,
    });

    await newOrder.save();

     res.json(new ApiResponse(201, [newOrder],  "order saved"));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
});

// Update an existing order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    // Update the order's status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus,
        paymentStatus,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message,
    });
  }
};

// Get all orders for a user
const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).populate('product').populate('shippingAddress');

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('product').populate('shippingAddress');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message,
    });
  }
};

export { createOrder, updateOrder, getOrdersByUser, getOrderById, deleteOrder };
