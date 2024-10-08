import express from "express";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
} from "../controller/questionController";

const router = express.Router();

router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.post("/", createQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;
