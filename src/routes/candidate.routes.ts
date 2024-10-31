import express from 'express';
import {
    getAllCandidates,
    getCandidateById,
    submitInterview,
    updateCandidate,
    deleteCandidate,
    getCandidatesForInterview
} from '../controllers/candidate.controller';

const router = express.Router();

// Tüm adayları getirir
router.get('/', getAllCandidates);

// ID'ye göre bir adayı getirir
router.get('/:id', getCandidateById);

// POST: Interview tamamlama kullanıcı oluşturma
router.post("/submit", submitInterview);

// Mevcut bir adayı günceller
router.put('/:id', updateCandidate);

// Bir adayı siler
router.delete('/:id', deleteCandidate);

// Belirli bir mülakat ID'ye göre adayları getirir
router.get('/:interviewId/candidates', getCandidatesForInterview);

export default router;