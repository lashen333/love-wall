// src\components\photo-album\ShareMenu.tsx
'use client';

import React, { useEffect } from 'react';
import { Copy } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  pageUrl: string;
  shareText: string;
  desktop?: boolean; // dropdown on desktop
};

export default function ShareMenu({ open, onClose, pageUrl, shareText, desktop }: Props) {
  // close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const openShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      onClose();
      alert('Link copied!');
    } catch {}
  };

  if (!open) return null;

  // mobile bottom sheet
  if (!desktop) {
    return (
      <div
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-3 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300 mb-3" />
          <ul className="divide-y">
            <li>
              <button
                onClick={() =>
                  openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`)
                }
                className="w-full text-left px-3 py-3 hover:bg-gray-50"
              >
                Share on Facebook
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  openShare(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`
                  )
                }
                className="w-full text-left px-3 py-3 hover:bg-gray-50"
              >
                Share on X (Twitter)
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  openShare(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`)
                }
                className="w-full text-left px-3 py-3 hover:bg-gray-50"
              >
                Share on WhatsApp
              </button>
            </li>
            <li>
              <button
                onClick={copyLink}
                className="w-full text-left px-3 py-3 hover:bg-gray-50 inline-flex items-center gap-2"
              >
                <Copy className="w-4 h-4" /> Copy link
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // desktop dropdown
  return (
    <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg p-2 z-[60]">
      <button
        onClick={() =>
          openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`)
        }
        className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100"
      >
        Share on Facebook
      </button>
      <button
        onClick={() =>
          openShare(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`
          )
        }
        className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100"
      >
        Share on X (Twitter)
      </button>
      <button
        onClick={() =>
          openShare(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`)
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
  );
}
