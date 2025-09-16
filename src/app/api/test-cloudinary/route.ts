// src\app\api\test-cloudinary\route.ts
// Create: src/app/api/test-cloudinary/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  try {
    // Show what we have (without exposing secrets)
    const envStatus = {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? `SET (${process.env.CLOUDINARY_CLOUD_NAME})` : 'MISSING',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? `SET (${process.env.CLOUDINARY_API_KEY?.substring(0, 4)}...)` : 'MISSING',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? `SET (${process.env.CLOUDINARY_API_SECRET?.substring(0, 4)}...)` : 'MISSING',
    };

    console.log('Testing Cloudinary with env:', envStatus);

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    // Test 1: Simple ping
    console.log('Test 1: Ping...');
    const pingResult = await cloudinary.api.ping();
    console.log('Ping successful:', pingResult);

    // Test 2: List resources (should work if credentials are correct)
    console.log('Test 2: List resources...');
    const resources = await cloudinary.api.resources({ 
      resource_type: 'image', 
      max_results: 1 
    });
    console.log('Resources list successful, count:', resources.resources.length);

    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful!',
      envStatus,
      tests: {
        ping: 'SUCCESS',
        listResources: 'SUCCESS'
      },
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });

  } catch (error: any) {
    console.error('Cloudinary test failed:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
      error: error.error,
      stack: error.stack?.substring(0, 300)
    });

    return NextResponse.json({
      success: false,
      message: 'Cloudinary connection failed',
      error: error.message,
      details: {
        http_code: error.http_code,
        name: error.name,
        error: error.error
      },
      envStatus: {
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
      }
    }, { status: 500 });
  }
}