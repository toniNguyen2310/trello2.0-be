import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { connectDB } from './config/database'
import authRoutes from './routes/auth.route'
import boardRoutes from './routes/board.routes'
import columnRoutes from './routes/column.routes'
import cardRoutes from './routes/card.routes'
import userRoutes from './routes/user.routes'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/', (_req, res) => {
    res.send('🚀 Backend server is running ✅')
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/columns', columnRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/users', userRoutes);

// Start server after DB is connected
(async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error)
        process.exit(1)
    }
})()
export default app
