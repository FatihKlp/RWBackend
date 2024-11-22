import { Request, Response } from "express";
import * as VideoService from "../services/video.service";

export const getVideos = async (req: Request, res: Response): Promise<void> => {
    try {
        const videos = await VideoService.listVideos(); // Videoları listele
        res.status(200).json(videos); // JSON formatında döndür
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getVideoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Videonun S3 anahtarı
        const video = await VideoService.getVideoById(id); // Video bilgisi al
        console.log("Fetched video:", video);
        res.status(200).json(video); // JSON formatında döndür
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No video file uploaded." });
            return;
        }

        const uploadedVideoKey = await VideoService.uploadVideo(req.file); // Videoyu yükle
        res.status(200).json({ key: uploadedVideoKey }); // Anahtar döndür
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await VideoService.deleteVideo(id);
        res.status(204).send();
    } catch (error) {
        const message = error instanceof Error ? error.message : "Video silinemedi";
        res.status(500).json({ message, error });
    }
};
