import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';

const webhookSecret = process.env.POLAR_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature')!; // Polar header
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(body).digest('hex');
    
    if (signature !== digest) {
      console.error('Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }
    
    const event = JSON.parse(body);
    
    await dbConnect();
    
    // Handle the event
    switch (event.type) {
      case 'order.created':
        await handleOrderCreated(event.data);
        break;
      
      case 'order.paid':
        await handleOrderPaid(event.data);
        break;
      
      case 'order.refunded':
        await handleOrderRefunded(event.data);
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

async function handleOrderCreated(order: any) {
  try {
    const payment = await Payment.findOneAndUpdate(
      { polarSessionId: order.checkout_id }, // Use checkout_id or order.id
      {
        polarSessionId: order.checkout_id,
        amount: order.amount || 0,
        currency: order.currency || 'usd',
        status: 'created',
        metadata: order.metadata || {},
      },
      { upsert: true, new: true }
    );
    
    console.log(`Order created: ${order.id}`);
  } catch (error) {
    console.error('Error handling order created:', error);
  }
}

async function handleOrderPaid(order: any) {
  try {
    await Payment.findOneAndUpdate(
      { polarSessionId: order.checkout_id },
      { status: 'paid' }
    );
    
    console.log(`Order paid: ${order.id}`);
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
}

async function handleOrderRefunded(order: any) {
  try {
    await Payment.findOneAndUpdate(
      { polarSessionId: order.checkout_id },
      { status: 'refunded' } // Add 'refunded' to your enum if needed
    );
    
    console.log(`Order refunded: ${order.id}`);
  } catch (error) {
    console.error('Error handling order refunded:', error);
  }
}