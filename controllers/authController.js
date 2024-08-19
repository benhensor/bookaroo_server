import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const register = async (req, res) => {
	const {
		username,
		password,
		location,
	} = req.body
	const hashedPassword = await bcrypt.hash(password, 10)

	try {
		const response = await axios.get(
			`https://api.geocodify.com/v2/geocode?api_key=${process.env.GEOCODIFY_API_KEY}&q=${location}`
		)

		const result = response.data.response.features[0].geometry.coordinates

		await User.create({
			username,
			password: hashedPassword,
			location,
			latitude: result[1],
			longitude: result[0],
		})
		res.status(201).json({ message: 'User registered successfully' })
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

export const login = async (req, res) => {
	const { username, password } = req.body
	try {
		const user = await User.findOne({ where: { username } })
		if (!user) return res.status(404).json({ error: 'User not found' })

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch)
			return res.status(400).json({ error: 'Invalid credentials' })

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: '24h',
		})
		res.json({ token, user })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}