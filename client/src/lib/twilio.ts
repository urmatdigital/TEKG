import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendVerificationCode(phoneNumber: string) {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID!)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
    
    return { success: true, sid: verification.sid };
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw new Error('Failed to send verification code');
  }
}

export async function checkVerificationCode(phoneNumber: string, code: string) {
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID!)
      .verificationChecks.create({ to: phoneNumber, code });

    return { success: verificationCheck.status === 'approved' };
  } catch (error) {
    console.error('Error verifying code:', error);
    throw new Error('Failed to verify code');
  }
}
