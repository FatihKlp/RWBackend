import { Request, Response } from "express";
import Interview from "../models/interviews.model";

const URL = process.env.COMPANY_URL;

// Interview linki ile mülakata erişim
export const accessInterviewByLink = async (req: Request, res: Response) => {
  const { link } = req.params;

  try {
    const interview = await Interview.findOne({ interviewLink: link }).populate(
      "questionPackage"
    );
    if (!interview) {
      return res.status(404).json({ message: "Mülakat bulunamadı" });
    }

    // Mülakatın süresi dolmuş mu kontrol ediyoruz
    const currentDate = new Date();
    if (interview.expireDate < currentDate) {
      return res
        .status(403)
        .json({ message: "Bu mülakatın süresi dolmuştur." });
    }

    return res.status(200).json(interview); // Mülakat soruları ile dönüyor
  } catch (error) {
    return res.status(500).json({ message: "Mülakat getirilemedi", error });
  }
};

// Kullanıcı bilgileri ile mülakata giriş
export const submitInterview = async (req: Request, res: Response) => {
  const { interviewId, videoUrl } = req.body;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Mülakat bulunamadı" });
    }

    // Video URL'si kaydedilir
    interview.videoUrl = videoUrl;
    await interview.save();

    return res.status(200).json({ message: "Mülakat başarıyla tamamlandı" });
  } catch (error) {
    return res.status(500).json({ message: "Mülakat tamamlanamadı", error });
  }
};

// Mülakat detaylarını alırken link de döndürülecek
export const getInterviewById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findById(id).populate(
      "user questionPackage"
    );
    if (!interview) {
      return res.status(404).json({ message: "Mülakat bulunamadı" });
    }

    const interviewLink = `www.firmaismi.com/interview/${interview.interviewLink}`;
    return res.status(200).json({ ...interview.toObject(), interviewLink }); // Linki de döndür
  } catch (error) {
    return res.status(400).json({ message: "Mülakat alınamadı", error });
  }
};

// Kullanıcı form doldurma ve mülakata giriş
export const submitInterviewForm = async (req: Request, res: Response) => {
  const { interviewId, fullName, email, phoneNumber, kvkk } = req.body;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Mülakat bulunamadı" });
    }

    if (!kvkk) {
      return res.status(400).json({ message: "KVKK kabul edilmelidir" });
    }

    // Kullanıcı bilgileri doğrulandıktan sonra video kayıt ekranına yönlendirilir
    return res
      .status(200)
      .json({
        message: "Form başarıyla dolduruldu, video kaydına geçebilirsiniz",
      });
  } catch (error) {
    return res.status(500).json({ message: "Form işlenemedi", error });
  }
};

// Yeni fonksiyon: Mülakat linki oluşturma
export const generateInterviewLink = async (req: Request, res: Response) => {
  const { interviewId } = req.params;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Mülakat bulunamadı" });
    }

    const interviewLink = `${URL}/interview/${interview.interviewLink}`;

    return res.status(200).json({ interviewLink });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Mülakat linki oluşturulamadı", error });
  }
};
