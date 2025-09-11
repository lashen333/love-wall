// src\app\page.tsx
import type { Couple } from '@/types';
import HomePageClient from './HomePageClient';
import dbConnect from '@/lib/mongodb';
import CoupleModel from '@/lib/models/Couple';

async function getCouples(): Promise<Couple[]> {
  await dbConnect();
  const docs = await CoupleModel.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  // Normalize to plain objects (stringify ObjectId and Dates) so they can be
  // safely sent from a Server Component into a Client Component props.
  const normalized = (docs as any[]).map((d) => ({
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
  })) as unknown as Couple[];

  return normalized;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const couples = await getCouples();
  return <HomePageClient initialCouples={couples} searchParams={searchParams} />;
}
