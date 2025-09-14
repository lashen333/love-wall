// src\components\photo-album\StoryDialog.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, ExternalLink } from 'lucide-react';
import type { Couple } from '@/types';

const PLACEHOLDER =
  'https://placehold.co/1200x1600/ec4899/ffffff?text=Image+Unavailable';

const bestSrc = (c?: Couple) =>
  (c?.thumbUrl && String(c.thumbUrl)) ||
  (c?.photoUrl && String(c.photoUrl)) ||
  PLACEHOLDER;

export default function StoryDialog({ couple, onClose }: { couple: Couple; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const img = bestSrc(couple);

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm grid place-items-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="bg-black md:h-full max-h-[40vh] md:max-h-none">
            <img
              src={img}
              alt={couple.names}
              loading="eager"
              decoding="async"
              crossOrigin="anonymous"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Story */}
          <div className="p-4 md:p-6 max-h-[70vh] md:max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg md:text-xl font-semibold text-neutral-900">
              {couple.names}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {couple.weddingDate && (
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-rose-50 text-rose-700">
                  {new Date(couple.weddingDate).toLocaleDateString()}
                </span>
              )}
              {couple.country && (
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-rose-50 text-rose-700">
                  {couple.country}
                </span>
              )}
              <Link
                href={`/album/${encodeURIComponent(couple.slug)}`}
                className="ml-auto rounded-full bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 hover:bg-rose-700 inline-flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                View page
              </Link>
            </div>

            {couple.story && (
              <blockquote className="mt-4 text-[15px] md:text-base leading-7 text-neutral-800 whitespace-pre-line">
                <p>{couple.story}</p>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
