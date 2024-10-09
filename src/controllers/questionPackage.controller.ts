import { Request, Response } from 'express';
import QuestionPackage from '../models/questionpackage.model';
import mongoose from 'mongoose';

// Yeni bir soru paketi ekle
export const addQuestionPackage = async (req: Request, res: Response) => {
    const { name, questions } = req.body;

    try {
        // Yeni soru paketi oluştur
        const newPackage = new QuestionPackage({ name, questions });
        await newPackage.save();
        return res.status(201).json(newPackage);
    } catch (error) {
        return res.status(400).json({ message: 'Error creating question package', error });
    }
};

// Soru paketini sil
export const deleteQuestionPackage = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid package ID' });
    }

    try {
        const deletedPackage = await QuestionPackage.findByIdAndDelete(id);
        if (!deletedPackage) {
            return res.status(404).json({ message: 'Question package not found' });
        }
        return res.status(200).json({ message: 'Question package deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting question package', error });
    }
};

// Soru paketini güncelle
export const updateQuestionPackage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, questions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid package ID' });
    }

    try {
        const updatedPackage = await QuestionPackage.findByIdAndUpdate(id, { name, questions }, { new: true });
        if (!updatedPackage) {
            return res.status(404).json({ message: 'Question package not found' });
        }
        return res.status(200).json(updatedPackage);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating question package', error });
    }
};

// Tek bir soru paketini getir
export const getQuestionPackageById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid package ID' });
    }

    try {
        const questionPackage = await QuestionPackage.findById(id).populate('questions');
        if (!questionPackage) {
            return res.status(404).json({ message: 'Question package not found' });
        }
        return res.status(200).json(questionPackage);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching question package', error });
    }
};

// Tüm soru paketlerini getir
export const getQuestionPackages = async (req: Request, res: Response) => {
    try {
        const packages = await QuestionPackage.find().populate('questions');
        return res.status(200).json(packages);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching question packages', error });
    }
};