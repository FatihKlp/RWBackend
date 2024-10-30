import { Request, Response } from "express";
import Interview from "../models/interviews.model";
import Candidate from "../models/candidate.model";

const URL = process.env.COMPANY_URL;

// Interview linki ile mülakata erişim
export const accessInterviewByLink = async (req: Request, res: Response) => {
  const { link } = req.params;

  try {
    const interview = await Interview.findOne({ interviewLink: link })
      .populate({
        path: "questionPackage",
        populate: {
          path: "questions", // questionPackage içindeki questions alanını doldur
        },
      })
      .populate("candidate");

    if (!interview) {
      return res.status(404).json({ message: "Mülakat bulunamadı" });
    }

    // Mülakatın yayında olup olmadığı kontrol ediliyor
    if (!interview.publish) {
      return res.status(403).json({ message: "Bu mülakat yayınlanmamıştır." });
    }

    // Mülakatın süresi dolmuş mu kontrol ediliyor
    const currentDate = new Date(); // Sunucudaki geçerli tarih
    if (new Date(interview.expireDate) < currentDate) {
      return res.status(403).json({ message: "Bu mülakatın süresi dolmuştur." });
    }

    return res.status(200).json(interview); // Mülakat soruları ile dönüyor
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mülakat getirilemedi";
    res.status(500).json({ message, error });
  }
};

// Kullanıcı video kaydını tamamlama
export const submitInterview = async (req: Request, res: Response) => {
  const { interviewId, firstName, lastName, email, phone, kvkk, videoUrl } = req.body;

  try {
    // Yeni bir candidate oluştur ve kaydet
    const candidate = new Candidate({
      firstName,
      lastName,
      email,
      phone,
      kvkk,
      videoUrl,
    });
    await candidate.save();

    // Interview'e candidate'i ekle ve güncelle
    await Interview.findByIdAndUpdate(
      interviewId,
      { $push: { candidate: candidate._id } }, // Yeni candidate'i candidates dizisine ekle
      { new: true }
    );

    res.status(201).json({ message: "Candidate başarıyla kaydedildi." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Candidate kaydedilemedi.";
    res.status(500).json({ message, error });
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
    const message = error instanceof Error ? error.message : "Mülakat linki oluşturulamadı";
    res.status(400).json({ message, error });
  }
};