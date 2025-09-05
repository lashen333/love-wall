// src\app\api\webhook\stripe\route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    // Create or update payment record
    const payment = await Payment.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        stripeSessionId: session.id,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'paid',
        metadata: session.metadata || {},
      },
      { upsert: true, new: true }
    );
    
    console.log(`Payment completed for session ${session.id}: ${payment.amount} ${payment.currency}`);
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update payment status if needed
    await Payment.findOneAndUpdate(
      { stripeSessionId: paymentIntent.metadata?.session_id },
      { status: 'paid' }
    );
    
    console.log(`Payment intent succeeded: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update payment status
    await Payment.findOneAndUpdate(
      { stripeSessionId: paymentIntent.metadata?.session_id },
      { status: 'failed' }
    );
    
    console.log(`Payment intent failed: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

