import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'
import Book from './Book.js'

const Message = sequelize.define(
	'Message',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		senderId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'sender_id',
			references: {
				model: User,
				key: 'id',
			},
		},
		recipientId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'recipient_id',
			references: {
				model: User,
				key: 'id',
			},
		},
		bookId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'book_id',
			references: {
				model: Book,
				key: 'id',
			},
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		isRead: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
			field: 'is_read',
		},
	},
	{
		tableName: 'messages',
		timestamps: true,
	}
)

export default Message