import mongoose, { Schema, Document } from 'mongoose';

export interface IPendingSignup extends Document {
  email: string;
  otpHash: string;
  otpExpiresAt: Date;
  attempts: number;
  lastSentAt: Date;
  verified: boolean;
  setupToken?: string;
  setupTokenExpiresAt?: Date;
}

const PendingSignupSchema = new Schema<IPendingSignup>({
  email: { type: String, required: true, unique: true, lowercase: true },
  otpHash: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  setupToken: { type: String },
  setupTokenExpiresAt: { type: Date }
});

export const PendingSignupModel = mongoose.model<IPendingSignup>('PendingSignup', PendingSignupSchema);
