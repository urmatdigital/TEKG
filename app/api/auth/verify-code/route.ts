import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import twilio from 'twilio'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(request: Request) {
  try {
    const { phoneNumber, code } = await request.json()

    // Проверяем код через Twilio Verify
    try {
      const verificationCheck = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verificationChecks
        .create({ to: phoneNumber, code })

      if (verificationCheck.status !== 'approved') {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 400 }
        )
      }
    } catch (twilioError) {
      console.error('Twilio verification check error:', twilioError)
      return NextResponse.json(
        { error: 'Failed to verify code' },
        { status: 500 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Обновляем статус верификации пользователя
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ phone_verified: true })
      .eq('phone', phoneNumber)

    if (updateError) {
      console.error('Error updating user verification status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update verification status' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Phone number verified successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error during verification:', error)
    return NextResponse.json(
      { error: 'Internal server error during verification' },
      { status: 500 }
    )
  }
} 