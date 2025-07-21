import express from 'express'
import { verifyAccessToken } from '..//middlewares/auth.middleware'
import { createBoard, deleteBoard, getBoardFullData, getBoardsByUser, getSingleBoardById, updateBoardTitle } from '../controllers/board.controller'
import { updateColumnOrder } from '../controllers/column.controller'

const router = express.Router()

// Route cần xác thực
router.get('/protected', verifyAccessToken, (req, res) => {
    return res.json({
        message: 'Đây là route bảo vệ',
        userId: req.user?.id
    })
})
// Giả sử có một route cần login mới truy cập được:

//Board
router.post('/', createBoard)
router.get('/:userId', getBoardsByUser)
router.delete('/:boardId', deleteBoard)
router.put('/:boardId', updateBoardTitle)

//Boards
router.get('/:boardId/full', getBoardFullData)

//COLUMN
router.put('/:boardId/column-order', updateColumnOrder)


//BOARD SIGLE
router.get('/single/:boardId', getSingleBoardById)




export default router
