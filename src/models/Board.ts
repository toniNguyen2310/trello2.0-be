import mongoose, { Schema, Document } from 'mongoose'

export interface IBoard extends Document {
    _id: mongoose.Types.ObjectId,
    title: string;
    color: string;
    ownerId: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    columnOrder: String[];
    createdAt: Date;
    updatedAt: Date;
}

const boardSchema = new Schema<IBoard>({
    title: { type: String, required: true },
    color: { type: String, default: "#ffffff" },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    columnOrder: [{ type: String }]
}, { timestamps: true })

export const Board = mongoose.model<IBoard>('Board', boardSchema)