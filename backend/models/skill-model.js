import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    iconURL: {
        type: String,
        required: true,
    },
});

export default mongoose.model('Skill', skillSchema);
