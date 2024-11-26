import mongoose, { Schema, Document } from 'mongoose';

// Candidate interface'i
export interface ICandidate extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: 'pending' | 'passed' | 'failed';
    kvkk: boolean;
    videoUrl: string;
    result?: {
        transcription: string;
        analysis: {
            word_count: number;
            unique_words: number;
            keyword_hits: {
                technical: string[];
                soft_skills: string[];
            };
            question_similarity: {
                question: string;
                similarity: number;
            }[];
            total_score: number;
        };
        face_analysis: {
            age: number;
            gender: string;
            emotion: string;
        };
        emotion_analysis: {
            positive: number;
            neutral: number;
            negative: number;
        };
    };
}

// Candidate şeması
const CandidateSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/.+\@.+\..+/, 'Geçerli bir email adresi giriniz'],
        },
        phone: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ['pending', 'passed', 'failed'],
            default: 'pending',
            required: true,
        },
        kvkk: { type: Boolean, default: false },
        videoUrl: { type: String },
        result: {
            transcription: { type: String },
            analysis: {
                word_count: { type: Number },
                unique_words: { type: Number },
                keyword_hits: {
                    technical: [{ type: String }],
                    soft_skills: [{ type: String }]
                },
                question_similarity: [{
                    question: { type: String },
                    similarity: { type: Number }
                }],
                total_score: { type: Number }
            },
            face_analysis: {
                age: { type: Number },
                gender: { type: String },
                emotion: { type: String }
            },
            emotion_analysis: {
                positive: { type: Number, default: 0 },
                neutral: { type: Number, default: 0 },
                negative: { type: Number, default: 0 },
            }
        }
    },
    { timestamps: true }
);

// Candidate modelini oluşturma
const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;