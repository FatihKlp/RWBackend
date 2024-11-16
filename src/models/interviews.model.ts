import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IInterview extends Document {
    title: string;
    candidate: mongoose.Types.ObjectId[];
    questionPackage: mongoose.Types.ObjectId[];
    interviewLink: string;
    publish: boolean;
    expireDate: Date; // Mülakatın bitiş tarihi
}

const interviewSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },  // Mülakat başlığı
    candidate: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: false }],
    questionPackage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPackage', required: true }],
    interviewLink: {
        type: String,
        default: uuidv4,  // Her mülakata rastgele bir link atıyoruz
        unique: true
    },
    publish: { type: Boolean, default: false },  // Mülakat yayınlandımi
    expireDate: { type: Date, required: true }  // Mülakat bitiş tarihi
}, { timestamps: true });

const Interview = mongoose.model<IInterview>('Interview', interviewSchema);

export default Interview;