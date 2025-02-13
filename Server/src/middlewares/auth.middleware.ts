import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import dotenv from 'dotenv';
import { AuthenticatedRequest, AuthenticatedUser } from '../types/types';

dotenv.config();

export const userMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized1" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

        // Find the user by ID
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                socketId: true,
            },
        });

        if (!user) {
            return res.status(401).json({ msg: "Unauthorized2" });
        }

        // Attach the user to the request object
        req.user = user;

        return next();
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(401).json({ msg: "Unauthorized3" });
    }
};
