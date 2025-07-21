// controllers/userController.ts
import { Request, Response } from 'express';
import { IUser, User } from '../models/User';


export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const getSafeUser = (user: IUser) => {
            const { password, ...safeUser } = user.toObject(); // loại bỏ password
            return safeUser;
        }

        const safeUser = getSafeUser(user);

        return res.json(safeUser);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
