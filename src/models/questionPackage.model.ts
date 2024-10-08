import mongoose, { Schema, Document } from 'mongoose';

// Sorupaketi interface'i
export interface IQuestionPackage extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    questions: mongoose.Types.ObjectId[];
}

// Sorupaketi şeması
const questionPackageSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }]
}, { timestamps: true });

// Sorupaketi modelinin oluşturulması
const QuestionPackage = mongoose.model<IQuestionPackage>('QuestionPackage', questionPackageSchema);

export default QuestionPackage;