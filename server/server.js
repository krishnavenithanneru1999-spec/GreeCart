import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';

import userRouter from './routes/userRoute.js';
import SellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect DB and Cloudinary
await connectDB();
await connectCloudinary();

//  Allow multiple origins
const allowedOrigins = ['http://localhost:5173']

app.post('/stripe',express.raw({type: 'application/json'}),stripeWebhooks)


// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  res.send('API is Working');
});

// Test Cloudinary
app.get('/test-cloudinary', async (req, res) => {
  try {
    const { v2: cloudinary } = await import('cloudinary');
    const result = await cloudinary.api.ping();
    res.json(result);
  } catch (error) {
    console.log('Cloudinary test error:', error);
    res.json({
      success: false,
      message: error.message,
      http_code: error.http_code,
      name: error.name,
    });
  }
});

// API routes
app.use('/api/user', userRouter);
app.use('/api/seller', SellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

export default app;