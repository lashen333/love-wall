// src\app\api\couples\route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Couple from '@/lib/models/Couple';
import { generateSlug } from '@/utils/heartUtils';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status') || 'approved';
    
    const skip = (page - 1) * limit;
    
    // Get approved couples for display
    const couples = await Couple.find({ status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Couple.countDocuments({ status });
    
    return NextResponse.json({
      success: true,
      data: couples,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching couples:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch couples' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    
    // Validate required fields
    const names = formData.get('names') as string;
    const photo = formData.get('photo') as File;
    const secretCode = formData.get('secretCode') as string;
    
    if (!names || !photo || !secretCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate unique slug
    let slug = generateSlug(names);
    let attempts = 0;
    
    while (attempts < 10) {
      const existing = await Couple.findOne({ slug });
      if (!existing) break;
      
      slug = generateSlug(names);
      attempts++;
    }
    
    if (attempts >= 10) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique slug' },
        { status: 500 }
      );
    }
    
    // For now, we'll use placeholder URLs
    // In production, you'd upload to Cloudinary/S3 here
    const photoUrl = `https://via.placeholder.com/800x600/ec4899/ffffff?text=${encodeURIComponent(names)}`;
    const thumbUrl = `https://via.placeholder.com/400x400/ec4899/ffffff?text=${encodeURIComponent(names)}`;
    
    // Create couple record
    const couple = new Couple({
      slug,
      names: names.trim(),
      weddingDate: formData.get('weddingDate') || null,
      country: formData.get('country') || null,
      story: formData.get('story') || null,
      photoUrl,
      thumbUrl,
      secretCode,
      status: 'pending',
      paymentId: 'temp-payment-id', // Will be updated when payment is confirmed
    });
    
    await couple.save();
    
    return NextResponse.json({
      success: true,
      data: couple,
      message: 'Couple record created successfully',
    });
  } catch (error) {
    console.error('Error creating couple:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create couple record' },
      { status: 500 }
    );
  }
}

