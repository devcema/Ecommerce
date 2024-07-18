const UnauthenticatedError = require('./unauthenticated')
const BadRequestError = require('./badrequest')
const CustomAPIError = require('./customError')
const NotFoundError = require('./notFound')
const UnauthorizedError = require('./unauthorizedError')

module.exports = {
  UnauthenticatedError,
  BadRequestError,
  CustomAPIError,
  NotFoundError,
  UnauthorizedError,
}
