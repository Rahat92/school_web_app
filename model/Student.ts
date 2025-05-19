import mongoose, { Document, Schema } from "mongoose";

interface IStudent extends Document {
    name: string;
    rollNumber: string;
    email: string;
    phone: string;
    address: string;
    dob: Date;
    gender: string;
    age: number;
    class: string;
    photo: string
    isActive: boolean;
    createdAt: Date;
}

const StudentSchema: Schema = new Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    age: { type: Number, required: true },
    class: { type: String, required: true },
    photo: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.models?.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
