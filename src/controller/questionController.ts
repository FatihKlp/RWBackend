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
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { text, questionTime } = req.body;
    const question = await Question.create({ text, questionTime });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, dedicatedTime } = req.body;
    const question = await Question.findByIdAndUpdate(
      id,
      { text, dedicatedTime },
      { new: true }
    );
    res.status(200).json(question);
  } catch (error) {
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
