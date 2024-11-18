import { Request, Response } from "express";
import Question from "../models/questions.models";

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const createQuestion = async (req: Request, res: Response)=> {
  try {
    const { text, questionTime } = req.body;
    const question = await Question.create({ text, questionTime });
    
    res.status(201).json(question);
  } catch (error: any) {
    // Mongoose validasyon hatalarını yakalayıp frontend'e gönderiyoruz
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: errors });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, questionTime } = req.body;

    const question = await Question.findByIdAndUpdate(
      id,
      { text, questionTime },
      { new: true, runValidators: true } // Güncellenmiş veri üzerinde de validasyon çalışsın
    );

    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    res.status(200).json(question);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: errors });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
