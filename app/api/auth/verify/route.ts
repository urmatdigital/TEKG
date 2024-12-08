import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { phone, token } = await request.json()
    
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    })

    if (error) {
      console.error('Verification error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { message: 'Phone verified successfully', data },
      { status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 