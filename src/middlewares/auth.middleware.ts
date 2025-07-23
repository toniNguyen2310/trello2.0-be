import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'trello_clone_secret'

interface DecodedToken {
    userId: string
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
            }
        }
    }
}

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có token truy cập.' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
        req.user = { id: decoded.userId }
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' })
    }
}
