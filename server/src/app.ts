import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import reservationRoutes from './routes/reservations.js';
import discountRoutes from './routes/discounts.js';
import blogRoutes from './routes/blog.js';
import fortuneRoutes from './routes/fortune.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Weidaojia API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/discount', discountRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/fortune', fortuneRoutes);

// Admin routes (protected)
app.use('/api/admin/reservations', reservationRoutes);
app.use('/api/admin/menu', menuRoutes);
app.use('/api/admin/discounts', discountRoutes);
app.use('/api/admin/blog', blogRoutes);

export default app;
