import mongoose,{Schema} from "mongoose";

const OrderItemSchema = new Schema({
 
  productId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export  const OrderItem = mongoose.model('OrderItem', OrderItemSchema);


