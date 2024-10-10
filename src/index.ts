import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import 'dotenv/config';

import AuthRoutes from './routes/login.routes';
import QuestionsRoutes from './routes/questions.routes';
import QuestionPackageRoutes from './routes/questionPackages.routes';
import InterviewRoutes from './routes/interviews.routes';
import LinkRoutes from './routes/link.routes';

const PORT = process.env.PORT;
if (!PORT) {
    throw new Error("PORT must be defined");
}
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    throw new Error("MONGO_URL must be defined");
}

const CORS_ORIGIN = process.env.CORS_ORIGIN;

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(cookieParser());

// Loglama (İşlem yapıldığında)
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.ip} - ${req.method} ${req.path}`);
    next();
});

// Login Route (Public, no authentication required)
app.use('/api/login', AuthRoutes);
app.use('/api/questions', QuestionsRoutes);
app.use('/api/questionPackages', QuestionPackageRoutes);
app.use('/api/interviews', InterviewRoutes);
app.use('/api/links', LinkRoutes);

// Error Handling (Hata olduğu zamanlarda)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} - Error: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Mongoose connection
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error('MongoDB connection error:', error);
    });