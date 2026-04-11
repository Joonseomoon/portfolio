import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
    title: string;
    companyName: string;
    startDate: Date;
    timeframe: string;
    location: string;
    description: string[];
    companyURL: string;
}

const experienceSchema = new Schema<IExperience>(
    {
        title: { type: String, required: true },
        companyName: { type: String, required: true },
        startDate: { type: Date, required: true },
        timeframe: { type: String, required: true },
        location: { type: String, required: true },
        description: [String],
        companyURL: { type: String, required: false },
    },
    { timestamps: true }
);

export default mongoose.model<IExperience>('Experience', experienceSchema);
