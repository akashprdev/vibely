import './types/express';
import express from 'express';
import routes from '@/routes';
import db from './database/database';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// connect database
const connectDatabase = async () => {
  try {
    await db.execute(`SELECT 1`); // Simple query to test connection
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', routes);

app.use(errorHandler);

export default app;
