import express from 'express';
import {
    addQuestionPackage,
    deleteQuestionPackage,
    updateQuestionPackage,
    getQuestionPackageById,
    getQuestionPackages
} from '../controllers/questionPackage.controller';

const router = express.Router();

router.post('/', addQuestionPackage);            // Yeni paket oluştur
router.delete('/:id', deleteQuestionPackage);    // Paketi sil
router.put('/:id', updateQuestionPackage);       // Paketi güncelle
router.get('/:id', getQuestionPackageById);      // Tek paket getir
router.get('/', getQuestionPackages);            // Tüm paketleri getir

export default router;