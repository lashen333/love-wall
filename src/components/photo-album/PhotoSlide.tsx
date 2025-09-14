// src\components\photo-album\PhotoSlide.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Share2 } from 'lucide-react';
import type { Couple } from '@/types';
import ShareMenu from './ShareMenu';

const PLACEHOLDER =
    'https://placehold.co/1200x1600/ec4899/ffffff?text=Image+Unavailable';

const bestSrc = (c?: Couple) =>
    (c?.thumbUrl && String(c.thumbUrl)) ||
    (c?.photoUrl && String(c.photoUrl)) ||
    PLACEHOLDER;

export default function PhotoSlide({
    couple,
    onOpenStory,
}: {
    couple: Couple;
    onOpenStory: () => void;
}) {
    const src = bestSrc(couple);
    const big = (couple.photoUrl && String(couple.photoUrl)) || src;
    const hasStory = !!(couple.story && couple.story.trim().length > 0);

    const [shareOpen, setShareOpen] = useState(false);

    const pageUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/album/${encodeURIComponent(couple.slug)}`
            : `/album/${encodeURIComponent(couple.slug)}`;

    const shareText = `${couple.names} on the World's Biggest Love Album`;

    const doShare = async () => {
        try {
            if (typeof navigator !== 'undefined' && (navigator as any).share) {
                await (navigator as any).share({ title: couple.names, text: shareText, url: pageUrl });
            } else {
                setShareOpen((v) => !v);
            }
        } catch { }
    };

    return (
        <figure className="relative h-full">
            {/* IMAGE area */}
            <div className="absolute inset-0 flex items-center justify-center pb-28 md:pb-32">
                {/* background blur backfill */}
                <img
                    src={src}
                    alt=""
                    aria-hidden
                    crossOrigin="anonymous"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover blur-[18px] scale-110 opacity-40"
                />
                {/* main image */}
                <img
                    src={big}
                    alt={couple.names}
                    loading="eager"
                    decoding="async"
                    crossOrigin="anonymous"
                    className="relative z-10 max-h-full max-w-full object-contain"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                    }}
                />
            </div>

            {/* BANNER — overlay at bottom of image, always tappable */}
            <div className="absolute left-4 right-4 bottom-4 md:left-8 md:right-8 md:bottom-6 z-30">
                <div className="rounded-2xl shadow-xl bg-white/90 backdrop-blur-md ring-1 ring-black/5 px-3 py-2 md:px-5 md:py-4 max-w-[min(92vw,1024px)] mx-auto">
                    <div className="flex items-start justify-between gap-2 md:gap-3">
                        <div className="min-w-0">
                            <div className="font-semibold text-sm md:text-lg text-neutral-900 truncate">
                                {couple.names}
                            </div>
                            <div className="mt-4 flex  items-center gap-2 whitespace-nowrap">
                                {couple.weddingDate && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] md:text-[11px] bg-rose-50 text-rose-700">
                                        {new Date(couple.weddingDate).toLocaleDateString()}
                                    </span>
                                )}
                                {couple.country && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] md:text-[11px] bg-rose-50 text-rose-700">
                                        {couple.country}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5 md:gap-2">
                            <Link
                                href={`/album/${encodeURIComponent(couple.slug)}`}
                                className="rounded-full bg-rose-600 text-white text-xs md:text-sm font-semibold px-3 py-1.5 hover:bg-rose-700 inline-flex items-center gap-1"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View
                            </Link>

                            {hasStory && (
                                <button
                                    onClick={onOpenStory}
                                    className="rounded-full border border-rose-200 text-rose-700 text-xs md:text-sm font-semibold px-3 py-1.5 hover:bg-rose-50"
                                >
                                    Love story
                                </button>
                            )}

                            <div className="relative">
                                <button
                                    onClick={doShare}
                                    className="rounded-full border border-rose-200 text-rose-700 text-xs md:text-sm font-semibold px-3 py-1.5 hover:bg-rose-50 inline-flex items-center gap-1"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>

                                {/* desktop dropdown */}
                                <div className="hidden md:block">
                                    <ShareMenu
                                        open={shareOpen}
                                        onClose={() => setShareOpen(false)}
                                        pageUrl={pageUrl}
                                        shareText={shareText}
                                        desktop
                                    />
                                </div>

                                {/* mobile bottom-sheet */}
                                <div className="md:hidden">
                                    <ShareMenu
                                        open={shareOpen}
                                        onClose={() => setShareOpen(false)}
                                        pageUrl={pageUrl}
                                        shareText={shareText}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* soft gradient to ensure text readability on bright photos */}
                <div className="pointer-events-none absolute inset-x-2 -top-14 bottom-0 rounded-2xl bg-gradient-to-t from-white/65 to-transparent" />
            </div>
        </figure>
    );
}
