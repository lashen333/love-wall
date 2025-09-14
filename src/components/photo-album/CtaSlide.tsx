// src\components\photo-album\CtaSlide.tsx
import Link from 'next/link';

export default function CtaSlide() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-4 grid place-items-center rounded-xl bg-gradient-to-br from-white/85 to-white/60 shadow">
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
