import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // loads MONGO_URI from your .env

const connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then((conn) => {
            console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        })
        .catch((err) => {
            console.error('❌ MongoDB connection error:', err.message);
            process.exit(1);
        });
};

export default connectDB;
