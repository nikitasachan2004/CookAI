import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import { authRouter } from './routes.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';
import { PendingSignupModel } from '../models/PendingSignup.js';
import { AccountModel } from '../models/Account.js';
import bcrypt from 'bcryptjs';

// Mock the email module so tests never hit the real Resend API
vi.mock('./email.js', () => ({
  sendOtpEmail: vi.fn().mockResolvedValue(undefined),
}));
import { sendOtpEmail } from './email.js';
const mockSendOtpEmail = vi.mocked(sendOtpEmail);

let mongoServer: MongoMemoryServer;
const app = express();
app.use(express.json());
// manual cookie parser for testing the me endpoint
app.use((req, res, next) => {
  (req as any).cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      (req as any).cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  }
  next();
});
app.use('/api/auth', authRouter);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth flows', () => {
  let setupToken: string;
  let jwtCookie: string;
  const testEmail = 'test@example.com';
  const testPassword = 'password123';

  it('signup creates a pending record', async () => {
    const res = await supertest(app)
      .post('/api/auth/signup')
      .send({ email: testEmail });
    expect(res.status).toBe(200);

    const pending = await PendingSignupModel.findOne({ email: testEmail });
    expect(pending).toBeDefined();
    expect(pending?.verified).toBe(false);
  });

  it('wrong OTP increments attempts and fails', async () => {
    const res = await supertest(app)
      .post('/api/auth/verify-otp')
      .send({ email: testEmail, code: '000000' });
    expect(res.status).toBe(400);

    const pending = await PendingSignupModel.findOne({ email: testEmail });
    expect(pending?.attempts).toBe(1);
  });

  it('correct OTP issues a setup token', async () => {
    // We need to bypass the email code or manually check the DB hash.
    // For test purposes, let's just override the hash in DB to match '123456'.
    const hash = await bcrypt.hash('123456', 10);
    await PendingSignupModel.updateOne({ email: testEmail }, { otpHash: hash });

    const res = await supertest(app)
      .post('/api/auth/verify-otp')
      .send({ email: testEmail, code: '123456' });
    
    expect(res.status).toBe(200);
    expect(res.body.setupToken).toBeDefined();
    setupToken = res.body.setupToken;

    const pending = await PendingSignupModel.findOne({ email: testEmail });
    expect(pending?.verified).toBe(true);
  });

  it('set-password creates a finalized account', async () => {
    const res = await supertest(app)
      .post('/api/auth/set-password')
      .send({ email: testEmail, setupToken, password: testPassword });
    
    expect(res.status).toBe(200);
    expect(res.body.userId).toBeDefined();
    
    // Cookie is set
    expect(res.headers['set-cookie']).toBeDefined();
    jwtCookie = res.headers['set-cookie'][0];

    // Pending record is gone
    const pending = await PendingSignupModel.findOne({ email: testEmail });
    expect(pending).toBeNull();

    // Account exists
    const account = await AccountModel.findOne({ email: testEmail });
    expect(account).toBeDefined();
  });

  it('duplicate signup for a registered email is rejected', async () => {
    const res = await supertest(app)
      .post('/api/auth/signup')
      .send({ email: testEmail });
    expect(res.status).toBe(409);
  });

  it('login fails on wrong password', async () => {
    const res = await supertest(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('login succeeds on correct password', async () => {
    const res = await supertest(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    jwtCookie = res.headers['set-cookie'][0]; // save for next test
  });

  it('/api/auth/me reflects session state correctly', async () => {
    const res = await supertest(app)
      .get('/api/auth/me')
      .set('Cookie', jwtCookie);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });

  it('/api/auth/me returns 401 if not logged in', async () => {
    const res = await supertest(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('sendOtpEmail integration', () => {
  const freshEmail = 'otp-integration@test.com';

  beforeEach(() => {
    mockSendOtpEmail.mockClear();
  });

  it('signup succeeds when sendOtpEmail resolves', async () => {
    mockSendOtpEmail.mockResolvedValueOnce(undefined);

    const res = await supertest(app)
      .post('/api/auth/signup')
      .send({ email: freshEmail });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockSendOtpEmail).toHaveBeenCalledOnce();
    expect(mockSendOtpEmail.mock.calls[0][0]).toBe(freshEmail);

    // Cleanup for next test
    await PendingSignupModel.deleteOne({ email: freshEmail });
  });

  it('signup returns 500 when sendOtpEmail rejects', async () => {
    mockSendOtpEmail.mockRejectedValueOnce(new Error('Failed to send OTP email: test error'));

    const res = await supertest(app)
      .post('/api/auth/signup')
      .send({ email: freshEmail });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to send verification email, please try again');

    // Cleanup
    await PendingSignupModel.deleteOne({ email: freshEmail });
  });
});
