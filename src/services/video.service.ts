import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
dotenv.config();

export interface Video {
    title: string;
    file: File;
}

const VIDEO_API_KEY = process.env.VIDEO_API_KEY;
const VIDEO_API_LINK = process.env.VIDEO_API_LINK;
const VIDEO_API_BUCKET = process.env.VIDEO_API_BUCKET;
const VIDEO_API_PROJECT = process.env.VIDEO_API_PROJECT;

if (!VIDEO_API_KEY || !VIDEO_API_LINK) {
    throw new Error("Video API configuration is missing");
}

export const fetchVideos = async (): Promise<Video[]> => {
    try {
        const response = await axios.get(
            `${VIDEO_API_LINK}/${VIDEO_API_PROJECT}/${VIDEO_API_BUCKET}/${VIDEO_API_KEY}`
        );
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to fetch videos: ${error.message}`);
    }
};

export const fetchVideoById = async (videoId: string): Promise<Video> => {
    try {
        const response = await axios.get(
            `${VIDEO_API_LINK}/${VIDEO_API_PROJECT}/${VIDEO_API_BUCKET}/${VIDEO_API_KEY}/${videoId}`
        );
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to fetch video by ID: ${error.message}`);
    }
};

export const uploadVideoToAPI = async (file: Express.Multer.File) => {
    try {
        const formData = new FormData();
        const randomFileName = `${Date.now()}.mp4`;
        formData.append("file", file.buffer, randomFileName);
        formData.append("accessKey", VIDEO_API_KEY);
        formData.append("bucket", VIDEO_API_BUCKET);
        formData.append("project", VIDEO_API_PROJECT);

        const response = await axios.post(VIDEO_API_LINK, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log("API Response:", response.data); // Log complete response

        if (!response.data) {
            throw new Error("Invalid response from video API.");
        }

        return response.data;
    } catch (error: any) {
        console.error("Error during video upload:", error.response ? error.response.data : error.message);
        throw new Error(`Failed to upload video: ${error.message}`);
    }
};

export const deleteVideo = async (videoId: string): Promise<void> => {
    try {
        const response = await axios.delete(
            `${VIDEO_API_LINK}/${VIDEO_API_PROJECT}/${VIDEO_API_BUCKET}/${VIDEO_API_KEY}/${videoId}`
        );
        console.log("Video deleted from API:", response.data);
    } catch (error: any) {
        console.error("Failed to delete video:", error.response ? error.response.data : error.message);
        throw new Error(`Failed to delete video: ${error.message}`);
    }
};