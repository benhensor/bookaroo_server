import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import booksRoutes from './routes/booksRoutes.js';
import messagesRoutes from './routes/messagesRoutes.js';
import './models/index.js';
import Task from './models/Task.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://bookaroo-frontend.vercel.app/',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    console.error('Full error details:', JSON.stringify(err, null, 2));
  });

// Sync all models
sequelize.sync({ alter: true })  
  .then(() => console.log('Database & tables created!'))
  .catch(err => console.error('Error syncing database:', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/messages', messagesRoutes);


app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// CRUD routes for Tasks
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Log full error details
    console.error(JSON.stringify(error, null, 2));
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.update(req.body);
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;