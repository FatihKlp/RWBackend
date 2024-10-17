import express from "express";

import {
  accessInterviewByLink,
  submitInterview,
  submitInterviewForm,
  generateInterviewLink,
} from "../controllers/link.controller";

const router = express.Router();

// GET: Interview'a erişim sağlama (Kullanıcı)
router.get("/:link", accessInterviewByLink);

// POST: Interview tamamlama (Kullanıcı video kaydeder)
router.post("/submit", submitInterview);

// POST: Form doldurma (Kullanıcı form doldurur)
router.post("/submitform", submitInterviewForm);

// GET: Mülakat linki oluşturma
router.get("/:interviewId/generate-link", generateInterviewLink);

export default router;