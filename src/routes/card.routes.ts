

import express from 'express'
import { createCard, deleteCard, getCardDetail, getSingleCardByIdLS, updateDetailCard, updateCardStatus, updateCardTitle } from '../controllers/card.controller'

const router = express.Router()

// POST /api/cards
router.post('/', createCard)
router.get('/:cardId', getCardDetail)
router.put('/:cardId/title', updateCardTitle)
router.put('/:cardId/detail', updateDetailCard)
router.put('/:cardId/status', updateCardStatus)
router.delete('/:cardId', deleteCard)


router.get('/single/:cardId', getSingleCardByIdLS)



export default router
