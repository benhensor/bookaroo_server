import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import sequelize from './config/database.js'
import authRoutes from './authRoutes.js'
import usersRoutes from './usersRoutes.js'
import booksRoutes from './booksRoutes.js'
import messagesRoutes from './messagesRoutes.js'
import './models/index.js'

dotenv.config()

const app = express()

const corsOptions = {
	origin: process.env.FRONTEND_URL || 'https://bookaroo-frontend.vercel.app/',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Test database connection
sequelize
	.authenticate()
	.then(() => console.log('Database connected successfully.'))
	.catch((err) => {
		console.error('Unable to connect to the database:', err)
		console.error('Full error details:', JSON.stringify(err, null, 2))
	})

// Sync all models
sequelize
	.sync({ alter: true })
	.then(() => console.log('Database & tables created!'))
	.catch((err) => console.error('Error syncing database:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/books', booksRoutes)
app.use('/api/messages', messagesRoutes)

app.get('/api/test', (req, res) => {
	res.json({ message: 'Server is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

export default app
