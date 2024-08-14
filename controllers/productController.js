const Product = require('../models/ProductModel')
const path = require('path')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../error')

const createProduct = async (req, res, next) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json(product)
}

const getAllProducts = async (req, res, next) => {
  const products = await Product.find({})
  if (!products) {
    throw new NotFoundError(`No products found`)
  }
  res.status(StatusCodes.OK).json({ count: products.length, products })
}

const getSingleProduct = async (req, res, next) => {
  const { id: productId } = req.params
  const product = await Product.find({ _id: productId }).populate('reviews')

  if (!product) {
    throw new NotFoundError(`No products found for ${productId}`)
  }
  res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res, next) => {
  const { id: productId } = req.params
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    throw new NotFoundError(`No products found for ${productId}`)
  }

  res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res, next) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId })

  if (!product) {
    throw new NotFoundError(`No products found for ${productId}`)
  }

  await product.deleteOne()
  res.status(StatusCodes.OK).json({ msg: 'Product successfully removed' })
}

const uploadImage = async (req, res, next) => {
  if (!req.files.image) {
    throw new BadRequestError('no File uploaded')
  }

  const productImage = req.files.image
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Please upload image')
  }

  const maxSize = 1024 * 1024

  if (productImage.size > maxSize) {
    throw new BadRequestError('Please upload image of size less that 1mb')
  }

  const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
  console.log(imagePath)
  await productImage.mv(imagePath)
  res.status(StatusCodes.CREATED).json({ image: `/uploads/${productImage.name}` })
}

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  getSingleProduct,
  deleteProduct,
  uploadImage,
}
