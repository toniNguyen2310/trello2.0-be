import mongoose, { Schema, Document } from 'mongoose'

export interface IChecklistItem {
    id: string;
    text: string;
    checked: boolean;
}
export interface ICard extends Document {
    id: string,
    columnId: string;
    title: string;
    description: string;
    checklist: IChecklistItem[]
    status: boolean
    createdAt: Date;
    updatedAt: Date;
}

const checklistItemSchema = new Schema<IChecklistItem>({
    id: { type: String, required: true },
    text: { type: String, required: true },
    checked: { type: Boolean, default: false }
}, { _id: false });

const CardSchema: Schema<ICard> = new Schema({
    id: { type: String, required: true },
    columnId: { type: String, required: true },
    title: { type: String, required: true },
    status: { type: Boolean, default: false },
    description: { type: String, default: '' },
    checklist: [checklistItemSchema]
}, { timestamps: true })

export const Card = mongoose.model<ICard>('Card', CardSchema);
