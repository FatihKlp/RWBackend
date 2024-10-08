import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionTime {
  minutes: number;
  seconds: number;
}

export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  text: string;
  questionTime: IQuestionTime;
}

const QuestionSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      maxlength: [500, "Question text cannot be more than 500 characters"],
    },
    questionTime: {
      minutes: {
        type: Number,
        required: [true, "Minutes are required"],
        min: [0, "Minutes must be at least 0"],
        max: [59, "Minutes must be at most 59"],
      },
      seconds: {
        type: Number,
        required: [true, "Seconds are required"],
        min: [0, "Seconds must be at least 0"],
        max: [59, "Seconds must be at most 59"],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
