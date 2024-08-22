import { Router } from 'express'
import { createNewListing, getListedBooks, getRecommendations, deleteListing, getAllBooks, searchBooks } from '../controllers/booksController.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = Router()

router.post('/newlisting', verifyToken, createNewListing)
router.delete('/delete/:bookId', verifyToken, deleteListing)
router.get('/user', verifyToken, getListedBooks)
router.get('/recommendations', verifyToken, getRecommendations)
router.get('/allbooks', verifyToken, getAllBooks)
router.get('/search', verifyToken, searchBooks)

export default router