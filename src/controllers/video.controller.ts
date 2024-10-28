import { Request, Response } from "express";
import * as VideoService from "../services/video.service";

export const getVideos = async (req: Request, res: Response): Promise<void> => {
    try {
        const videos = await VideoService.fetchVideos();
        res.status(200).json(videos);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Videolar bulunamadı";
        res.status(500).json({ message, error });
    }
};

export const getVideoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const video = await VideoService.fetchVideoById(id);
        res.status(200).json(video);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Video bulunamadı";
        res.status(500).json({ message, error });
    }
};

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send("No video file uploaded.");
        }

        const responseData = await VideoService.uploadVideoToAPI(req.file);

        res.status(200).send(responseData);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Video yüklenemedi";
        res.status(500).json({ message, error });
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