import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import contentRoutes from './routes/contentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { swaggerUi, specs } from './swagger.js';
import { authenticateReadToken, authenticateAdminToken } from './middlewares/authMiddleware.js'


dotenv.config();
const app = express();

const public_URL = process.env.PUBLIC_URI ? JSON.parse(process.env.PUBLIC_URI) : "*";
const admin_URL = process.env.ADMIN_URI ? JSON.parse(process.env.ADMIN_URI) : "*";

console.log("whitelisted read URLs:", public_URL);
console.log("whitelisted admin URLs:", admin_URL);

const publicAccess = cors({
  origin: public_URL,
  methods: ["GET", "PATCH"],
});

const admin = cors({
  origin: admin_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});

//Middleware to parse JSON
app.use(express.json());

app.use(publicAccess);
app.use(admin);

//Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//MONGODB log
console.log("MONGO_URI:", process.env.MONGO_URI?.replace(/:.+@/, ":<hidden>@"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {res.send("API is running :)")})
app.use('/api/auth', authRoutes);
app.use('/api/auth', authenticateAdminToken, adminRoutes);
app.use('/api/', authenticateReadToken, contentRoutes);
