import mongoose, { Schema, Document } from 'mongoose';

// Candidate interface'i
export interface ICandidate extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: 'pending' | 'passed' | 'failed'; // Mülakat durumu
    kvkk: boolean;
    videoUrl: string;
}

// Candidate şeması
const CandidateSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/.+\@.+\..+/, 'Geçerli bir email adresi giriniz'] // Email formatını doğrular
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['pending', 'passed', 'failed'], // Sadece bu üç değeri kabul eder
            default: 'pending', // Varsayılan olarak mülakat "pending" olur
            required: true
        },
        kvkk: {
            type: Boolean,
            default: false
        },
        videoUrl: {
            type: String,
            required: false
        },
    },
    { timestamps: true }
);

// Candidate modelini oluşturma
const Candidate = mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;