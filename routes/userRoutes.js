const router = require('express').Router()
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} = require('../controllers/userController')
const { authenticateUser, authorizePermission } = require('../middlewares/auth')

router.route('/').get(authenticateUser, authorizePermission('admin', 'owner'), getAllUsers)
router.route('/showme').get(authenticateUser, showCurrentUser)
router.route('/updateuser').patch(authenticateUser, updateUser)
router.route('/updateuserpassword').patch(authenticateUser, updateUserPassword)
router.route('/:id').get(authenticateUser, getSingleUser)

module.exports = router
