import express from "express";
import { getVideos, getVideoById, deleteVideo } from "../controllers/video.controller";

const router = express.Router();

// GET: Tüm videoları al
router.get("/", getVideos);

// GET: Video'yu ID ile al
router.get("/:id", getVideoById);

// DELETE: Video sil
router.delete("/:id", deleteVideo);

export default router;