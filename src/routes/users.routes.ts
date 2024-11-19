import express from "express";
import multer from "multer";
import { accessInterviewByLink } from "../controllers/link.controller";
import { uploadVideo } from "../controllers/video.controller";
import { submitInterview } from "../controllers/candidate.controller";

// Multer setup - Memory storage to keep files in memory, not on disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// GET: Interview'a erişim sağlama (Kullanıcı)
router.get("/:link", accessInterviewByLink);

// POST: Video yükle
router.post("/", upload.single("file"), uploadVideo);

// POST: Interview tamamlama kullanıcı oluşturma
router.post("/submit", submitInterview);

export default router;