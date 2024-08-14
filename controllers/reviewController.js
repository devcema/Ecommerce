const Review = require('../models/ReviewsModel')
const Product = require('../models/ProductModel')
const { StatusCodes } = require('http-status-codes')
const { checkPermissions } = require('../utils')
const { NotFoundError, BadRequestError } = require('../error')

const createReview = async (req, res) => {
  const { product: productId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })

  if (!isValidProduct) {
    throw new NotFoundError(`No product with id: ${productId}`)
  }

  const alreadySubmitted = await Review.findOne({ product: productId, user: req.user.userId })

  if (alreadySubmitted) {
    throw new BadRequestError(`User has already submitted a review on product`)
  }

  req.body.user = req.user.userId

  const review = await Review.create(req.body)

  res.status(StatusCodes.CREATED).json(review)
}

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({ path: 'product', select: 'name company price' })
  if (!reviews) {
    throw new NotFoundError('No reviews found')
  }
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews })
}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params

  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review with Id: ${reviewId} found`)
  }

  res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body

  if (!rating || !title || !comment) {
    throw new BadRequestError('Please provide values for all')
  }

  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review with Id: ${reviewId} found`)
  }

  checkPermissions(req.user, review.user)

  review.rating = rating
  review.title = title
  review.comment = comment

  await review.save()

  res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params

  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review with Id: ${reviewId} found`)
  }

  checkPermissions(req.user, review.user)

  await review.deleteOne()
  res.status(StatusCodes.OK).json({ msg: 'Review successfully removed' })
}

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
}
