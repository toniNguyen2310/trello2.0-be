import mongoose, { Schema, Document } from 'mongoose'

export interface ICheck extends Document {
    id: string,
    cardId: string;
    text: string;
    checked: boolean,
    createdAt: Date;
    updatedAt: Date;
}

const ChecklistSchema: Schema<ICheck> = new Schema({
    id: { type: String, required: true },
    cardId: { type: String, required: true },
    text: { type: String, required: true },
    checked: { type: Boolean, default: false },
}, { timestamps: true })

export const Card = mongoose.model<ICheck>('Card', ChecklistSchema);
