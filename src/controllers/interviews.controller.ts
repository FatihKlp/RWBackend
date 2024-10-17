import { Request, Response } from "express";
import Interview from "../models/interviews.model";

// Admin yeni bir mülakat oluşturur
export const createInterview = async (req: Request, res: Response) => {
  const { title, questionPackage, expireDate } = req.body;

  try {
    const newInterview = new Interview({ title, questionPackage, expireDate });
    await newInterview.save();

    return res.status(201).json({ interview: newInterview }); // Sadece interview döndürülüyor
  } catch (error) {
    return res.status(400).json({ message: "Interview oluşturulamadı", error });
  }
};

// Tüm mülakatları listeleme
export const getInterviews = async (req: Request, res: Response) => {
  try {
    const interviews = await Interview.find().populate("candidate questionPackage"); // Kullanıcı ve soru paketleriyle birlikte getir
    return res.status(200).json(interviews); // Mülakatlar listelendi
  } catch (error) {
    return res.status(400).json({ message: "Mülakatlar alınamadı", error });
  }
};

// Tek bir mülakatı ID'ye göre alma
export const getInterviewById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findById(id).populate(
      "candidate questionPackage"
    ); // Kullanıcı ve soru paketleriyle birlikte getir
    if (!interview) {
      return res.status(404).json({ message: "Mülakat bulunamadı" });
    }
    return res.status(200).json(interview); // Mülakat bulundu
  } catch (error) {
    return res.status(400).json({ message: "Mülakat alınamadı", error });
  }
};

// Mülakat güncelleme
export const updateInterview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedInterview = await Interview.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("candidate questionPackage"); // Kullanıcı ve soru paketleriyle birlikte getir
    if (!updatedInterview) {
      return res.status(404).json({ message: "Mülakat bulunamadı" });
    }
    return res.status(200).json(updatedInterview); // Mülakat güncellendi
  } catch (error) {
    return res.status(400).json({ message: "Mülakat güncellenemedi", error });
  }
};

// Mülakat silme
export const deleteInterview = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedInterview = await Interview.findByIdAndDelete(id);
    if (!deletedInterview) {
      return res.status(404).json({ message: "Mülakat bulunamadı" });
    }
    return res.status(200).json({ message: "Mülakat başarıyla silindi" }); // Mülakat silindi
  } catch (error) {
    return res.status(400).json({ message: "Mülakat silinemedi", error });
  }
};
