import express from 'express'
import { signup, login, refreshAccessToken } from '../controllers/auth.controller'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/refresh-token', refreshAccessToken)

export default router
