import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IInterview extends Document {
    title: string;
    candidate: mongoose.Types.ObjectId[];
    questionPackage: mongoose.Types.ObjectId[];
    interviewLink: string;
    publish: boolean;
    expireDate: Date;
    requirements: {
        keywords: {
            technical: string[];   // Teknik anahtar kelimeler
            softSkills: string[];  // Soft skills anahtar kelimeler
        };
        languageMetrics: {
            minWordCount: number;    // Minimum kelime sayısı
            targetDiversity: number; // Hedef kelime çeşitliliği
        };
    };
}

const interviewSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    candidate: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: false }],
    questionPackage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPackage', required: true }],
    interviewLink: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    publish: { type: Boolean, default: false },
    expireDate: { type: Date, required: true },
    requirements: {
        keywords: {
            technical: { type: [String], default: [] },
            softSkills: { type: [String], default: [] },
        },
        languageMetrics: {
            minWordCount: { type: Number, default: 0 },
            targetDiversity: { type: Number, default: 0 },
        },
    },
}, { timestamps: true });

const Interview = mongoose.model<IInterview>('Interview', interviewSchema);

export default Interview;