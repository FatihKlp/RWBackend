import express from 'express';
import {
    accessInterviewByLink,
    submitInterview
} from '../controllers/link.controller';

const router = express.Router();

// GET: Interview'a erişim sağlama (Kullanıcı)
router.get('/:link', accessInterviewByLink);

// POST: Interview tamamlama (Kullanıcı video kaydeder)
router.post('/submit', submitInterview);

export default router;