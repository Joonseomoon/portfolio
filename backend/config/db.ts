import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = (): void => {
    mongoose
        .connect(process.env.MONGO_URI as string)
        .then((conn) => {
            console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        })
        .catch((err: Error) => {
            console.error('❌ MongoDB connection error:', err.message);
            process.exit(1);
        });
};

export default connectDB;
