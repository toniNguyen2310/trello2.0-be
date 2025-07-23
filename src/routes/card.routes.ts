

import express from 'express'
import { createCard, deleteCard, getCardDetail, getSingleCardByIdLS, updateDetailCard, updateCardStatus, updateCardTitle } from '../controllers/card.controller'
import { verifyAccessToken } from '../middlewares/auth.middleware'

const router = express.Router()

// POST /api/cards
router.post('/', verifyAccessToken, createCard)
router.get('/:cardId', verifyAccessToken, getCardDetail)
router.put('/:cardId/title', verifyAccessToken, updateCardTitle)
router.put('/:cardId/detail', verifyAccessToken, updateDetailCard)
router.put('/:cardId/status', verifyAccessToken, updateCardStatus)
router.delete('/:cardId', verifyAccessToken, deleteCard)


router.get('/single/:cardId', getSingleCardByIdLS)



export default router
