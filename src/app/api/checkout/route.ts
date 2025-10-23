import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Amount is fixed in Polar product, so no need for body amount (remove if not custom)
    const { } = await request.json(); // If you add custom data later, parse here
    
    // Create Polar checkout session
    const response = await fetch('https://api.polar.sh/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        products: [process.env.POLAR_PRODUCT_ID], // Your $1 product ID
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_ID}`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}`, // For cancel/back
        metadata: {
          product: 'photo_wall_submission',
          // Add more if needed, e.g., user details
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    const session = await response.json();
    
    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}