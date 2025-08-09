import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import portfolioRoutes from './routes/portfolio-route.js';
import experienceRoutes from './routes/experience-route.js';
import skillRoutes from './routes/skill-route.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/portfolio', portfolioRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/skills', skillRoutes);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
