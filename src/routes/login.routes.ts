// routes/media.routes.ts
import express from 'express';
import { login, logout } from '../controllers/login.controller';

const router = express.Router();

// Login için POST isteği
router.post('/', login);

// Logout için POST isteği
router.post('/', logout);

export default router;