import express from 'express';
import cors from 'cors';
import sequelize from '../config/database.js';
import Task from '../models/Task.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.get('/api/tasks', async (req, res) => {
  try {
    await sequelize.authenticate();
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default async function handler(req, res) {
  app(req, res);
}