import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AccountModel } from '../models/Account.js';
import { PendingSignupModel } from '../models/PendingSignup.js';
import { sendOtpEmail } from './email.js';

export const authRouter = Router();

const rateLimits = new Map<string, { count: number; windowStart: number }>();
const RL_WINDOW_MS = 60 * 1000;
const RL_MAX_ATTEMPTS = 5;

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  let record = rateLimits.get(email);
  if (!record || now - record.windowStart > RL_WINDOW_MS) {
    rateLimits.set(email, { count: 1, windowStart: now });
    return true;
  }
  if (record.count >= RL_MAX_ATTEMPTS) {
    return false;
  }
  record.count++;
  return true;
}

const emailSchema = z.object({ email: z.string().email().toLowerCase() });
const otpSchema = z.object({ email: z.string().email().toLowerCase(), code: z.string().length(6) });
const passwordSchema = z.object({
  email: z.string().email().toLowerCase(),
  setupToken: z.string(),
  password: z.string().min(8)
});
const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string()
});

authRouter.post('/signup', async (req, res) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid email.' });
  const { email } = parsed.data;

  if (!checkRateLimit(email)) return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });

  const existingAccount = await AccountModel.findOne({ email });
  if (existingAccount) return res.status(409).json({ error: 'Account already exists for this email.' });

  let pending = await PendingSignupModel.findOne({ email });
  const now = new Date();
  
  if (pending && now.getTime() - pending.lastSentAt.getTime() < 60000) {
    return res.status(429).json({ error: 'Please wait 60 seconds before requesting another code.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(code, 10);
  const otpExpiresAt = new Date(now.getTime() + 10 * 60000);

  if (pending) {
    pending.otpHash = otpHash;
    pending.otpExpiresAt = otpExpiresAt;
    pending.attempts = 0;
    pending.lastSentAt = now;
    pending.verified = false;
    pending.setupToken = undefined;
    pending.setupTokenExpiresAt = undefined;
    await pending.save();
  } else {
    await PendingSignupModel.create({
      email,
      otpHash,
      otpExpiresAt,
      lastSentAt: now,
      verified: false
    });
  }

  await sendOtpEmail(email, code);
  res.status(200).json({ success: true });
});

authRouter.post('/resend-otp', async (req, res) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid email.' });
  const { email } = parsed.data;

  if (!checkRateLimit(email)) return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });

  let pending = await PendingSignupModel.findOne({ email });
  if (!pending) return res.status(400).json({ error: 'No pending signup found.' });

  const now = new Date();
  if (now.getTime() - pending.lastSentAt.getTime() < 60000) {
    return res.status(429).json({ error: 'Please wait 60 seconds before requesting another code.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(code, 10);
  
  pending.otpHash = otpHash;
  pending.otpExpiresAt = new Date(now.getTime() + 10 * 60000);
  pending.attempts = 0;
  pending.lastSentAt = now;
  await pending.save();

  await sendOtpEmail(email, code);
  res.status(200).json({ success: true });
});

authRouter.post('/verify-otp', async (req, res) => {
  const parsed = otpSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request.' });
  const { email, code } = parsed.data;

  const pending = await PendingSignupModel.findOne({ email });
  if (!pending) return res.status(400).json({ error: 'No pending signup found.' });

  if (pending.attempts >= 5) return res.status(429).json({ error: 'Too many failed attempts. Please request a new code.' });
  
  const now = new Date();
  if (now > pending.otpExpiresAt) return res.status(400).json({ error: 'OTP has expired.' });

  const match = await bcrypt.compare(code, pending.otpHash);
  if (!match) {
    pending.attempts++;
    await pending.save();
    return res.status(400).json({ error: 'Incorrect code.' });
  }

  pending.verified = true;
  pending.setupToken = crypto.randomBytes(32).toString('hex');
  pending.setupTokenExpiresAt = new Date(now.getTime() + 15 * 60000);
  await pending.save();

  res.status(200).json({ setupToken: pending.setupToken });
});

authRouter.post('/set-password', async (req, res) => {
  const parsed = passwordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request (password min 8 chars).' });
  const { email, setupToken, password } = parsed.data;

  const pending = await PendingSignupModel.findOne({ email });
  if (!pending || !pending.verified || pending.setupToken !== setupToken) {
    return res.status(400).json({ error: 'Invalid or missing setup token.' });
  }

  const now = new Date();
  if (!pending.setupTokenExpiresAt || now > pending.setupTokenExpiresAt) {
    return res.status(400).json({ error: 'Setup token has expired.' });
  }

  const existingAccount = await AccountModel.findOne({ email });
  if (existingAccount) return res.status(409).json({ error: 'Account already exists.' });

  const passwordHash = await bcrypt.hash(password, 10);
  const account = await AccountModel.create({ email, passwordHash });

  await PendingSignupModel.deleteOne({ email });

  const token = jwt.sign({ userId: account._id, email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 3600000 });
  
  res.status(200).json({ userId: account._id, email });
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request.' });
  const { email, password } = parsed.data;

  if (!checkRateLimit(email)) return res.status(429).json({ error: 'Too many login attempts.' });

  const account = await AccountModel.findOne({ email });
  if (!account) return res.status(401).json({ error: 'Invalid email or password.' });

  const match = await bcrypt.compare(password, account.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

  const token = jwt.sign({ userId: account._id, email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  res.cookie('jwt', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 3600000 });
  
  res.status(200).json({ userId: account._id, email });
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(204).end();
});

authRouter.get('/me', (req, res) => {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).json({ error: 'Not logged in.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    res.status(200).json({ userId: payload.userId, email: payload.email });
  } catch (err) {
    res.status(401).json({ error: 'Invalid session.' });
  }
});
