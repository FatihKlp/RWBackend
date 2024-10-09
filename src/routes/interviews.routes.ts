import express from 'express';
import {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview
} from '../controllers/interviews.controller';

const router = express.Router();

// POST: Yeni mülakat oluşturma
router.post('/', createInterview);

// GET: Tüm mülakatları listeleme
router.get('/', getInterviews);

// GET: Tek bir mülakatı ID'ye göre alma
router.get('/:id', getInterviewById);

// PUT: Mülakat güncelleme
router.put('/:id', updateInterview);

// DELETE: Mülakat silme
router.delete('/:id', deleteInterview);

// Modülü dışa aktarın
export default router;