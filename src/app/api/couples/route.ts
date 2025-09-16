// src\app\api\couples\route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Couple from '@/lib/models/Couple';
import { generateSlug } from '@/utils/heartUtils';
import { uploadImageStream, generateThumbnailUrl, generateOptimizedUrl } from '@/lib/cloudinary';

// Ensure Node runtime (Cloudinary SDK + Buffer need NodeJS, not Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ph = (text: string, w = 800, h = 600) =>
  `https://placehold.co/${w}x${h}/ec4899/ffffff?text=${encodeURIComponent(text)}`;

// ---------- GET ----------
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const status = searchParams.get('status') || 'approved';
    const skip = (page - 1) * limit;

    const couples = await Couple.find({ status })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const normalized = (couples as any[]).map((d) => ({
      _id: d._id ? String(d._id) : '',
      slug: d.slug,
      names: d.names,
      weddingDate: d.weddingDate ? new Date(d.weddingDate).toISOString() : null,
      country: d.country ?? null,
      story: d.story ?? null,
      photoUrl: d.photoUrl ?? '',
      thumbUrl: d.thumbUrl ?? '',
      secretCode: d.secretCode ?? '',
      status: d.status ?? 'pending',
      paymentId: d.paymentId ?? null,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
      updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
    }));

    const total = await Couple.countDocuments({ status });

    return NextResponse.json({
      success: true,
      data: normalized,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching couples:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch couples' }, { status: 500 });
  }
}

// ---------- POST ----------
export async function POST(request: NextRequest) {
  try {
    // Strict env validation (empty strings count as missing)
    const needed = ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const;
    const missing = needed.filter((k) => !process.env[k] || String(process.env[k]).trim() === '');
    if (missing.length) {
      console.error('Missing envs:', missing.join(', '));
      return NextResponse.json(
        { success: false, error: `Server misconfigured: ${missing.join(', ')}` },
        { status: 500 }
      );
    }

    await dbConnect();

    const formData = await request.formData();
    const names = (formData.get('names') as string | null)?.trim() || '';
    const photo = formData.get('photo') as File | null;
    const secretCode = (formData.get('secretCode') as string | null)?.trim() || '';

    if (!names || !photo || !secretCode) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Body limit guard (Vercel Node ~4.5–5 MB)
    const MAX_BYTES = 4_500_000;
    if (photo.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Image too large. Please upload a photo under ~4.5 MB.' },
        { status: 413 }
      );
    }

    // Unique slug retry
    let slug = generateSlug(names);
    for (let i = 0; i < 10; i++) {
      const exists = await Couple.findOne({ slug }).lean();
      if (!exists) break;
      slug = generateSlug(names);
      if (i === 9) {
        return NextResponse.json(
          { success: false, error: 'Failed to generate unique slug' },
          { status: 500 }
        );
      }
    }

    // Upload to Cloudinary with improved error handling
    let photoUrl = '';
    let thumbUrl = '';

    try {
      console.log('📤 Processing uploaded file...', {
        fileName: photo.name,
        fileSize: photo.size,
        fileType: photo.type
      });

      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log('📤 Buffer created, uploading to Cloudinary...', {
        bufferLength: buffer.length
      });

      // Use the improved upload function
      const uploadResult = await uploadImageStream(buffer, { 
        folder: 'wedding-photos'
      });

      if (uploadResult.public_id) {
        photoUrl = generateOptimizedUrl(uploadResult.public_id);
        thumbUrl = generateThumbnailUrl(uploadResult.public_id, 400);
        
        console.log('✅ Upload successful:', {
          publicId: uploadResult.public_id,
          photoUrl: photoUrl.substring(0, 60) + '...',
          thumbUrl: thumbUrl.substring(0, 60) + '...'
        });
      } else if (uploadResult.secure_url) {
        // Fallback to direct URL if no public_id
        photoUrl = uploadResult.secure_url;
        thumbUrl = uploadResult.secure_url;
        
        console.log('✅ Upload successful (direct URL):', {
          url: photoUrl.substring(0, 60) + '...'
        });
      } else {
        throw new Error('Upload returned no secure_url/public_id');
      }

    } catch (uploadError: any) {
      console.error('❌ Upload failed, using placeholder images:', {
        error: uploadError.message,
        http_code: uploadError.http_code,
        name: uploadError.name
      });
      
      // Use placeholder images as fallback so the app doesn't break
      photoUrl = ph(names, 800, 600);
      thumbUrl = ph(names, 400, 400);
      
      console.log('🔄 Using placeholders:', { photoUrl, thumbUrl });
      
      // Note: We're not returning an error here anymore, just using placeholders
      // If you want to fail the upload instead, uncomment the lines below:
      // return NextResponse.json(
      //   { success: false, error: `Upload failed: ${uploadError?.message || 'cloud storage error'}` },
      //   { status: 500 }
      // );
    }

    // Save record
    try {
      const couple = await Couple.create({
        slug,
        names,
        weddingDate: formData.get('weddingDate') || null,
        country: formData.get('country') || null,
        story: formData.get('story') || null,
        photoUrl: photoUrl || ph(names, 800, 600),
        thumbUrl: thumbUrl || ph(names, 400, 400),
        secretCode,
        status: 'pending',
        paymentId: 'temp-payment-id',
      });

      const obj: any = couple.toObject({ virtuals: true });
      const normalized = {
        _id: String(obj._id ?? ''),
        slug: obj.slug,
        names: obj.names,
        weddingDate: obj.weddingDate ? new Date(obj.weddingDate).toISOString() : null,
        country: obj.country ?? null,
        story: obj.story ?? null,
        photoUrl: obj.photoUrl ?? '',
        thumbUrl: obj.thumbUrl ?? '',
        secretCode: obj.secretCode ?? '',
        status: obj.status ?? 'pending',
        paymentId: obj.paymentId ?? null,
        createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : null,
        updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : null,
      };

      return NextResponse.json({ success: true, data: normalized });
    } catch (e: any) {
      console.error('DB save failed:', e?.message || e);
      return NextResponse.json({ success: false, error: 'Database save failed.' }, { status: 500 });
    }
  } catch (e: any) {
    console.error('Unexpected error:', e?.message || e);
    return NextResponse.json({ success: false, error: 'Failed to create couple record' }, { status: 500 });
  }
}