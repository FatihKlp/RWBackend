import { json, Request, Response } from "express";
import Interview from "../models/interviews.model";
import Candidate from "../models/candidate.model";

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

    // Mülakatın yayında olup olmadığı kontrol ediliyor
    if (!interview.publish) {
      return res.status(403).json({ message: "Bu mülakat yayınlanmamıştır." });
    }

    // Mülakatın süresi dolmuş mu kontrol ediliyor
    const currentDate = new Date();
    if (interview.expireDate < currentDate) {
      return res.status(403).json({ message: "Bu mülakatın süresi dolmuştur." });
    }

    return res.status(200).json(interview); // Mülakat soruları ile dönüyor
  } catch (error) {
    return res.status(500).json({ message: "Mülakat getirilemedi", error });
  }
};

// Kullanıcı video kaydını tamamlama
export const submitInterview = async (req: Request, res: Response) => {
  const { candidateId, videoUrl } = req.body; // Sadece candidateId ve videoUrl'yi al

  try {
    // Candidate kaydını güncelle
    const candidate = await Candidate.findById(candidateId);
    if (candidate) {
      candidate.videoUrl = videoUrl; // Video URL'sini candidate kaydına ekle
      await candidate.save();
    }

    return res.status(200).json({ message: "Mülakat başarıyla tamamlandı" });
  } catch (error) {
    return res.status(500).json({ message: "Mülakat tamamlanamadı", error });
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

    // Yeni bir Candidate kaydı oluştur
    const candidate = new Candidate({
      firstName: fullName.split(' ')[0], // İlk adı ayırma
      lastName: fullName.split(' ')[1], // Soyadı ayırma
      email: email,
      phone: phoneNumber,
      kvkk: kvkk,
      status: 'pending' // Varsayılan durumu "pending"
    });

    await candidate.save(); // Candidate kaydını veritabanına kaydet

    // Kullanıcı bilgileri doğrulandıktan sonra video kayıt ekranına yönlendirilir
    return res.status(200).json({
      message: "Form başarıyla dolduruldu, video kaydına geçebilirsiniz",
      candidateId: candidate._id // Yeni oluşturulan candidate ID'si
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