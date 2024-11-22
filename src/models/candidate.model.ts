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
        face_analysis: {
            age: number;
            gender: string;
            race: string;
            emotion: string;
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
            face_analysis: {
                age: { type: Number },
                gender: { type: String },
                race: { type: String },
                emotion: { type: String },
            },
        },
    },
    { timestamps: true }
);

// Candidate modelini oluşturma
const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;