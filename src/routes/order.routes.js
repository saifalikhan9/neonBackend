import {Router} from 'express';
import { createOrder, updateOrder, getOrdersByUser, getOrderById, deleteOrder } from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT)

// Route to create a new order
router.route('/orders').post(createOrder);

// Route to update an existing order by ID
router.route('/orders/:id').put(updateOrder);

// Route to get all orders for a specific user by userId
router.route('/orders/user/:userId').get(getOrdersByUser);

// Route to get a specific order by its ID
router.route('/orders/:id').get(getOrderById);

// Route to delete an order by its ID
router.route('/orders/:id').delete(deleteOrder);

export default router;
