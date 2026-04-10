import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolio extends Document {
    title: string;
    description: string;
    imageURLs: string;
    iconURL: string[];
}

const portfolioSchema = new Schema<IPortfolio>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageURLs: { type: String, required: true },
        iconURL: [String],
    },
    { timestamps: true }
);

export default mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
