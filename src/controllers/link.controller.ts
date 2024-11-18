import { Request, Response } from "express";
import Interview from "../models/interviews.model";

const URL = process.env.COMPANY_URL;

// // Interview linki ile mülakata erişim
// export const accessInterviewByLink = async (req: Request, res: Response) => {
//   const { link } = req.params;

//   try {
//     const interview = await Interview.findOne({ interviewLink: link })
//       .populate({
//         path: "questionPackage",
//         populate: {
//           path: "questions", // questionPackage içindeki questions alanını doldur
//         },
//       })
//       .populate("candidate");

//     if (!interview) {
//       return res.status(404).json({ message: "Mülakat bulunamadı" });
//     }

//     // Mülakatın yayında olup olmadığı kontrol ediliyor
//     if (!interview.publish) {
//       return res.status(403).json({ message: "Bu mülakat yayınlanmamıştır." });
//     }

//     // Mülakatın süresi dolmuş mu kontrol ediliyor
//     const currentDate = new Date(); // Sunucudaki geçerli tarih
//     if (new Date(interview.expireDate) < currentDate) {
//       return res.status(403).json({ message: "Bu mülakatın süresi dolmuştur." });
//     }

//     return res.status(200).json(interview); // Mülakat soruları ile dönüyor
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Mülakat getirilemedi";
//     res.status(500).json({ message, error });
//   }
// };

// Yeni fonksiyon: Mülakat linki oluşturma
export const generateInterviewLink = async (req: Request, res: Response): Promise<void> => {
  const { interviewId } = req.params;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      res.status(404).json({ message: "Mülakat bulunamadı" });
      return;
    }

    const interviewLink = `${URL}/interview/${interview.interviewLink}`;

    res.status(200).json({ interviewLink });
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mülakat linki oluşturulamadı";
    res.status(400).json({ message, error });
  }
};