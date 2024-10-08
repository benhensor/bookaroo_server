import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'

const Book = sequelize.define(
	'Book',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		isbn: {
			type: DataTypes.STRING(13),
			allowNull: false,
		},
		coverImg: {
			type: DataTypes.STRING(300),
			allowNull: true,
			field: 'cover_img',
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		author: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		publishedDate: {
			type: DataTypes.DATEONLY,
			allowNull: true,
			field: 'published_date',
		},
		publisher: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		category: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		},
		condition: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		notes: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		userId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'user_id',
			references: {
				model: User,
				key: 'id',
			},
		},
		bookLatitude: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			field: 'book_latitude',
		},
		bookLongitude: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			field: 'book_longitude',
		},
	},
	{
		tableName: 'books',
		timestamps: false,
	}
)

export default Book
