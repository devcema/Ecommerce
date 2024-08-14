const router = require('express').Router()
const { authenticateUser, authorizePermission } = require('../middlewares/auth')

const {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
} = require('../controllers/reviewController')

router.route('/').get(getAllReviews).post(authenticateUser, createReview)
router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview)

module.exports = router
