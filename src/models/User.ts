import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId,
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true })

export const User = mongoose.model<IUser>('User', userSchema)
