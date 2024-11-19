import express from 'express';
import {
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
    getCandidatesForInterview,
    updateCandidateStatus,
    updateCandidateResult
} from '../controllers/candidate.controller';

const router = express.Router();

// Tüm adayları getirir
router.get('/', getAllCandidates);

// ID'ye göre bir adayı getirir
router.get('/:id', getCandidateById);

// Mevcut bir adayı günceller , ilerde güncelleme ihtiyacı duyulursa
router.put('/:id', updateCandidate);

// Bir adayı siler
router.delete('/:id', deleteCandidate);

// Belirli bir mülakat ID'ye göre adayları getirir
router.get('/:interviewId/candidates', getCandidatesForInterview);

// Candidate status update
router.put('/:id/status', updateCandidateStatus);

// Candidate result update
router.put('/:id/result', updateCandidateResult);

export default router;