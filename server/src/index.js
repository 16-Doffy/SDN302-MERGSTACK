import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import brandRoutes from './routes/brands.js';
import perfumeRoutes from './routes/perfumes.js';
import memberRoutes from './routes/members.js';

import { notFoundHandler, errorHandler } from './middleware/errors.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'perfume-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/perfumes', perfumeRoutes);
app.use('/api/members', memberRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfume_db';
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


