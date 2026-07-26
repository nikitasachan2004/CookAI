import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const AccountModel = mongoose.model<IAccount>('Account', AccountSchema);
