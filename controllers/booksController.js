import sequelize from '../config/database.js'
import User from '../models/User.js'
import Book from '../models/Book.js'
import { Op } from 'sequelize'

export const createNewListing = async (req, res) => {
	const {
		isbn,
		coverImg,
		title,
		author,
		publishedDate,
		publisher,
		category,
		condition,
		notes,
		userId,
	} = req.body
	try {
		const user = await User.findByPk(userId)
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		const newBook = await Book.create({
			isbn,
			coverImg,
			title,
			author,
			publishedDate,
			publisher,
			category,
			condition,
			notes,
			userId,
			bookLatitude: user.latitude,
			bookLongitude: user.longitude,
		})
		res.status(201).json(newBook)
	} catch (error) {
		console.error('Full Sequelize Error:', error.errors)
		res.status(400).json({ error: error.message })
	}
}

export const deleteListing = async (req, res) => {
	const { bookId } = req.params
	try {
		const book = await Book.findByPk(bookId)
		if (!book) {
			return res.status(404).json({ error: 'Book not found' })
		}
		await book.destroy()
		res.status(204).end()
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export const getListedBooks = async (req, res) => {
	try {
		const books = await Book.findAll({
			where: { userId: req.user.id },
			include: {
				model: User,
				as: 'user',
				attributes: [
					'id',
					'email',
					'username',
					'postcode',
					'latitude',
					'longitude',
				],
			},
			raw: true,
			nest: true,
		})
		res.json(books)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export const getRecommendations = async (req, res) => {
	const { userId, preferences } = req.query

	if (!preferences || !Array.isArray(preferences)) {
		return res.status(400).json({ error: 'Invalid preferences format' })
	}

	try {
		const books = await Book.findAll({
			where: {
				userId: { [Op.ne]: userId }, // Exclude books listed by the current user
				category: {
					[Op.overlap]: sequelize.literal(
						`ARRAY[${preferences
							.map((pref) => `'${pref}'`)
							.join(',')}]::VARCHAR[]`
					),
				},
			},
			raw: true,
			nest: true,
		})
		res.json(books)
	} catch (error) {
		console.error('Error fetching recommendations:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const getAllBooks = async (req, res) => {
	try {
		const books = await Book.findAll()

		res.status(200).json(books)
	} catch (error) {
		console.error('Error fetching all books:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const searchBooks = async (req, res) => {
	const { query } = req.query
	const userId = req.user.id

	if (!query) {
		return res.status(400).json({ error: 'Query parameter is required' })
	}

	try {
		const books = await Book.findAll({
			where: {
				[Op.and]: [
					{
						[Op.or]: [
							{ title: { [Op.iLike]: `%${query}%` } }, // Search by title
							{ author: { [Op.iLike]: `%${query}%` } }, // Search by author
							sequelize.where(
								sequelize.fn(
									'array_to_string',
									sequelize.col('category'),
									','
								),
								{
									[Op.iLike]: `%${query}%`,
								}
							), // Search by category
						],
					},
					{ userId: { [Op.ne]: userId } }, // Exclude books listed by the current user
				],
			},
		})

		res.json(books)
	} catch (error) {
		console.error('Error searching books:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}
