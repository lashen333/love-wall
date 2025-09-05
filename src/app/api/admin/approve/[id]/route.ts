// src\app\api\admin\approve\[id]\route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Couple from '@/lib/models/Couple';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simple password protection
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const couple = await Couple.findByIdAndUpdate(
      params.id,
      { status: 'approved' },
      { new: true }
    );
    
    if (!couple) {
      return NextResponse.json(
        { success: false, error: 'Couple not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: couple,
      message: 'Couple approved successfully',
    });
  } catch (error) {
    console.error('Error approving couple:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve couple' },
      { status: 500 }
    );
  }
}

