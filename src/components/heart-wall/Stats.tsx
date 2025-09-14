// src\components\heart-wall\Stats.tsx
"use client";

type Props = { filledTiles: number; total?: number };

export default function Stats({ filledTiles, total = 1_000_000 }: Props) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="text-3xl font-bold text-pink-600">
          {filledTiles.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Photos Added</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-pink-600">
          {(total - filledTiles).toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Spots Left</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-pink-600">
          {Math.round((filledTiles / total) * 100)}%
        </div>
        <div className="text-sm text-gray-600">Complete</div>
      </div>
    </div>
  );
}
