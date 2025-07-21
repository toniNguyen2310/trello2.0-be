import express from 'express'
import { createColumn, deleteColumnById, getSingleColumnByIdLS, updateCardOrderGeneral, updateColumnTitle } from '../controllers/column.controller'

const router = express.Router()

router.post('/', createColumn)
router.delete('/:columnId', deleteColumnById)
router.put('/title/:columnId', updateColumnTitle)
router.put('/update-card-order', updateCardOrderGeneral)
router.get('/single/:columnId', getSingleColumnByIdLS)


export default router
