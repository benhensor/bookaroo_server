import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import axios from 'axios'
import dotenv from 'dotenv'
import * as yup from 'yup'

dotenv.config()

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,20}$/

const registrationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Required'),
	username: yup
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(20, 'Username cannot exceed 20 characters')
		.required('Required'),
	postcode: yup
		.string()
		.matches(
			/^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/,
			'Invalid postcode'
		)
		.required('Required'),
	password: yup
		.string()
		.min(6, 'Password must be at least 6 characters')
		.matches(passwordRules, {
			message: 'Please create a stronger password',
		})
		.required('Required'),
})


export const register = async (req, res) => {
  console.log('register called', req.body)
	const {
		email,
		username,
		postcode,
		password,
	} = req.body
	
	try {
		
		await registrationSchema.validate({
			email,
			username,
			postcode,
			password,
		})
		const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10
		const hashedPassword = await bcrypt.hash(password, saltRounds)

		const response = await axios.get(
			`https://api.geocodify.com/v2/geocode?api_key=${process.env.GEOCODIFY_API_KEY}&q=${postcode}`
		)

		const result = response.data.response.features[0].geometry.coordinates

		await User.create({
			email,
			username,
			postcode,
			password: hashedPassword,
			latitude: result[1],
			longitude: result[0],
			preferences: [],
			liked_books: [],
		})
		res.status(201).json({ message: 'User registered successfully' })
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return res.status(400).json({ error: error.message })
		} else {
			return res.status(500).json({ error: error.message })
		}
	}
}


const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required'),
});

export const login = async (req, res) => {

	console.log('login called', req.body)
	const { email, password } = req.body

	try {

		await loginSchema.validate({
			email,
			password,
		})

		const user = await User.findOne({ where: { email } })
		if (!user) return res.status(404).json({ error: 'User not found' })

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch)
			return res.status(400).json({ error: 'Invalid credentials' })

		const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

		res.cookie('authToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000,
		})

		console.log('user:', user)
		console.log('token:', token)
		res.json({ user })

	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return res.status(400).json({ error: error.message })
		} else {
			return res.status(500).json({ error: error.message })
		}
	}
}