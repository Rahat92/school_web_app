import mongoose, {Document, Schema} from 'mongoose'

interface iMood extends Document {
    note: string;
    mood: string;
    createdAt: Date;
}

const MoodSchema: Schema = new Schema({
    note: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now()
    }
})

const Mood = mongoose.models?.Mood || mongoose.model<iMood>('Mood', MoodSchema);
export default Mood;