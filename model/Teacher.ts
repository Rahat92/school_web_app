import mongoose, { Schema } from "mongoose";

interface ITeacher {
    name: string;
    employeeId: string;
    email: string;
    phone: string;
    address: string;
    dob: Date;
    gender: string;
    subject: string;
    photo: string;
    isActive: boolean;
    createdAt: Date;
}


const TeacherSchema: Schema = new Schema({
    name: { type: String, required: true },
    employeeId: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date },
    photo: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    subject: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Teacher = mongoose.models?.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
