import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import blogRoutes from './routes/blogRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { swaggerUi, specs } from './swagger.js';


dotenv.config();
const app = express();
app.use(cors());

//Middleware to parse JSON
app.use(express.json());

//Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
console.log("MONGO_URI:", process.env.MONGO_URI?.replace(/:.+@/, ":<hidden>@"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {res.send("API is running :)")})
app.use('/api/auth', authRoutes);
app.use('/api/', blogRoutes);
app.use('/api/', projectRoutes);
