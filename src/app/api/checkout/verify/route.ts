import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Polar.sh
    const response = await fetch(`https://api.polar.sh/v1/checkouts/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    const session = await response.json();

    // Check if payment was successful
    if (session.status !== 'succeeded') {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Return payment details (adapt to Polar's response fields)
    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        amount: session.total_amount, // In cents
        currency: session.currency,
        status: session.status,
        customerEmail: session.customer_email,
      },
    });

  } catch (error) {
    console.error('Error verifying payment session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment session' },
      { status: 500 }
    );
  }
}