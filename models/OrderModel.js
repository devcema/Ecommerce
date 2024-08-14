const mongoose = require('mongoose')

const singleOrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
    },
    shippingFee: {
      type: Number,
    },
    subTotal: {
      type: Number,
    },
    total: {
      type: Number,
    },
    orderItems: {
      type: [singleOrderItemSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', 'cancelled'],
      default: 'pending',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientSecret: {
      type: String,
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Order', OrderSchema)
