import express from 'express'
import authRoutes from './routes/auth.route'
import boardRoutes from './routes/board.routes'
import columnRoutes from './routes/column.routes'
import cardRoutes from './routes/card.routes'
import userRoutes from './routes/user.routes'
import cors from "cors"

const app = express()


app.use(cors());
// app.use(cors({
//     origin: "http://localhost:5173", // Cho phép frontend
//     credentials: true               // Cho phép gửi cookie/token
// }));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Backend server is running ✅');
});

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/columns', columnRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/users', userRoutes);

export default app
