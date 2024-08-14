const User = require('../models/UserModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../error')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

const register = async (req, res) => {
  const { name, email, password, role } = req.body

  const emailExists = await User.findOne({ email: email })

  if (emailExists) {
    throw new BadRequestError('Email already exists')
  }

  // const isFirstUser = (await User.countDocuments({})) === 0

  // const role = isFirstUser ? 'admin' : 'user'

  const user = await User.create({ name, email, password, role })

  const tokenUser = createTokenUser(user)

  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthenticatedError('Invalid email or password')
  }

  const isMatch = await user.verifyPassword(password)

  if (!isMatch) {
    throw new UnauthenticatedError('Invalid email or password')
  }

  const tokenUser = createTokenUser(user)

  attachCookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({ tokenUser })
}

const logout = async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'Successfully logged out' })
}

module.exports = { register, login, logout }
