import mongoose, { Schema, Document } from 'mongoose';

// User interface'i
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: 'pending' | 'passed' | 'failed'; // Mülakat durumu
    kvkk: boolean;
}

// User şeması
const UserSchema: Schema = new Schema(
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
        }
    },
    { timestamps: true }
);

// User modelini oluşturma
const User = mongoose.model<IUser>('User', UserSchema);

export default User;