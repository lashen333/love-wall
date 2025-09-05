// src\app\api\couples\remove\route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Couple from '@/lib/models/Couple';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { names, secretCode, reason } = await request.json();
    
    // Validate required fields
    if (!names || !secretCode) {
      return NextResponse.json(
        { success: false, error: 'Names and secret code are required' },
        { status: 400 }
      );
    }
    
    // Find couple by names and secret code
    const couple = await Couple.findOne({
      names: names.trim(),
      secretCode: secretCode.trim(),
    });
    
    if (!couple) {
      return NextResponse.json(
        { success: false, error: 'Invalid names or secret code' },
        { status: 404 }
      );
    }
    
    // Log removal reason if provided
    if (reason) {
      console.log(`Photo removal requested for ${couple.names}: ${reason}`);
    }
    
    // Delete the couple record
    await Couple.findByIdAndDelete(couple._id);
    
    return NextResponse.json({
      success: true,
      message: 'Photo removed successfully',
    });
  } catch (error) {
    console.error('Error removing couple photo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove photo' },
      { status: 500 }
    );
  }
}


