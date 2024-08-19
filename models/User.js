import { DataTypes } from 'sequelize'
import sequelize from '../config/database.mjs'

const User = sequelize.define('User', {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(120),
			allowNull: false, 
		},
		phone: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		addressLine1: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'address_line1',
		},
		addressLine2: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'address_line2',
		},
		city: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		postcode: {
			type: DataTypes.STRING(20),
			allowNull: true,
		},
		latitude: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		longitude: {
			type: DataTypes.FLOAT,
			allowNull: true,
		},
		preferences: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		},
		likedBooks: {
			type: DataTypes.ARRAY(DataTypes.BIGINT),
			allowNull: true,
			field: 'liked_books',
			defaultValue: [],
		},
	},
	{
		tableName: 'users',
		timestamps: false, // Disable timestamps
	}
)

export default User
