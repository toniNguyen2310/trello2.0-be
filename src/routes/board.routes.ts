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
router.post('/', verifyAccessToken, createBoard)
router.get('/:userId', verifyAccessToken, getBoardsByUser)
router.delete('/:boardId', verifyAccessToken, deleteBoard)
router.put('/:boardId', verifyAccessToken, updateBoardTitle)

//Boards
router.get('/:boardId/full', verifyAccessToken, getBoardFullData)

//COLUMN
router.put('/:boardId/column-order', verifyAccessToken, updateColumnOrder)


//BOARD SIGLE
router.get('/single/:boardId', verifyAccessToken, getSingleBoardById)




export default router
