const { BadRequestError } = require('../error')

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('TestUser has read only access')
  }

  next()
}

module.exports = testUser
