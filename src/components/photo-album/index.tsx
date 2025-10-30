// src\components\photo-album\index.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Couple } from '@/types';
import CtaSlide from './CtaSlide';
import PhotoSlide from './PhotoSlide';
import StoryDialog from './StoryDialog';

type ApiCouples = {
  success: boolean;
  data: Couple[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

type Props = {
  fetchLimit?: number;   // default 200
  interval?: number;     // default 4500ms
  showCtaSlide?: boolean; // default true
};

export default function LoveCarousel({
  fetchLimit = 200,
  interval = 500,
  showCtaSlide = true,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);

  const [rows, setRows] = useState<Couple[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState('');
  const [matchIndex, setMatchIndex] = useState(0);

  const [idx, setIdx] = useState(0);
  const [slideW, setSlideW] = useState(0);
  const timerRef = useRef<number | null>(null);

  const [storyOf, setStoryOf] = useState<Couple | null>(null);

  // fetch with caching
  useEffect(() => {
    const ctrl = new AbortController();
    
    // Listen for approval events from admin panel
    const channel = new BroadcastChannel('couple-approvals');
    channel.onmessage = () => {
      // Clear cache and refresh when an approval happens
      sessionStorage.removeItem(`photo-album-${fetchLimit}`);
      sessionStorage.removeItem(`photo-album-${fetchLimit}-time`);
      // Force a refresh by updating fetchLimit dependency
      setRows([]);
    };
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setErr(null);
        
        // Use cached data if available and not too old
        const cacheKey = `photo-album-${fetchLimit}`;
        const cached = sessionStorage.getItem(cacheKey);
        const cacheTime = sessionStorage.getItem(`${cacheKey}-time`);
        const now = Date.now();
        const maxAge = 30 * 1000; // 30 seconds (reduced for faster updates)
        
        if (cached && cacheTime && (now - parseInt(cacheTime)) < maxAge) {
          const data = JSON.parse(cached);
          setRows(data.rows);
          setTotal(data.total);
          setLoading(false);
          return;
        }
        
        const res = await fetch(`/api/couples?status=approved&limit=${fetchLimit}&t=${Date.now()}`, {
          cache: 'no-store', // Always fetch fresh data
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

        // Cache the results
        sessionStorage.setItem(cacheKey, JSON.stringify({ rows: data, total: json.pagination.total }));
        sessionStorage.setItem(`${cacheKey}-time`, now.toString());

        setRows(data);
        setTotal(json.pagination.total);
      } catch (e: any) {
        if (e?.name !== 'AbortError') setErr(e?.message || 'Failed to load photos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => {
      ctrl.abort();
      channel.close();
    };
  }, [fetchLimit]);

  // slides (CTA at index 0)
  const slides = useMemo(() => {
    const arr: Array<{ type: 'cta' | 'photo'; couple?: Couple }> = [];
    if (showCtaSlide) arr.push({ type: 'cta' });
    rows.forEach((c) => arr.push({ type: 'photo', couple: c }));
    return arr;
  }, [rows, showCtaSlide]);

  // measure
  useEffect(() => {
    const update = () => setSlideW(stageRef.current?.clientWidth || 0);
    update();

    let ro: ResizeObserver | null = null;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      ro = new (window as any).ResizeObserver(update);
      if (ro && stageRef.current) ro.observe(stageRef.current);
    }
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, []);

  // sync transform
  useEffect(() => {
    const track = trackRef.current;
    if (!track || slideW <= 0) return;
    track.style.width = `${slides.length * slideW}px`;
    track.style.transform = `translate3d(${-idx * slideW}px,0,0)`;
  }, [slideW, idx, slides.length]);

  // autoplay
  useEffect(() => {
    const step = () => setIdx((i) => (i + 1) % Math.max(1, slides.length));
    const start = () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        if (!hoverRef.current && !focusRef.current && !document.hidden && !storyOf)
          step();
      }, Math.max(2000, interval));
    };
    start();
    const vis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', vis);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', vis);
    };
  }, [slides.length, interval, storyOf]);

  // search
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

  // is current slide a photo (not CTA)?
  const isPhotoSlide = slides[idx]?.type === 'photo';

  return (
    <section className="w-full">
      {/* search */}
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
          height: 'clamp(420px, 62svh, 720px)', // mobile-safe with svh
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

        {/* Desktop arrows (md+) */}
        {slides.length > 1 && isPhotoSlide && (
          <>
            <button
              onClick={prev}
              className="hidden md:flex absolute inset-y-0 left-0 w-16 items-center justify-center group z-20"
              aria-label="Previous"
            >
              <span className="p-2 rounded-full bg-black/40 text-white group-hover:bg-black/60">
                <ChevronLeft className="w-6 h-6" />
              </span>
            </button>

            <button
              onClick={next}
              className="hidden md:flex absolute inset-y-0 right-0 w-16 items-center justify-center group z-20"
              aria-label="Next"
            >
              <span className="p-2 rounded-full bg-black/40 text-white group-hover:bg-black/60">
                <ChevronRight className="w-6 h-6" />
              </span>
            </button>
          </>
        )}

        {/* Click-to-navigate overlay (all viewports) — never covers the banner */}
        {slides.length > 1 && isPhotoSlide && (
          <div className="absolute inset-x-0 top-0 bottom-28 md:bottom-32 z-10">
            <button
              onClick={prev}
              className="absolute left-0 top-0 h-full w-1/2"
              aria-label="Previous"
            />
            <button
              onClick={next}
              className="absolute right-0 top-0 h-full w-1/2"
              aria-label="Next"
            />
          </div>
        )}
      </div>

      {err && <p className="mt-3 text-center text-rose-700 font-medium">{err}</p>}

      <p className="mt-3 text-center text-xs text-gray-600">
        Tip: Type a name to jump • Join thousands of couples celebrating their story.
      </p>

      {storyOf && <StoryDialog couple={storyOf} onClose={() => setStoryOf(null)} />}
    </section>
  );
}
