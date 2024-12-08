import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    
    // Call the backend API to initiate registration
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to send code' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the bot URL for redirection
    return NextResponse.json({
      success: true,
      botUrl: 'https://t.me/tulpar_express_bot?start=' + data.token,
    });
  } catch (error) {
    console.error('Error sending code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
