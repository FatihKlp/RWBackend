import { Request, Response } from 'express';
import axios from 'axios';
import { generateToken } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // API_RESPONSE ile kullanıcı doğrulaması
        const apiResponse = await axios.post(`${process.env.API_RESPONSE}`, { email, password });
        console.log('API Response:', apiResponse.data);

        const { data } = apiResponse;
        // Check if response data and role are valid
        if (data && data.role === `${process.env.ROLE}`) {
            const isAdmin = data.role === `${process.env.ROLE}`;
            console.log('Is Admin:', isAdmin);

            const token = generateToken(isAdmin);
            console.log('Generatedbackend Token:', token);

            // Secure cookie ayarları
            res.cookie('token', token, {
                httpOnly: true,       // JavaScript tarafından erişilemez, XSS saldırılarına karşı korur
                sameSite: 'strict',   // CSRF saldırılarına karşı koruma
                secure: true,         // Yalnızca HTTPS üzerinde gönderilir
            });

            return res.status(200).json({ message: 'Login successful', token });
        } else {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
    } catch (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ message: 'Login failed: Server error' });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        // Token cookie'sini güvenli bir şekilde temizle
        res.clearCookie('token', { 
            httpOnly: true, 
            sameSite: 'strict', 
            secure: true      // HTTPS gerektirir
        });

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout Error:', err);
        return res.status(500).json({ message: 'Logout failed: Server error' });
    }
};