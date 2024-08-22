import sequelize from '../config/database.js'
import User from './User.js'
import Book from './Book.js'
import Message from './Message.js'


// User associations
User.hasMany(Book, { as: 'books', foreignKey: 'userId' })
User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId' })
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'recipientId' })

// Book associations
Book.belongsTo(User, { as: 'user', foreignKey: 'userId' })
Book.hasMany(Message, { as: 'messages', foreignKey: 'bookId' })

// Message to message relationship
Message.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' })
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' })
Message.belongsTo(Book, { as: 'book', foreignKey: 'bookId' })



const db = { User, Book, Message, sequelize }

export default db 