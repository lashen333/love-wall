// src\app\api\couples\route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Couple from '@/lib/models/Couple';
import { generateSlug } from '@/utils/heartUtils';
import { uploadImageStream, generateThumbnailUrl, generateOptimizedUrl } from '@/lib/cloudinary';

const ph = (text: string, w = 800, h = 600) =>
  `https://placehold.co/${w}x${h}/ec4899/ffffff?text=${encodeURIComponent(text)}`;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status') || 'approved';

    const skip = (page - 1) * limit;

    // Oldest first to match UI label
    const couples = await Couple.find({ status })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const normalizedCouples = (couples as any[]).map((d) => ({
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
      data: normalizedCouples,
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

    const names = formData.get('names') as string;
    const photo = formData.get('photo') as File;
    const secretCode = formData.get('secretCode') as string;

    if (!names || !photo || !secretCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    // Upload
    let photoUrl = '';
    let thumbUrl = '';

    try {
      if (photo) {
        const arrayBuffer = await (photo as any).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const res = await uploadImageStream(buffer, { folder: 'wedding-photos' });

        if ((res as any).public_id) {
          const publicId = (res as any).public_id;
          photoUrl = generateOptimizedUrl(publicId);
          thumbUrl = generateThumbnailUrl(publicId, 400);
        } else {
          photoUrl = res.secure_url;
          thumbUrl = res.secure_url;
        }
      }

      const couple = new Couple({
        slug,
        names: names.trim(),
        weddingDate: formData.get('weddingDate') || null,
        country: formData.get('country') || null,
        story: formData.get('story') || null,
        // use placehold.co as safe fallback (not via.placeholder.com)
        photoUrl: photoUrl || ph(names, 800, 600),
        thumbUrl: thumbUrl || ph(names, 400, 400),
        secretCode,
        status: 'pending',
        paymentId: 'temp-payment-id',
      });

      await couple.save();

      const obj = couple.toObject({ virtuals: true });
      const normalized = {
        _id: obj._id ? String(obj._id) : '',
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

      return NextResponse.json({ success: true, data: normalized, message: 'Couple record created successfully' });
    } catch (err) {
      console.error('Error uploading to Cloudinary or saving couple:', err);
      return NextResponse.json({ success: false, error: 'Failed to upload image or save record' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating couple:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create couple record' },
      { status: 500 }
    );
  }
}
