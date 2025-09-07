// src\app\album\[slug]\page.tsx
import React from 'react';
import dbConnect from '@/lib/mongodb';
import Couple from '@/lib/models/Couple';
import ShareCard from '@/components/ShareCard';

type Props = {
  params: { slug: string };
};

export default async function AlbumPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug || '');
  await dbConnect();
  const couple = (await Couple.findOne({ slug }).lean()) as any | null;

  if (!couple) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Album not found</h2>
        <p className="text-gray-500">We couldn't find that couple.</p>
      </div>
    );
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/album/${encodeURIComponent(slug)}`;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{couple.names}</h1>
        <p className="text-sm text-gray-600 mb-4">{couple.country} • {couple.weddingDate ? new Date(couple.weddingDate).toLocaleDateString() : ''}</p>

        <div className="mb-6">
          <img src={couple.photoUrl || couple.thumbUrl} alt={couple.names} className="w-full h-auto rounded-lg object-cover" />
        </div>

        <div className="mb-6">
          <p className="text-gray-700">{couple.story}</p>
        </div>

        <ShareCard title={couple.names} text={couple.story || ''} url={url} />
      </div>
    </div>
  );
}
