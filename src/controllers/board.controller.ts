import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Board } from '../models/Board'
import { Column } from '../models/Column'
import { Card } from '../models/Card'

//BOARDS
export const getBoardsByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'userId không hợp lệ' })
        }

        // Tìm tất cả board mà user là thành viên (members chứa userId)
        const boards = await Board.find({ members: userId }).sort({ updatedAt: -1 })

        return res.status(200).json({ boards })
    } catch (error) {
        console.error('Lỗi lấy boards của user:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

//BOARD
export const createBoard = async (req: Request, res: Response) => {
    try {
        const { title, color, userId } = req.body

        if (!title || !userId) {
            return res.status(400).json({ message: 'Thiếu tiêu đề hoặc userId' })
        }

        // Kiểm tra userId có phải ObjectId hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'userId không hợp lệ' })
        }

        const newBoard = await Board.create({
            title,
            color: color || '#ffffff',
            ownerId: new mongoose.Types.ObjectId(userId),
            members: [new mongoose.Types.ObjectId(userId)],
            columnOrder: [],
        })

        res.status(201).json({ board: newBoard })
    } catch (error) {
        console.error('Lỗi tạo board:', error)
        res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const deleteBoard = async (req: Request, res: Response) => {
    try {

        const { boardId } = req.params
        const { userId } = req.body

        if (!mongoose.Types.ObjectId.isValid(boardId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID không hợp lệ' })
        }
        // Tìm board
        const board = await Board.findById(boardId)
        if (!board) {
            return res.status(404).json({ message: 'Board không tồn tại' })
        }

        // Kiểm tra user có phải owner không
        if (board.ownerId.toString() !== userId) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa board này' })
        }

        // Xóa board
        await Board.findByIdAndDelete(boardId)

        res.status(200).json({ message: 'Xóa board thành công' })
    } catch (error) {
        console.error('Lỗi xóa board:', error)
        res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

//DONE
export const getBoardFullData = async (req: Request, res: Response) => {
    try {
        const { boardId } = req.params

        if (!mongoose.Types.ObjectId.isValid(boardId)) {
            return res.status(400).json({ message: 'boardId không hợp lệ' })
        }

        const board = await Board.findById(boardId).lean()
        if (!board) {
            return res.status(404).json({ message: 'Không tìm thấy board' })
        }

        const allColumns = await Column.find({ boardId }).lean()
        const columnIds = allColumns.map(col => col.id)
        const allCards = await Card.find({ columnId: { $in: columnIds } }).lean()

        const cardsMap = new Map<string, any[]>()
        for (const card of allCards) {
            const colId = card.columnId.toString()
            if (!cardsMap.has(colId)) cardsMap.set(colId, [])
            cardsMap.get(colId)?.push(card)
        }

        const orderedColumns = board.columnOrder.map(colId => {
            const col = allColumns.find(c => c.id.toString() === colId.toString())
            if (!col) return null

            const cardsRaw = cardsMap.get(col.id.toString()) || []

            let sortedCards = []
            if (col.cardOrder?.length) {
                sortedCards = col.cardOrder
                    .map(cardId => cardsRaw.find(c => c.id.toString() === cardId.toString()))
                    .filter(Boolean)
            } else {
                sortedCards = cardsRaw
            }

            return {
                ...col,
                cards: sortedCards
            }
        }).filter(Boolean)

        // Trả về toàn bộ thông tin board + thêm columns
        return res.status(200).json({
            ...board,
            columns: orderedColumns
        })
    } catch (error) {
        console.error('Lỗi lấy dữ liệu board:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const updateBoardTitle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { boardId } = req.params
        const { title } = req.body

        // Kiểm tra ObjectId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(boardId)) {
            res.status(400).json({ message: 'ID board không hợp lệ' })
            return
        }

        // Cập nhật tiêu đề
        const updated = await Board.findByIdAndUpdate(
            boardId,
            { title },
            { new: true }
        )

        if (!updated) {
            res.status(404).json({ message: 'Board không tồn tại' })
            return
        }

        res.status(200).json(updated)
    } catch (error) {
        console.error('Lỗi update board:', error)
        res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

//test
export const getSingleBoardById = async (req: Request, res: Response) => {
    try {
        const { boardId } = req.params

        if (!mongoose.Types.ObjectId.isValid(boardId)) {
            return res.status(400).json({ message: 'boardId không hợp lệ' })
        }
        const board = await Board.findById(boardId).lean()

        if (!board) {
            return res.status(404).json({ message: 'Không tìm thấy board' })
        }

        return res.status(200).json({ board })







    } catch (error) {
        console.error('Lỗi lấy dữ liệu board:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

