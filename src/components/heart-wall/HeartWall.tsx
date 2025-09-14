// src\components\heart-wall\HeartWall.tsx
"use client";
import { useMemo, useState } from "react";
import type { Couple } from "@/types";
import HeartGrid from "./HeartGrid";
import Stats from "./Stats";
import CoupleModal from "./CoupleModal";

type Props = {
  couples: Couple[];
  loading: boolean;
};

export default function HeartWall({ couples, loading }: Props) {
  const [selected, setSelected] = useState<Couple | null>(null);

  const approved = useMemo(
    () => couples.filter((c) => c.status === "approved"),
    [couples]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500" />
      </div>
    );
  }

  const filledTiles = Math.min(approved.length, 10_000); // defensive cap

  return (
    <div className="text-center">
      {/* header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-4">The Love Wall</h2>
        <p className="text-lg text-gray-600">
          {filledTiles.toLocaleString()} couples have joined the wall
        </p>
      </div>

      {/* grid */}
      <HeartGrid couples={couples} onPick={(c) => setSelected(c)} />

      {/* stats */}
      <Stats filledTiles={filledTiles} />

      {/* modal */}
      <CoupleModal couple={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
