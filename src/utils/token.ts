import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '2d' })
}

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '15d' })
}
