import { Request, Response } from 'express';
import QuestionPackage from '../models/questionPackage.model';
import mongoose from 'mongoose';

// Yeni bir soru paketi ekle
export const addQuestionPackage = async (req: Request, res: Response) => {
    const { name, questions } = req.body;

    try {
        // Yeni soru paketi oluştur
        const newPackage = new QuestionPackage({ name, questions });
        await newPackage.save();
        res.status(201).json(newPackage);
        return;
    } catch (error) {
        res.status(400).json({ message: 'Error creating question package', error });
        return;
    }
};

// Soru paketini sil
export const deleteQuestionPackage = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid package ID' });
        return;
    }

    try {
        const deletedPackage = await QuestionPackage.findByIdAndDelete(id);
        if (!deletedPackage) {
            res.status(404).json({ message: 'Question package not found' });
            return;
        }
        res.status(200).json({ message: 'Question package deleted successfully' });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question package', error });
        return;
    }
};

// Soru paketini güncelle
export const updateQuestionPackage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, questions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid package ID' });
        return;
    }

    try {
        const updatedPackage = await QuestionPackage.findByIdAndUpdate(id, { name, questions }, { new: true });
        if (!updatedPackage) {
            res.status(404).json({ message: 'Question package not found' });
            return;
        }
        res.status(200).json(updatedPackage);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error updating question package', error });
        return;
    }
};

// Tek bir soru paketini getir
export const getQuestionPackageById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid package ID' });
        return;
    }

    try {
        const questionPackage = await QuestionPackage.findById(id).populate('questions');
        if (!questionPackage) {
            res.status(404).json({ message: 'Question package not found' });
            return;
        }
        res.status(200).json(questionPackage);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error fetching question package', error });
        return;
    }
};

// Tüm soru paketlerini getir
export const getQuestionPackages = async (req: Request, res: Response) => {
    try {
        const packages = await QuestionPackage.find().populate('questions');
        res.status(200).json(packages);
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error fetching question packages', error });
        return;
    }
};