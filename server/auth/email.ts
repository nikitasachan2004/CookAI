import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? 'onboarding@resend.dev';

const resend = apiKey ? new Resend(apiKey) : null;

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  if (!resend) {
    console.log(`[dev] OTP for ${email}: ${code}`);
    return;
  }

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: 'Your COOKAI verification code',
    html: `<p>Your COOKAI verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  });

  if (error) {
    console.error('Resend send failed:', error);
    throw new Error(`Failed to send OTP email: ${error.message ?? 'unknown error'}`);
  }

  console.log('OTP email sent:', data?.id);
}
