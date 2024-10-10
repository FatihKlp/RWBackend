import express from 'express';
import {
    accessInterviewByLink,
    submitInterview,
    getInterviewById
} from '../controllers/link.controller';

const router = express.Router();

// GET: Interview'a erişim sağlama (Kullanıcı)
router.get('/link/:link', accessInterviewByLink);

// POST: Interview tamamlama (Kullanıcı video kaydeder)
router.post('/submit', submitInterview);

// GET: Tek bir mülakatı ID'ye göre alma
router.get('/:id', getInterviewById);

export default router;