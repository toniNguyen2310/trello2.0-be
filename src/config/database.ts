import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const dbState = [
    { value: 0, label: '🔴 Disconnected' },
    { value: 1, label: '🟢 Connected' },
    { value: 2, label: '🟡 Connecting' },
    { value: 3, label: '🟠 Disconnecting' }
]

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI

    if (!uri) {
        console.error('❌ MONGODB_URI is not defined in .env')
        process.exit(1)
    }

    try {
        await mongoose.connect(uri)
        const state = mongoose.connection.readyState
        const status = dbState.find(s => s.value === state)
        console.log(`${status?.label} to MongoDB`)
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error)
        throw error
    }
}
