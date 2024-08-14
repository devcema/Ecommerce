const router = require('express').Router()
const { authenticateUser, authorizePermission } = require('../middlewares/auth')
const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../controllers/orderController')

router
  .route('/')
  .get(authenticateUser, authorizePermission('admin'), getAllOrders)
  .post(authenticateUser, createOrder)

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, authorizePermission('admin'), updateOrder)

module.exports = router
