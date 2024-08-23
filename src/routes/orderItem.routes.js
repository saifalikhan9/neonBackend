import express from 'express';
import { createOrderItem, getorders } from '../controllers/orderItem.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT)

// Route to create a new order item
router.post('/orderItems/:id', createOrderItem);

// Route to edit an existing order item by ID
// router.put('/order-items/:id', editOrderItem);

// // Route to get all order items for a specific order ID
// router.get('/order-items/:orderId', getOrderItemsByOrderId);

// Route to delete an order item by ID
router.get('/getOrders', getorders);

export default router;
