import express from 'express';
import { login, logout } from '../controllers/login.controller';

const router = express.Router();

router.post('/', login);

router.post('/logout', logout);

export default router;