// src\app\api\checkout\verify\route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Return payment details
    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        amount: session.amount_total,
        currency: session.currency,
        status: session.payment_status,
        customerEmail: session.customer_details?.email,
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

