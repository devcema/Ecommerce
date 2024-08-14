const router = require('express').Router()
const { authenticateUser, authorizePermission } = require('../middlewares/auth')

const {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  createProduct,
} = require('../controllers/productController')

const { getSingleProductReviews } = require('../controllers/reviewController')

router
  .route('/')
  .post(authenticateUser, authorizePermission('admin'), createProduct)
  .get(getAllProducts)

router.route('/uploadImage').post([authenticateUser, authorizePermission('admin')], uploadImage)

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermission('admin'), updateProduct)
  .delete(authenticateUser, authorizePermission('admin'), deleteProduct)

router.route('/:id/reviews').get(getSingleProductReviews)
module.exports = router
