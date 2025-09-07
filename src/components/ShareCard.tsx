// src\components\ShareCard.tsx
 'use client';

import React from 'react';
import { Share2, Twitter, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

type Props = {
  title: string;
  text?: string;
  url: string;
};

export default function ShareCard({ title, text, url }: Props) {
  const handleWebShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title, text, url });
      } catch (e) {
        // user cancelled
      }
    } else {
      toast('Web Share not supported on this device');
    }
  };

  const handleTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text || title
    )}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (e) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="flex gap-3">
      <button onClick={handleWebShare} className="flex items-center gap-2 px-3 py-2 bg-white rounded shadow hover:shadow-md">
        <Share2 className="w-4 h-4" /> Share
      </button>

      <button onClick={handleTwitter} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded shadow hover:shadow-md">
        <Twitter className="w-4 h-4" /> Tweet
      </button>

      <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded shadow hover:shadow-md">
        <LinkIcon className="w-4 h-4" /> Copy link
      </button>
    </div>
  );
}
