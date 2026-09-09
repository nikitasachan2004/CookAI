import { Resend } from 'resend';
import 'dotenv/config';

export async function sendOtpEmail(email: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n============================`);
    console.log(`[DEV EMAIL] To: ${email}`);
    console.log(`[DEV EMAIL] OTP: ${code}`);
    console.log(`============================\n`);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'CookAI <no-reply@cookai.app>',
      to: email,
      subject: 'Your CookAI Verification Code',
      text: `Your verification code is: ${code}. It expires in 10 minutes.`,
      html: `<p>Your verification code is: <strong>${code}</strong>. It expires in 10 minutes.</p>`,
    });

    if (error) {
      console.error('[Resend] Failed to send email:', error);
      console.log(`\n============================`);
      console.log(`[DEV FALLBACK] To: ${email}`);
      console.log(`[DEV FALLBACK] OTP: ${code}`);
      console.log(`============================\n`);
    }
  } catch (err) {
    console.error('[Resend] Network/request error:', err);
    console.log(`\n============================`);
    console.log(`[DEV FALLBACK] To: ${email}`);
    console.log(`[DEV FALLBACK] OTP: ${code}`);
    console.log(`============================\n`);
  }
}
