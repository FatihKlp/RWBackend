import express from "express";

import {
  accessInterviewByLink,
  generateInterviewLink,
} from "../controllers/link.controller";

const router = express.Router();

// GET: Interview'a erişim sağlama (Kullanıcı)
router.get("/:link", accessInterviewByLink);

// GET: Mülakat linki oluşturma
router.get("/:interviewId/generate-link", generateInterviewLink);

export default router;