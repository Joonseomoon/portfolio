import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
    title: string;
    iconURL: string;
}

const skillSchema = new Schema<ISkill>({
    title: { type: String, required: true },
    iconURL: { type: String, required: true },
});

export default mongoose.model<ISkill>('Skill', skillSchema);
