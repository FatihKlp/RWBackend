import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IInterview extends Document {
    title: string;
    user: mongoose.Types.ObjectId;
    questionPackage: mongoose.Types.ObjectId[]; // Soru Paketi referansı
    videoUrl: string;
    interviewLink: string;
    expireDate: Date; // Mülakatın bitiş tarihi
}

const interviewSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },  // Mülakat başlığı
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionPackage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionPackage', required: true }],
    videoUrl: { type: String },  // Kullanıcı video kaydı yapacak
    interviewLink: { 
        type: String, 
        default: uuidv4,  // Her mülakata rastgele bir link atıyoruz
        unique: true 
    },
    expireDate: { type: Date, required: true }  // Mülakat bitiş tarihi
}, { timestamps: true });

const Interview = mongoose.model<IInterview>('Interview', interviewSchema);

export default Interview;