import { Router } from 'express'
import { register, login, logout, getCurrentUser } from '../controllers/authController.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', verifyToken, logout)
router.get('/current', verifyToken, getCurrentUser)

export default router