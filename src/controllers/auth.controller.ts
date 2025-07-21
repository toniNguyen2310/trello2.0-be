import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IUser, User } from '../models/User'
import { generateAccessToken, generateRefreshToken } from '../utils/token'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Thiếu thông tin' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' })
        }

        const hashedPassword = await bcrypt.hash(password, 6)

        const user = await User.create({ username, email, password: hashedPassword }) as IUser

        const accessToken = generateAccessToken(user._id.toString())

        const refreshToken = generateRefreshToken(user._id.toString())

        function sanitizeUser(user: IUser) {
            const { password, ...rest } = user.toObject();
            return rest;
        }
        res.status(201).json({
            message: 'Signup Success',
            user: sanitizeUser(user),
            accessToken,
            refreshToken
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu.' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Email chưa được đăng ký' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không đúng' })
        }

        const accessToken = generateAccessToken(user._id.toString())
        const refreshToken = generateRefreshToken(user._id.toString())

        function sanitizeUser(user: IUser) {
            const { password, ...rest } = user.toObject();
            return rest;
        }
        res.status(200).json({
            message: ' Login success',
            user: sanitizeUser(user),
            accessToken,
            refreshToken
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

// Xoá token ở FE khi logout
export const logout = (req: Request, res: Response) => {
    return res.json({ message: 'Đăng xuất thành công (FE tự xoá token).' })
}

export const refreshAccessToken = (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(400).json({ message: 'Thiếu refresh token.' })
    }

    try {
        // Xác minh refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string }

        // Tạo access token mới
        const newAccessToken = generateAccessToken(decoded.userId)

        return res.json({
            message: 'Tạo access token mới thành công',
            accessToken: newAccessToken
        })
    } catch (error) {
        console.error('Lỗi khi refresh token:', error)
        return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn.' })
    }
}
