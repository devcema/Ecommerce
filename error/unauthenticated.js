const CustomAPIError = require('./customError')
const { StatusCodes } = require('http-status-codes')

class Unauthenticated extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

module.exports = Unauthenticated
