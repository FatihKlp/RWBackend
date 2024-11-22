import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";

config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

if (!BUCKET_NAME) {
    throw new Error("S3 bucket configuration is missing");
}

export const getSignedVideoUrl = async (key: string): Promise<string> => {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 saatlik geçerlilik
        return signedUrl;
    } catch (error) {
        throw new Error(`Failed to generate signed URL: ${error}`);
    }
};

// Videoları listele
export const listVideos = async (): Promise<{ key: string; name: string; signedUrl: string }[]> => {
    try {
        const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
        const response = await s3.send(command);

        const videos = response.Contents?.map(async (item) => {
            const signedUrl = await getSignedVideoUrl(item.Key || ""); // Dinamik URL oluştur
            return {
                key: item.Key || "",
                name: item.Key?.split("/").pop() || "",
                signedUrl, // Signed URL ekleniyor
            };
        });

        return Promise.all(videos || []);
    } catch (error) {
        throw new Error(`Failed to list videos: ${error}`);
    }
};

// Tek bir video için URL al
export const getVideoById = async (key: string): Promise<{ key: string; name: string; signedUrl: string }> => {
    try {
        const signedUrl = await getSignedVideoUrl(key); // Signed URL oluştur
        return {
            key,
            name: key.split("/").pop() || "", // Dosya adı
            signedUrl, // Signed URL
        };
    } catch (error) {
        throw new Error(`Failed to fetch video URL: ${error}`);
    }
};

export const uploadVideo = async (file: Express.Multer.File): Promise<string> => {
    try {
        const key = `${Date.now()}-${file.originalname}`; // S3'teki benzersiz dosya adı
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await s3.send(command); // S3'e yükleme işlemi
        return key; // Anahtarı döndürün
    } catch (error) {
        throw new Error(`Failed to upload video: ${error}`);
    }
};

export const deleteVideo = async (key: string): Promise<void> => {
    try {
        const command = new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key });
        await s3.send(command);
    } catch (error) {
        throw new Error(`Failed to delete video: ${error}`);
    }
};
