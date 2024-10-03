import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
// import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import 'dotenv/config';
import { LoginRoutes, LogoutRoutes } from './routes/login.routes';
// import QuestionRoutes from './routes/QuestionRoutes';
// import CandidateRoutes from './routes/CandidateRoutes';
// import InterviewRoutes from './routes/InterviewRoutes';

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
// app.use(cookieParser());

// Loglama
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.ip} - ${req.method} ${req.path}`);
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Express with TypeScript!');
  });
  
// Login Route (Public, no authentication required)
app.use('/api/login', LoginRoutes);
app.use('/api/logout', LogoutRoutes);

// // Admin Routes (Protected, authentication required)
// app.use('/api/question', QuestionRoutes);
// app.use('/api/candidate', CandidateRoutes);
// app.use('/api/interview', InterviewRoutes);

// Error Handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

mongoose.connect(MONGO_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Connected to db & listening on port ${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.error('Database connection error:', error);
    });