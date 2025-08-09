import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageURLs: {
            type: String,
            required: true,
        },
        iconURL: [String],
    },
    { timestamps: true }
);

export default mongoose.model('Portfolio', portfolioSchema);
