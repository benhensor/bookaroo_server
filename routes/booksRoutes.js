import { Router } from 'express'
import { listBook, getListedBooks, getRecommendations, deleteListing, getAllBooks, searchBooks } from '../controllers/booksController.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = Router()

router.post('/list', verifyToken, listBook)
router.delete('/delete/:bookId', verifyToken, deleteListing)
router.get('/user', verifyToken, getListedBooks)
router.get('/recommendations', verifyToken, getRecommendations)
router.get('/all', verifyToken, getAllBooks)
router.get('/search', verifyToken, searchBooks)

export default router