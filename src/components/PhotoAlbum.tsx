// src/components/LoveCarousel.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Share2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import type { Couple } from '@/types';

type ApiCouples = {
  success: boolean;
  data: Couple[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

const PLACEHOLDER =
  'https://placehold.co/1200x1600/ec4899/ffffff?text=Image+Unavailable';

const bestSrc = (c?: Couple) =>
  (c?.thumbUrl && String(c.thumbUrl)) ||
  (c?.photoUrl && String(c.photoUrl)) ||
  PLACEHOLDER;

type Props = {
  fetchLimit?: number; // default 200
  interval?: number; // default 4500ms
  showCtaSlide?: boolean; // default true
};

export default function LoveCarousel({
  fetchLimit = 200,
  interval = 4500,
  showCtaSlide = true,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);

  // data
  const [rows, setRows] = useState<Couple[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // search
  const [q, setQ] = useState('');
  const [matchIndex, setMatchIndex] = useState(0);

  // carousel
  const [idx, setIdx] = useState(0);
  const [slideW, setSlideW] = useState(0);
  const timerRef = useRef<number | null>(null);

  // story modal
  const [storyOf, setStoryOf] = useState<Couple | null>(null);

  // fetch approved couples (oldest first)
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`/api/couples?status=approved&limit=${fetchLimit}`, {
          cache: 'no-store',
          signal: ctrl.signal,
        });
        const json: ApiCouples = await res.json();
        if (!json.success) throw new Error('Failed to load photos');

        const data = (json.data || [])
          .filter((c) => (c.status ?? 'approved').toLowerCase() === 'approved')
          .sort(
            (a, b) =>
              new Date(a.createdAt ?? 0).getTime() -
              new Date(b.createdAt ?? 0).getTime()
          );

        setRows(data);
        setTotal(json.pagination.total);
      } catch (e: any) {
        if (e?.name !== 'AbortError') setErr(e?.message || 'Failed to load photos');
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [fetchLimit]);

  // slides (CTA as slide 0)
  const slides = useMemo(() => {
    const arr: Array<{ type: 'cta' | 'photo'; couple?: Couple }> = [];
    if (showCtaSlide) arr.push({ type: 'cta' });
    rows.forEach((c) => arr.push({ type: 'photo', couple: c }));
    return arr;
  }, [rows, showCtaSlide]);

  // measure slide width (stage width)
  useEffect(() => {
    const update = () => setSlideW(stageRef.current?.clientWidth || 0);
    update();

    let ro: ResizeObserver | null = null;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      ro = new (window as any).ResizeObserver(update);
      if (ro && stageRef.current) {
        ro.observe(stageRef.current);
      }
    }

    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, []);

  // sync track width & translate
  useEffect(() => {
    const track = trackRef.current;
    if (!track || slideW <= 0) return;
    track.style.width = `${slides.length * slideW}px`;
    track.style.transform = `translate3d(${-idx * slideW}px,0,0)`;
  }, [slideW, idx, slides.length]);

  // autoplay (pause on hover, focus, hidden tab, or open story)
  useEffect(() => {
    const move = () => setIdx((i) => (i + 1) % Math.max(1, slides.length));
    const start = () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        if (!hoverRef.current && !focusRef.current && !document.hidden && !storyOf)
          move();
      }, Math.max(2000, interval));
    };
    start();
    const vis = () => {
      if (!document.hidden) start();
    };
    document.addEventListener('visibilitychange', vis);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', vis);
    };
  }, [slides.length, interval, storyOf]);

  // search matches
  const matches = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return [];
    const m: number[] = [];
    slides.forEach((s, i) => {
      if (s.type === 'photo' && (s.couple?.names || '').toLowerCase().includes(ql)) {
        m.push(i);
      }
    });
    return m;
  }, [q, slides]);

  useEffect(() => {
    if (matches.length === 0) return;
    setMatchIndex(0);
    setIdx(matches[0]);
  }, [matches.length]);

  // Enter / Shift+Enter cycles matches
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q.trim()) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        if (matches.length === 0) return;
        const dir = e.shiftKey ? -1 : 1;
        const next = (matchIndex + dir + matches.length) % matches.length;
        setMatchIndex(next);
        setIdx(matches[next]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, matches, matchIndex]);

  const jump = (i: number) => setIdx((i + slides.length) % slides.length);
  const next = () => jump(idx + 1);
  const prev = () => jump(idx - 1);

  return (
    <section className="w-full">
      {/* search + counts */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => (focusRef.current = true)}
            onBlur={() => (focusRef.current = false)}
            placeholder="Search couple names… (Enter to jump)"
            className="w-full pl-10 pr-10 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {!!q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-2 top-2 p-1 rounded hover:bg-gray-100"
              aria-label="Clear"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        <div className="hidden sm:block text-sm text-gray-600">
          {q.trim()
            ? matches.length > 0
              ? `Matches: ${matchIndex + 1}/${matches.length}`
              : 'No matches'
            : `${Math.max(0, rows.length)} photos • Total ${total.toLocaleString()}`}
        </div>
      </div>

      {/* stage */}
      <div
        ref={stageRef}
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{
          height: 'clamp(380px, 58vh, 640px)',
          background:
            'radial-gradient(120% 120% at 70% 20%, #fff 0%, #ffe4e6 60%, #fdf2f8 100%)',
        }}
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
      >
        <ul
          ref={trackRef}
          className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
          style={{ willChange: 'transform' }}
        >
          {loading && (
            <li style={{ width: slideW }} className="relative shrink-0">
              <div className="absolute inset-0 grid place-items-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" />
              </div>
            </li>
          )}

          {!loading &&
            slides.map((s, i) => (
              <li key={i} style={{ width: slideW }} className="relative shrink-0">
                {s.type === 'cta' ? (
                  <CtaSlide />
                ) : (
                  <PhotoSlide couple={s.couple!} onOpenStory={() => setStoryOf(s.couple!)} />
                )}
              </li>
            ))}
        </ul>

        {/* arrows (z-20 so they sit above slides, but below banner z-30) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="hidden sm:flex absolute inset-y-0 left-0 w-16 items-center justify-center group z-20"
              aria-label="Previous"
            >
              <span className="p-2 rounded-full bg-black/40 text-white group-hover:bg-black/60">
                <ChevronLeft className="w-6 h-6" />
              </span>
            </button>
            <button
              onClick={next}
              className="hidden sm:flex absolute inset-y-0 right-0 w-16 items-center justify-center group z-20"
              aria-label="Next"
            >
              <span className="p-2 rounded-full bg-black/40 text-white group-hover:bg-black/60">
                <ChevronRight className="w-6 h-6" />
              </span>
            </button>

            {/* mobile edge hotspots — smaller and under the banner */}
            <button
              onClick={prev}
              className="sm:hidden absolute inset-y-0 left-0 w-1/4 z-10"
              aria-label="Prev"
            />
            <button
              onClick={next}
              className="sm:hidden absolute inset-y-0 right-0 w-1/4 z-10"
              aria-label="Next"
            />
          </>
        )}
      </div>

      {err && <p className="mt-3 text-center text-rose-700 font-medium">{err}</p>}

      <p className="mt-3 text-center text-xs text-gray-600">
        Tip: Type a name to jump • Join thousands of couples celebrating their story.
      </p>

      {/* full story modal */}
      {storyOf && <StoryDialog couple={storyOf} onClose={() => setStoryOf(null)} />}
    </section>
  );
}

/* ---------------- Slides ---------------- */

function CtaSlide() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-4 grid place-items-center rounded-xl bg-gradient-to-br from-white/80 to-white/60 shadow">
        <div className="text-center px-6">
          <div className="text-2xl sm:text-4xl font-extrabold text-rose-700">
            Add your love
          </div>
          <p className="mt-2 text-rose-900/80 text-sm max-w-md mx-auto">
            Become part of the world’s biggest love album. Your photo inspires the next couple ♥
          </p>
          <Link
            href="/add"
            className="inline-block mt-4 px-6 py-2 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-700"
          >
            Upload your photo
          </Link>
          <p className="mt-3 text-[11px] text-gray-500">
            Safe • Reviewed • Looks great on mobile
          </p>
        </div>
      </div>
    </div>
  );
}

function PhotoSlide({
  couple,
  onOpenStory,
}: {
  couple: Couple;
  onOpenStory: () => void;
}) {
  const src = bestSrc(couple);
  const big = (couple.photoUrl && String(couple.photoUrl)) || src;
  const hasStory = !!(couple.story && couple.story.trim().length > 0);

  // small share popover local state
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
        setShareOpen(false);
      } else {
        // fallback: open small menu
        setShareOpen((v) => !v);
      }
    } catch {
      // ignore
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setShareOpen(false);
      alert('Link copied!');
    } catch {
      // ignore
    }
  };

  const openShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <figure className="relative h-full">
      {/* image frame */}
      <div className="absolute inset-4 bg-white rounded-xl shadow-lg overflow-hidden z-20">
        <div className="absolute inset-0">
          <img
            src={src}
            alt=""
            aria-hidden
            crossOrigin="anonymous"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover blur-[18px] scale-110 opacity-40"
          />
        </div>
        <img
          src={big}
          alt={couple.names}
          loading="eager"
          decoding="async"
          crossOrigin="anonymous"
          className="relative z-10 w-full h-full object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
      </div>

      {/* banner (at the bottom, above hotspots) */}
      <figcaption className="absolute left-6 right-6 bottom-6 z-30">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow px-4 py-3 md:px-5 md:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-base md:text-lg text-neutral-900 truncate">
                {couple.names}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
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
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
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

                {/* fallback share popover */}
                {shareOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg p-2 z-40">
                    <button
                      onClick={() =>
                        openShare(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            pageUrl
                          )}`
                        )
                      }
                      className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100"
                    >
                      Share on Facebook
                    </button>
                    <button
                      onClick={() =>
                        openShare(
                          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            pageUrl
                          )}&text=${encodeURIComponent(shareText)}`
                        )
                      }
                      className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100"
                    >
                      Share on X (Twitter)
                    </button>
                    <button
                      onClick={() =>
                        openShare(
                          `https://wa.me/?text=${encodeURIComponent(
                            `${shareText} ${pageUrl}`
                          )}`
                        )
                      }
                      className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100"
                    >
                      Share on WhatsApp
                    </button>
                    <button
                      onClick={copyLink}
                      className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100 inline-flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" /> Copy link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

/* ---------------- Story Dialog ---------------- */

function StoryDialog({ couple, onClose }: { couple: Couple; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const img = bestSrc(couple);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/55 backdrop-blur-sm grid place-items-center p-3 sm:p-6"
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
              <blockquote className="mt-4 text-[15px] md:text-base leading-7 text-neutral-800">
                <p>{couple.story}</p>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
