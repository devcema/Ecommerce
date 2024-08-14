const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      trim: true,
      min: 1,
      max: 5,
      required: [true, 'Please provide product rating'],
    },
    title: {
      type: String,
      required: [true, 'Please provide review title'],
    },

    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },

    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
)

// Only one review per product per user
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ])

  // console.log(result)

  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      },
    )
  } catch (err) {}
}

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('deleteOne', { document: true, query: false }, async function (doc) {
  if (doc) {
    await this.constructor.calculateAverageRating(doc.product)
  }
})

module.exports = mongoose.model('Review', ReviewSchema)
