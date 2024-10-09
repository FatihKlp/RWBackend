import { Request, Response } from 'express';
import Interview from '../models/interviews.model';

// Interview linki ile mülakata erişim
export const accessInterviewByLink = async (req: Request, res: Response) => {
    const { link } = req.params;

    try {
        const interview = await Interview.findOne({ interviewLink: link }).populate('questionPackage');
        if (!interview) {
            return res.status(404).json({ message: 'Mülakat bulunamadı' });
        }

        // Mülakatın süresi dolmuş mu kontrol ediyoruz
        const currentDate = new Date();
        if (interview.expireDate < currentDate) {
            return res.status(403).json({ message: 'Bu mülakatın süresi dolmuştur.' });
        }

        return res.status(200).json(interview);  // Mülakat soruları ile dönüyor
    } catch (error) {
        return res.status(500).json({ message: 'Mülakat getirilemedi', error });
    }
};


// Kullanıcı bilgileri ile mülakata giriş
export const submitInterview = async (req: Request, res: Response) => {
    const { interviewId, fullName, email, phoneNumber, videoUrl } = req.body;

    try {
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Mülakat bulunamadı' });
        }

        // Video URL'si ve kullanıcı bilgileri kaydediliyor
        interview.videoUrl = videoUrl;
        await interview.save();

        // Kullanıcı bilgilerini kaydedebilir ya da başka bir işlemi tetikleyebilirsin
        return res.status(200).json({ message: 'Mülakat başarıyla tamamlandı' });
    } catch (error) {
        return res.status(500).json({ message: 'Mülakat tamamlanamadı', error });
    }
};
