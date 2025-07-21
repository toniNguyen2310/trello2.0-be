import mongoose, { Schema, Document } from 'mongoose'
export interface IColumn extends Document {
    id: string,
    title: string;
    boardId: mongoose.Types.ObjectId;
    cardOrder: string[];
    createdAt: Date;
    updatedAt: Date;
}

const columnSchema = new Schema<IColumn>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    boardId: { type: Schema.Types.ObjectId, ref: 'Board' },
    cardOrder: [{ type: String }]
}, { timestamps: true })

export const Column = mongoose.model<IColumn>('Column', columnSchema);