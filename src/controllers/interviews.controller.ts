import { json, Request, Response } from "express";
import Interview from "../models/interviews.model";

// Admin yeni bir mülakat oluşturur
export const createInterview = async (req: Request, res: Response): Promise<void> => {
  const { title, questionPackage, expireDate } = req.body;

  try {
    const newInterview = new Interview({ title, questionPackage, expireDate });
    await newInterview.save();

    res.status(201).json({ interview: newInterview }); // Sadece interview döndürülüyor
    return;
  } catch (error) {
    res.status(400).json({ message: "Interview oluşturulamadı", error });
    return;
  }
};

// Tüm mülakatları listeleme
export const getInterviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const interviews = await Interview.find().populate("candidate questionPackage"); // Kullanıcı ve soru paketleriyle birlikte getir
    res.status(200).json(interviews); // Mülakatlar listelendi
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mülakatlar listelenemedi";
    res.status(400).json({ message, error });
  }
};

// Tek bir mülakatı ID'ye göre alma
export const getInterviewById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const interview = await Interview.findById(id).populate({
      path: "questionPackage",
      populate: {
        path: "questions",
      },
    }); // Kullanıcı ve soru paketleriyle birlikte getir
    if (!interview) {
      res.status(404).json({ message: "Mülakat bulunamadı" });
      return;
    }
    res.status(200).json(interview); // Mülakat bulundu
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mülakat bulunamadı";
    res.status(400).json({ message, error });
}
};

// Mülakat güncelleme
export const updateInterview = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedInterview = await Interview.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("candidate questionPackage"); // Kullanıcı ve soru paketleriyle birlikte getir
    if (!updatedInterview) {
      res.status(404).json({ message: "Mülakat bulunamadı" });
      return;
    }
    res.status(200).json(updatedInterview); // Mülakat güncellendi
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mülakat güncellenemedi";
    res.status(400).json({ message, error });
  }
};

// Mülakat silme
export const deleteInterview = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedInterview = await Interview.findByIdAndDelete(id);
    if (!deletedInterview) {
      res.status(404).json({ message: "Mülakat bulunamadı" });
      return;
    }
    res.status(200).json({ message: "Mülakat başarıyla silindi" }); // Mülakat silindi
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mülakat silinemedi";
    res.status(400).json({ message, error });
  }
};

// Mülakatı yayınlama durumunu güncelleme (publish/unpublish)
export const updatePublishStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { publish } = req.body;

  try {
    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      { publish: publish }, // Doğru alan adı
      { new: true }
    ).populate("candidate questionPackage"); // Kullanıcı ve soru paketleriyle birlikte getir
    if (!updatedInterview) {
      res.status(404).json({ message: "Mülakat bulunamadı" });
      return;
    }
    res.status(200).json(updatedInterview);
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mülakat güncellenemedi";
    res.status(400).json({ message, error });
  }
};