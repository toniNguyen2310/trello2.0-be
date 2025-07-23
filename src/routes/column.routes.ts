import express from 'express'
import { createColumn, deleteColumnById, getSingleColumnByIdLS, updateCardOrderGeneral, updateColumnTitle } from '../controllers/column.controller'
import { verifyAccessToken } from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/', verifyAccessToken, createColumn)
router.delete('/:columnId', verifyAccessToken, deleteColumnById)
router.put('/title/:columnId', verifyAccessToken, updateColumnTitle)
router.put('/update-card-order', verifyAccessToken, updateCardOrderGeneral)
router.get('/single/:columnId', verifyAccessToken, getSingleColumnByIdLS)


export default router
