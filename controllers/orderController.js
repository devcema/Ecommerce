const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../error')
const { checkPermissions } = require('../utils')

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})

  if (!orders || orders.length < 1) {
    throw new NotFoundError('No orders found')
  }

  res.status(StatusCodes.OK).json({ count: orders.length, orders })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params

  const order = await Order.findOne({ _id: orderId })

  if (!order) {
    throw new NotFoundError('No orders found')
  }

  checkPermissions(req.user, order.user)

  res.status(StatusCodes.OK).json({ order })
}

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body

  if (!orderId || !paymentIntentId) {
    throw new BadRequestError('Please provide all details')
  }

  const order = await Order.findOne({ _id: orderId })

  if (!order) {
    throw new NotFoundError('No orders found')
  }

  checkPermissions(req.user, order.user)

  order.paymentId = paymentIntentId
  order.status = 'paid'

  await order.save()

  res.status(StatusCodes.OK).json({ order })
}

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = 'someRnadomValue'
  return { clientSecret, amount }
}

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError('No items provided')
  }

  if (!tax || !shippingFee) {
    throw new BadRequestError('Please provide tax and shipping fee')
  }

  let orderItems = []
  let subTotal = 0

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })

    if (!dbProduct) {
      throw new NotFoundError(`No product with id: ${item.product}`)
    }

    const { name, price, image, _id } = dbProduct
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    }

    //  Add item to order
    orderItems = [...orderItems, singleOrderItem]

    subTotal += item.amount * price
  }

  const total = tax + shippingFee + subTotal

  //   GET CLIENT SECRET
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  })

  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userId,
  })

  res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret })
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
  if (!orders) {
    throw new NotFoundError('You have no orders at the moment')
  }
  res.status(StatusCodes.OK).json({ count: orders.length, orders })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
  createOrder,
}
