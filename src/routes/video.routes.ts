import express from "express";
import { getVideos, getVideoById, uploadVideo, deleteVideo } from "../controllers/video.controller";
import multer from "multer";

// Multer setup - Memory storage to keep files in memory, not on disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// GET: Tüm videoları al
router.get("/", getVideos);

// GET: Video'yu ID ile al
router.get("/:id", getVideoById);

// POST: Video yükle
router.post("/", upload.single("file"), uploadVideo);

// DELETE: Video sil
router.delete("/:id", deleteVideo);

export default router;