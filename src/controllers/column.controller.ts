import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Column } from '../models/Column'
import { Board } from '../models/Board'
import { Card } from '../models/Card'


export const getSingleColumnByIdLS = async (req: Request, res: Response) => {
    try {
        const { columnId } = req.params
        const column = await Column.findOne({ id: columnId }).lean()

        if (!column) {
            return res.status(404).json({ message: 'Không tìm thấy column' })
        }

        return res.status(200).json({ column })
    } catch (error) {
        console.error('Lỗi lấy dữ liệu board:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}


export const createColumn = async (req: Request, res: Response) => {
    try {
        const { title, boardId, userId, idLS } = req.body

        if (!title || !boardId || !userId) {
            return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' })
        }

        if (!mongoose.Types.ObjectId.isValid(boardId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' })
        }

        // Kiểm tra board tồn tại và user có quyền (là thành viên)
        const board = await Board.findById(boardId)
        if (!board) {
            return res.status(404).json({ message: 'Board không tồn tại' })
        }

        // Tạo column mới
        const newColumn = await Column.create({
            id: idLS,
            boardId,
            title,
            cardOrder: []
        })

        // Cập nhật columnOrder trong board
        board.columnOrder.push(newColumn.id)
        await board.save()

        res.status(201).json({ column: newColumn })
    } catch (error) {
        console.error('Lỗi tạo column:', error)
        res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const deleteColumnById = async (req: Request, res: Response) => {
    try {
        const { columnId } = req.params

        if (typeof columnId !== 'string') {
            return res.status(400).json({ message: 'columnId không hợp lệ' })
        }

        const column = await Column.findOne({ id: columnId })
        if (!column) {
            return res.status(404).json({ message: 'Không tìm thấy column' })
        }

        const boardId = column.boardId

        // Xóa tất cả cards thuộc column này
        await Card.deleteMany({ columnId })

        // Xóa column
        await Column.deleteOne({ id: columnId })

        // Cập nhật columnOrder của board
        await Board.findOneAndUpdate({ _id: boardId }, {
            $pull: { columnOrder: column.id }
        }, { new: true })

        return res.status(200).json({ message: 'Đã xoá column và các card liên quan' })
    } catch (error) {
        console.error('Lỗi xoá column:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const updateColumnTitle = async (req: Request, res: Response) => {
    try {
        const { columnId } = req.params
        const { title } = req.body

        if (typeof columnId !== 'string') {
            return res.status(400).json({ message: 'columnId không hợp lệ' })
        }

        if (!title || typeof title !== 'string') {
            return res.status(400).json({ message: 'Tiêu đề không hợp lệ' })
        }

        const updatedColumn = await Column.findOneAndUpdate(
            { id: columnId },
            { title },
            { new: true }
        )

        if (!updatedColumn) {
            return res.status(404).json({ message: 'Không tìm thấy column' })
        }

        return res.status(200).json({ message: "Update title success" })
    } catch (error) {
        console.error('Lỗi đổi tên column:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const updateColumnOrder = async (req: Request, res: Response) => {
    try {
        const { boardId } = req.params
        const { columnOrder } = req.body

        if (!mongoose.Types.ObjectId.isValid(boardId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' })
        }
        if (!Array.isArray(columnOrder) || columnOrder.length === 0) {
            return res.status(400).json({ message: 'columnOrder không hợp lệ' });
        }

        const board = await Board.findById(boardId)
        if (!board) return res.status(404).json({ message: 'Không tìm thấy board' })

        board.columnOrder = columnOrder;
        let boardNew = await board.save();

        return res.status(200).json({ message: 'Cập nhật thứ tự thành công', columnOrder });
    } catch (error) {
        console.error('Lỗi cập nhật columnOrder:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

// Interface mô tả dữ liệu request từ FE gửi lên
interface UpdateCardOrderBody {
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    sourceCardOrder: string[];
    targetCardOrder: string[];
}

export const updateCardOrderGeneral = async (
    req: Request<{}, {}, UpdateCardOrderBody>,
    res: Response
) => {
    try {
        const {
            cardId,
            sourceColumnId,
            targetColumnId,
            sourceCardOrder,
            targetCardOrder
        } = req.body

        const [sourceColumn, card] = await Promise.all([
            Column.findOne({ id: sourceColumnId }),
            Card.findOne({ id: cardId })
        ]);
        if (!sourceColumn || !card) {
            return res.status(404).json({ message: 'Không tìm thấy dữ liệu nguồn' });
        }

        // Cập nhật cardOrder cho source column
        await Column.findOneAndUpdate(
            { id: sourceColumnId },
            { cardOrder: sourceCardOrder }
        );


        if (sourceColumnId !== targetColumnId) {
            const targetColumn = await Column.findOne({ id: targetColumnId });
            if (!targetColumn) {
                return res.status(404).json({ message: 'Không tìm thấy column đích' });
            }

            await Column.findOneAndUpdate(
                { id: targetColumnId },
                { cardOrder: targetCardOrder }
            );

            await Card.findOneAndUpdate(
                { id: cardId },
                { columnId: targetColumnId }
            );
        }

        return res.status(200).json({ message: 'Di chuyển thẻ thành công' });
    } catch (error) {
        console.error('Lỗi cập nhật cardOrder:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

