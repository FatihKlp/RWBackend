import { Request, Response } from 'express';
import Candidate from '../models/candidate.model';
import Interview from '../models/interviews.model';

// Tüm adayları getirir
export const getAllCandidates = async (req: Request, res: Response) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving candidates', error });
    }
};

// ID'ye göre bir adayı getirir
export const getCandidateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            res.status(404).json({ message: 'Candidate not found' });
            return;
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving candidate', error });
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
            videoUrl
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

// Mevcut bir adayı günceller
export const updateCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!candidate) {
            res.status(404).json({ message: 'Candidate not found' });
            return;
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(400).json({ message: 'Error updating candidate', error });
    }
};

// Adayı siler ve ilgili videoyu da siler
export const deleteCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Deleting candidate with ID:", req.params.id);
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            res.status(404).json({ message: 'Candidate not found' });
            return;
        }

        console.log("Candidate found, proceeding to delete:", candidate);

        // Adayı sil
        await Candidate.findByIdAndDelete(req.params.id);
        console.log("Candidate deleted successfully");

        res.status(200).json({ message: 'Candidate and associated video deleted successfully.' });
    } catch (error) {
        console.error("Error deleting candidate:", error); // Log the error for more details
        res.status(500).json({ message: 'Error deleting candidate', error });
    }
};

// Belirli bir mülakat ID'ye göre adayları getirir
export const getCandidatesForInterview = async (req: Request, res: Response): Promise<void> => {
    const { interviewId } = req.params;
    try {
        const interview = await Interview.findById(interviewId).populate('candidate');
        if (!interview) {
            res.status(404).json({ message: 'Interview not found' });
            return;
        }
        res.status(200).json(interview.candidate);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching candidates for the interview',
            error
        });
    }
};

export const updateCandidateStatus = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;

    // Check if the status is one of the allowed values
    if (!['pending', 'passed', 'failed'].includes(status)) {
        res.status(400).json({ message: "Invalid status value" });
        return;
    }

    try {
        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!candidate) {
            res.status(404).json({ message: 'Candidate not found' });
            return;
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Error updating candidate status', error });
    }
};

// Result güncelleme fonksiyonu
export const updateCandidateResult = async (req: Request, res: Response): Promise<void> => {
    const { transcription, face_analysis } = req.body;
    const candidateId = req.params.id;

    try {
        const candidate = await Candidate.findByIdAndUpdate(
            candidateId,
            {
                $set: {
                    result: {
                        transcription,
                        face_analysis,
                    },
                },
            },
            { new: true }
        );

        if (!candidate) {
            res.status(404).json({ message: 'Candidate not found' });
            return;
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Error updating candidate result', error });
    }
};