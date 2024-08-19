import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

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
		password: {
			type: DataTypes.STRING(120),
			allowNull: false, 
		},
		location: {
			type: DataTypes.STRING(50),
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
