const { UnauthorizedError } = require('../error')

const checkPermissions = (requestUser, resourceUser) => {
  if (requestUser.role === 'admin') return

  if (requestUser.userId === resourceUser.toString()) return

  throw new UnauthorizedError(`You don't have permissions to access this resource`)
}

module.exports = checkPermissions
