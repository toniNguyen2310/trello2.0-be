// controllers/card.controller.ts

import { Request, Response } from 'express'
import { Card } from '../models/Card'
import { Column } from '../models/Column'

export const getSingleCardByIdLS = async (req: Request, res: Response) => {
    try {
        const { cardId } = req.params
        const card = await Card.findOne({ id: cardId }).lean()

        if (!card) {
            return res.status(404).json({ message: 'Không tìm thấy card' })
        }
        return res.status(200).json({ card })
    } catch (error) {
        console.error('Lỗi lấy dữ liệu board:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const createCard = async (req: Request, res: Response) => {
    try {
        const { idLS, columnId, title } = req.body

        if (!columnId || !title) {
            return res.status(400).json({ message: 'Thiếu columnId hoặc title' })
        }

        if (typeof columnId !== 'string') {
            return res.status(400).json({ message: 'columnId không hợp lệ' })
        }

        const column = await Column.findOne({ id: columnId })
        if (!column) {
            return res.status(404).json({ message: 'Không tìm thấy column' })
        }

        const newCard = await Card.create({
            id: idLS,
            columnId: columnId,
            title: title,
            checklistOrder: []
        })
        console.log(newCard)
        // Cập nhật cardOrder của column
        column.cardOrder.push(newCard.id)
        await column.save()

        return res.status(201).json(newCard)
    } catch (error) {
        console.error('Lỗi tạo card:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const getCardDetail = async (req: Request, res: Response) => {
    try {
        const { cardId } = req.params;
        console.log(cardId)
        if (!cardId || typeof cardId !== 'string') {
            return res.status(400).json({ message: 'cardId không hợp lệ' });
        }

        const card = await Card.findOne({ id: cardId });
        if (!card) {
            return res.status(404).json({ message: 'Không tìm thấy card' });
        }

        const column = await Column.findOne({ id: card.columnId });
        if (!column) {
            return res.status(404).json({ message: 'Không tìm thấy column chứa card' });
        }

        const result = {
            id: card.id,
            columnTitle: column.title,
            status: card.status,
            description: card.description,
            title: card.title,
            columnId: card.columnId,
            checklist: card.checklist
        };

        return res.status(200).json(result);
    } catch (error) {
        console.error('Lỗi lấy chi tiết card:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};


export const updateCardTitle = async (req: Request, res: Response) => {
    try {
        const { cardId } = req.params
        const { title } = req.body
        if (typeof cardId !== 'string') {
            return res.status(400).json({ message: 'cardId không hợp lệ' })
        }

        if (!title || typeof title !== 'string') {
            return res.status(400).json({ message: 'Tiêu đề không hợp lệ' })
        }

        const updatedCard = await Card.findOneAndUpdate(
            { id: cardId },
            { title: title },
            { new: true }
        )

        if (!updatedCard) {
            return res.status(404).json({ message: 'Không tìm thấy card' })
        }

        return res.status(200).json(updatedCard)
    } catch (error) {
        console.error('Lỗi đổi tên card:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const updateDetailCard = async (req: Request, res: Response) => {
    console.log('req.body>> ', req.body)
    const { cardId } = req.params
    const { description, checklist, title } = req.body

    if (typeof description !== 'string') {
        return res.status(400).json({ message: 'Description không hợp lệ' })
    }

    try {
        const updated = await Card.findOneAndUpdate({ id: cardId }, { description, title, checklist }, { new: true })
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy card' })
        res.status(200).json(updated)
    } catch (err) {
        console.error('Lỗi update description:', err)
        res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const updateCardStatus = async (req: Request, res: Response) => {
    const { cardId } = req.params
    const { status } = req.body

    if (typeof status !== 'boolean') {
        return res.status(400).json({ message: 'Status không hợp lệ' })
    }

    try {
        const updated = await Card.findByIdAndUpdate(cardId, { status }, { new: true })
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy card' })
        res.status(200).json(updated)
    } catch (err) {
        console.error('Lỗi update status:', err)
        res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}

export const deleteCard = async (req: Request, res: Response) => {
    try {
        const { cardId } = req.params

        if (typeof cardId !== 'string') {
            return res.status(400).json({ message: 'cardId không hợp lệ' })
        }

        const card = await Card.findOne({ id: cardId })
        if (!card) {
            return res.status(404).json({ message: 'Không tìm thấy card' })
        }

        // Xóa card
        await Card.deleteOne({ id: cardId })

        // Xoá cardId khỏi column.cardOrder
        await Column.findOneAndUpdate({ id: card.columnId }, {
            $pull: { cardOrder: card.id }
        }, { new: true })

        return res.status(200).json({ message: 'Đã xoá thẻ' })
    } catch (error) {
        console.error('Lỗi xoá card:', error)
        return res.status(500).json({ message: 'Lỗi máy chủ' })
    }
}





