import { Router } from 'express'
import {
	getUsersMessages,
	getAllMessages,
	sendMessage,
	markMessageAsRead,
	markMessageAsUnread,
	deleteMessage,
} from '../controllers/messagesController.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = Router()

router.get('/inbox', verifyToken, getUsersMessages)
router.get('/all', verifyToken, getAllMessages)
router.post('/send', verifyToken, sendMessage)
router.put('/mark/:id', verifyToken, markMessageAsRead)
router.put('/unread/:id', verifyToken, markMessageAsUnread)
router.delete('/delete/:id', verifyToken, deleteMessage)

export default router
