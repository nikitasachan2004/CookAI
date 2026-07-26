import nodemailer from 'nodemailer';
import 'dotenv/config';

export async function sendOtpEmail(email: string, code: string) {
  if (!process.env.SMTP_HOST) {
    console.log(`\n============================`);
    console.log(`[DEV EMAIL] To: ${email}`);
    console.log(`[DEV EMAIL] OTP: ${code}`);
    console.log(`============================\n`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'COOKAI <no-reply@cookai.app>',
    to: email,
    subject: 'Your CookAI Verification Code',
    text: `Your verification code is: ${code}. It expires in 10 minutes.`,
    html: `<p>Your verification code is: <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  });
}
