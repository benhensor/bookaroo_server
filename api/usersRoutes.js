import { Router } from 'express'
import {
	getUserDetails,
	getUserById,
	searchUsers,
	updateUserDetails,
	likeBook,
	unlikeBook,
	getLikedBooks,
	updatePreferences,
} from './controllers/usersController.js'
import { verifyToken } from './middleware/verifyToken.js'

const router = Router()

router.get('/current', verifyToken, getUserDetails)
router.get('/search', verifyToken, searchUsers)
router.put('/update', verifyToken, updateUserDetails)
router.put('/like', verifyToken, likeBook)
router.put('/unlike', verifyToken, unlikeBook)
router.get('/liked', verifyToken, getLikedBooks)
router.put('/preferences', verifyToken, updatePreferences)
router.get('/:userId', verifyToken, getUserById)

export default router
