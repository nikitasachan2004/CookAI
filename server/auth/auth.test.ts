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

  it('signup creates a finalized account and logs in directly', async () => {
    const res = await supertest(app)
      .post('/api/auth/signup')
      .send({ email: testEmail, password: testPassword });
    expect(res.status).toBe(200);
    expect(res.body.userId).toBeDefined();

    // Cookie is set
    expect(res.headers['set-cookie']).toBeDefined();
    jwtCookie = res.headers['set-cookie'][0];

    // Account exists
    const account = await AccountModel.findOne({ email: testEmail });
    expect(account).toBeDefined();
  });

  it('duplicate signup for a registered email is rejected', async () => {
    const res = await supertest(app)
      .post('/api/auth/signup')
      .send({ email: testEmail, password: 'anotherpassword123' });
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
