import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import blogRoutes from './routes/blogRoutes.js';
import path from 'path';
import { swaggerUi, specs } from './swagger.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger doc route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

console.log("🔍 MONGO_URI:", process.env.MONGO_URI?.replace(/:.+@/, ":<hidden>@"));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/content', express.static(path.join(process.cwd(), 'content')));

//Blog routes
app.use('/api/', blogRoutes);