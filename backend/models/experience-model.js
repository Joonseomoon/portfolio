import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        timeframe: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: [String],
        companyURL: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Experience', experienceSchema);
