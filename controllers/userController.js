const User = require('../models/UserModel')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../error')
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils')

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  if (!users) {
    throw new NotFoundError('Sorry, no users found')
  }

  res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password')
  if (!user) {
    throw new NotFoundError('Sorry, no users found')
  }

  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user })
}

const updateUser = async (req, res) => {
  const { name, email } = req.body

  if (!name || !email) {
    throw new BadRequestError('Please provided values for name and email')
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true },
  )

  const tokenUser = createTokenUser(user)

  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({ msg: 'User successfully updated', tokenUser })
}

const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new BadRequestError('Please provide values for both passwords')
  }

  const user = await User.findOne({ _id: req.user.userId })

  const passwordMatch = await user.verifyPassword(currentPassword)

  if (!passwordMatch) {
    throw new BadRequestError('Passwords do not match')
  }

  user.password = newPassword

  await user.save()

  res.status(StatusCodes.OK).json({ msg: 'Password updated successfully' })
}

module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword }

// findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { name, email } = req.body

//   if (!name || !email) {
//     throw new BadRequestError('Please provided values for name and email')
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true },
//   )

//   const tokenUser = createTokenUser(user)

//   attachCookiesToResponse({ res, user: tokenUser })
//   res.status(StatusCodes.OK).json({ msg: 'User successfully updated', tokenUser })
// }
