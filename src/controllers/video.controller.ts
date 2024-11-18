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
        console.log(id);
        const video = await VideoService.fetchVideoById(id);
        console.log(video);
        res.status(200).json(video);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Video bulunamadı";
        res.status(500).json({ message, error });
    }
};

export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            console.log("Received file yoksa(Backend):", req.file);
            console.error("No video file uploaded.");
            res.status(400).json({ message: "No video file uploaded." });
            return;
        }

        console.log("Received file varsa(Backend):", req.file); // Log the received file

        const responseData = await VideoService.uploadVideoToAPI(req.file);
        console.log("Video uploaded to API dan gelen data(backend):", responseData);

        res.status(200).json(responseData);
        return;

    } catch (error) {
        console.error("Error during video upload:", error); // Improved logging
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