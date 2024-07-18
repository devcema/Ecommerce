const { UnauthorizedError } = require('../error')

const checkPermissions = (requestUser, resourceUser) => {
  //   console.log(requestUser)
  //   console.log(resourceUser)
  //   console.log(typeof resourceUser)

  if (requestUser.role === 'admin') return

  if (requestUser.userId === resourceUser.toString()) return

  throw new UnauthorizedError('Not authorized to perform this action')
}

module.exports = checkPermissions
