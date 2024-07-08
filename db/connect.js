const mongoose = require('mongoose')

const connectDb = async (uri) => {
  return mongoose.connect(uri)
}

module.exports = connectDb
