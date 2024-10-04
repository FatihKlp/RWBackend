import { Request, Response } from 'express';
import { generateToken } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Logic for login
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
        const token = generateToken(true); // isAdmin

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).json({ message: 'Login successful', token });
    } else {
        return res.status(401).json({ message: 'Invalid Credentials' });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        // Token cookie'sini temizliyoruz
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production', // HTTPS üzerinde gönderilir
        });

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout Error:', err);
        return res.status(500).json({ message: 'Logout failed: Server error' });
    }
};