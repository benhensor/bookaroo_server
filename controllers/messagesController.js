import Message from '../models/Message.js'
import User from '../models/User.js'
import Book from '../models/Book.js'

export const getUsersMessages = async (req, res) => {
	try {
		const userId = req.user.id

		const messages = await Message.findAll({
			where: {
				recipientId: userId,
			},
			include: [
				{
					model: User,
					as: 'sender',
					attributes: ['username', 'email'],
				},
				{
					model: User,
					as: 'recipient',
					attributes: ['username', 'email'],
				},
				{
					model: Book,
					as: 'book',
					attributes: [
						'id',
						'isbn',
						'coverImg',
						'title', 
						'author',
						'publisher',
						'publishedDate',
						'category',
						'condition',
						'notes',
					],
				},
			],
			order: [['createdAt', 'DESC']], // Sort messages by creation date, newest first
		})

		res.status(200).json(messages)
	} catch (error) {
		console.error('Error fetching all messages:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const getAllMessages = async (req, res) => {
	try {
		const messages = await Message.findAll({
			include: [
				{
					model: User,
					as: 'sender',
					attributes: ['username', 'email'],
				},
				{
					model: User,
					as: 'recipient',
					attributes: ['username', 'email'],
				},
				{
					model: Book,
					as: 'book',
					attributes: [
						'id',
						'isbn',
						'coverImg',
						'title',
						'author',
						'publisher',
						'publishedDate',
						'category',
						'condition',
						'notes',
					],
				},
			],
			order: [['createdAt', 'DESC']], // Sort messages by creation date, newest first
		})

		res.status(200).json(messages)
	} catch (error) {
		console.error('Error fetching all messages:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const sendMessage = async (req, res) => {
	try {
		const { senderId, recipientId, bookId, message } = req.body

		// Validate sender, recipient, and book exist
		const sender = await User.findByPk(senderId)
		const recipient = await User.findByPk(recipientId)
		const book = await Book.findByPk(bookId)


		if (!sender || !recipient || !book) {
			return res
				.status(400)
				.json({ error: 'Invalid sender, recipient, or book' })
		}

		const newMessage = await Message.create({
			senderId,
			recipientId,
			bookId,
			message,
			isRead: false,
		})
		console.log('New message:', newMessage)
		res.status(201).json(newMessage)
	} catch (error) {
		console.error('Error sending message:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const markMessageAsRead = async (req, res) => {
	try {
		const { id } = req.params
		const message = await Message.findByPk(id)

		if (!message) {
			return res.status(404).json({ error: 'Message not found' })
		}

		if (message.recipientId !== req.user.id) {
			return res
				.status(403)
				.json({ error: 'Not authorized to mark this message as read' })
		}

		message.isRead = true
		await message.save()

		res.status(200).json(message)
	} catch (error) {
		console.error('Error marking message as read:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const markMessageAsUnread = async (req, res) => {
	try {
		const { id } = req.params
		const message = await Message.findByPk(id)

		if (!message) {
			return res.status(404).json({ error: 'Message not found' })
		}

		if (message.recipientId !== req.user.id) {
			return res
				.status(403)
				.json({ error: 'Not authorized to mark this message as unread' })
		}

		message.isRead = false
		await message.save()

		res.status(200).json(message)
	} catch (error) {
		console.error('Error marking message as unread:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}

export const deleteMessage = async (req, res) => {
	try {
		const { id } = req.params
		const message = await Message.findByPk(id)

		if (!message) {
			return res.status(404).json({ error: 'Message not found' })
		}

		if (
			message.senderId !== req.user.id &&
			message.recipientId !== req.user.id
		) {
			return res
				.status(403)
				.json({ error: 'Not authorized to delete this message' })
		}

		await message.destroy()

		res.status(200).json({ message: 'Message deleted successfully' })
	} catch (error) {
		console.error('Error deleting message:', error)
		res.status(500).json({ error: 'Internal server error' })
	}
}
