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
  return (docs as unknown) as Couple[];
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const couples = await getCouples();
  return <HomePageClient initialCouples={couples} searchParams={searchParams} />;
}
