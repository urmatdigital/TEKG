import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json()
    
    // Ensure phone number is in E.164 format
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`

    const { data, error } = await supabase.auth.signUp({
      phone: formattedPhone,
      password,
      options: {
        data: {
          phone_verified: false,
        },
      },
    })

    if (error) {
      console.error('Error creating auth user:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 