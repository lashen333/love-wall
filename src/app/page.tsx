// src\app\page.tsx
import type { Couple } from '@/types';
import HomePageClient from './HomePageClient';

async function getCouples(): Promise<Couple[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL ??
    'http://localhost:3000';

  const res = await fetch(
    `${baseUrl}/api/couples?status=approved&limit=100`,
    { cache: 'no-store' }
  );

  const json = await res.json();
  return json?.data ?? [];
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const couples = await getCouples();
  return <HomePageClient initialCouples={couples} searchParams={searchParams} />;
}
