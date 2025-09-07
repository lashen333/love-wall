// src\components\PhotoAlbum.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  memo,
} from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import type { Couple } from '@/types';

// client-only
const HTMLFlipBook: React.ComponentType<any> = dynamic(
  () => import('react-pageflip').then((m: any) => m.default),
  { ssr: false }
) as any;

type CouplesAPI = { success: boolean; data: Couple[] };

const PLACEHOLDER = 'https://placehold.co/1200x1600?text=Image+Unavailable';

/* ---------------- helpers ---------------- */

function firstSrc(c?: Couple) {
  return (c?.photoUrl && String(c.photoUrl))
    || (c?.thumbUrl && String(c.thumbUrl))
    || PLACEHOLDER;
}
function fallbackSrc(c?: Couple, tried?: string) {
  const photo = (c?.photoUrl && String(c.photoUrl)) || '';
  const thumb = (c?.thumbUrl && String(c.thumbUrl)) || '';
  if (tried && tried === photo && thumb) return thumb;
  return PLACEHOLDER;
}

/* ---------------- AlbumPage ---------------- */

type AlbumPageProps = {
  index: number;
  couple?: Couple;
  width: number;
  height: number;
  isCover?: boolean;
  isActive?: boolean; // visible page(s)
};

const AlbumPage = memo(
  forwardRef<HTMLDivElement, AlbumPageProps>(function AlbumPage(
    { index, couple, width, height, isCover, isActive },
    ref
  ) {
    const [src, setSrc] = useState<string>(firstSrc(couple));
    useEffect(() => {
      setSrc(firstSrc(couple));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [couple?._id]);

    const handleError = () => setSrc((prev) => fallbackSrc(couple, prev));

    return (
      <div
        ref={ref}
        className="bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col"
        style={{ width, height }}
      >
        <div className="absolute top-2 left-2 z-10 text-[11px] px-2 py-0.5 rounded-full bg-black/60 text-white">
          {isCover ? 'Album' : `#${index + 1}`}
        </div>

        {couple ? (
          <>
            {/* full-bleed image */}
            <div className="relative flex-1">
              <img
                src={src}
                alt={couple.names}
                onError={handleError}
                loading={isActive ? 'eager' : 'lazy'}
                fetchPriority={isActive ? 'high' : 'auto'}
                decoding="async"
                draggable={false}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* caption */}
            <div className="p-3 md:p-4 bg-white">
              <h3 className="font-semibold text-gray-800 truncate">{couple.names}</h3>
              <div className="mt-1 text-xs text-gray-600 flex gap-3 flex-wrap">
                {couple.weddingDate && (
                  <span>{new Date(couple.weddingDate).toLocaleDateString()}</span>
                )}
                {couple.country && <span className="truncate">{couple.country}</span>}
              </div>
              {couple.story && (
                <p className="mt-2 text-xs text-gray-500 line-clamp-2">{couple.story}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 grid place-items-center text-gray-400 text-xs">—</div>
        )}
      </div>
    );
  })
);

/* ---------------- main component ---------------- */

type Props = {
  couples?: Couple[];   // pass from server if you have it; else we self-fetch
  loading?: boolean;
};

export default function PhotoAlbum({ couples: couplesFromProps, loading: loadingProp }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  // data
  const [couples, setCouples] = useState<Couple[]>(couplesFromProps ?? []);
  const [loading, setLoading] = useState<boolean>(!!loadingProp || !couplesFromProps);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  // layout
  const [pageSize, setPageSize] = useState({ w: 340, h: 480 }); // mobile-first
  const [pagesPerView, setPagesPerView] = useState<1 | 2>(1);
  const [activePage, setActivePage] = useState(0);

  const usingProps = Array.isArray(couplesFromProps);

  // keep in sync with parent
  useEffect(() => {
    if (!usingProps) return;
    setCouples(couplesFromProps ?? []);
    setLoading(!!loadingProp);
    setErrorMsg(null);
  }, [usingProps, couplesFromProps, loadingProp]);

  // self-fetch when no props
  useEffect(() => {
    if (usingProps) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const res = await fetch('/api/couples?status=approved&limit=100', { cache: 'no-store' });
        const json: CouplesAPI = await res.json();
        if (!json.success) throw new Error('API returned success=false');

        // oldest-first
        const ordered = (json.data ?? []).slice().sort((a, b) => {
          const ta = new Date(a.createdAt ?? 0).getTime();
          const tb = new Date(b.createdAt ?? 0).getTime();
          return ta - tb;
        });
        if (!cancelled) setCouples(ordered);
      } catch (e: any) {
        const msg = e?.message || '';
        if (!cancelled && !/aborted/i.test(msg)) setErrorMsg(msg || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [usingProps]);

  // debounced responsive sizing (prevents flipbook DOM churn)
  useEffect(() => {
    let raf = 0;
    const updateNow = () => {
      const el = hostRef.current;
      if (!el) return;
      const containerW = el.clientWidth;

      const two = containerW >= 700;
      const nextPPV: 1 | 2 = two ? 2 : 1;

      const targetPageW = two
        ? Math.min(420, Math.floor(containerW / 2) - 24)
        : Math.min(380, containerW - 24);
      const targetPageH = Math.round(targetPageW * 1.4);

      setPagesPerView((prev) => (prev === nextPPV ? prev : nextPPV));
      setPageSize((prev) =>
        prev.w === targetPageW && prev.h === targetPageH ? prev : { w: targetPageW, h: targetPageH }
      );
    };
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateNow);
    };

    updateNow();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // approved-only
  const approvedCouples = useMemo(
    () =>
      couples
        .filter((c) => (c.status ?? '').toString().toLowerCase() === 'approved')
        .sort((a, b) => {
          const ta = new Date(a.createdAt ?? 0).getTime();
          const tb = new Date(b.createdAt ?? 0).getTime();
          return ta - tb;
        }),
    [couples]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return approvedCouples;
    return approvedCouples.filter((c) => (c.names || '').toLowerCase().includes(q));
  }, [approvedCouples, query]);

  // pages (+ pad for spread)
  const pages: (Couple | null)[] = useMemo(() => {
    const base = approvedCouples;
    const needsPad = pagesPerView === 2 && base.length % 2 !== 0;
    return needsPad ? [...base, null] : base;
  }, [approvedCouples, pagesPerView]);

  // states
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-gray-200 h-64" />
        ))}
      </div>
    );
  }
  if (errorMsg) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-1">Photo Album</h3>
        <p className="text-red-600 font-medium">Failed to load album.</p>
        <p className="text-gray-500 text-sm mt-1">{errorMsg}</p>
      </div>
    );
  }
  if (approvedCouples.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20">
        <Camera className="w-16 h-16 text-pink-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Photo Album is Empty</h3>
        <p className="text-gray-500 px-4">Be the first couple to join our photo album!</p>
      </div>
    );
  }

  return (
    <div ref={hostRef} className="w-full">
      {/* Search */}
      <div className="mb-4 flex justify-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search couple names..."
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg"
        />
      </div>
      {/* Album Header */}
      <div className="text-center mb-6 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg"
        >
          <Camera className="w-5 h-5 text-pink-500" />
          <span className="text-sm sm:text-base font-semibold text-gray-700">
            {query.trim() ? filtered.length : approvedCouples.length} Photos in Album • Oldest first
          </span>
        </motion.div>
      </div>
      {/* If searching, show a simple grid of matching couples; otherwise show flipbook */}
      {query.trim() ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((c) => (
            <Link key={c._id} href={`/album/${encodeURIComponent(c.slug)}`} className="block bg-white rounded-lg overflow-hidden shadow">
              <div className="w-full h-48 bg-gray-100">
                <img src={firstSrc(c)} alt={c.names} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm truncate">{c.names}</div>
                <div className="text-xs text-gray-500">{c.country || ''}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mx-auto select-none">
          <HTMLFlipBook
            key={`${pageSize.w}x${pageSize.h}-${pagesPerView}`} // remount on layout change
            width={pageSize.w}
            height={pageSize.h}
            size="stretch"
            maxShadowOpacity={0.35}
            showCover
            mobileScrollSupport
            usePortrait={pagesPerView === 1}
            drawShadow
            flippingTime={550}
            className="shadow-2xl"
            onInit={() => setActivePage(0)}
            onFlip={(e: any) => {
              const bookIndex: number = typeof e?.data === 'number' ? e.data : 0;
              setActivePage(Math.max(0, bookIndex - 1));
            }}
          >
            {/* Front Cover */}
            <AlbumPage index={-1} isCover width={pageSize.w} height={pageSize.h} />

            {pages.map((c, idx) => {
              const isActive =
                pagesPerView === 1
                  ? activePage === idx
                  : activePage === idx || activePage + 1 === idx;

              return (
                <AlbumPage
                  key={c?._id ?? `blank-${idx}`} // stable key
                  index={idx}
                  couple={c ?? undefined}
                  width={pageSize.w}
                  height={pageSize.h}
                  isActive={isActive}
                />
              );
            })}

            {/* Back Cover */}
            <AlbumPage index={9999} isCover width={pageSize.w} height={pageSize.h} />
          </HTMLFlipBook>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-gray-500">
        Tip: Swipe on mobile or click/drag corners on desktop to turn pages.
      </p>
    </div>
  );
}
