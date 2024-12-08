import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID as string;

if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error('Missing required Twilio environment variables');
}

const client = twilio(accountSid, authToken);

export async function sendVerificationCode(phone: string): Promise<void> {
  try {
    await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phone, channel: 'sms' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw new Error('Failed to send verification code');
  }
}

export async function checkVerificationCode(
  phone: string,
  code: string
): Promise<boolean> {
  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phone, code });

    return verification.status === 'approved';
  } catch (error) {
    console.error('Error checking verification code:', error);
    throw new Error('Failed to check verification code');
  }
}
