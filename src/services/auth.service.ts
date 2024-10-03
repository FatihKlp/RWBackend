import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (isAdmin: boolean) => {
    return jwt.sign({ admin: isAdmin }, JWT_SECRET, { expiresIn: '3h' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { admin: boolean };
    } catch (e) {
        return null;
    }
};