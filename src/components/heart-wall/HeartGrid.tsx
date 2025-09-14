// src\components\heart-wall\HeartGrid.tsx
"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Couple } from "@/types";
import { generateHeartPoints } from "@/utils/heartUtils";
import useMeasure from "@/hooks/useMeasure";
import HeartTile from "./HeartTile";

type Props = {
  couples: Couple[];
  onPick: (c: Couple) => void;
};

export default function HeartGrid({ couples, onPick }: Props) {
  const { ref, rect } = useMeasure();
  const [hovered, setHovered] = useState<number | null>(null);

  // compute square size from wrapper width
  const size = useMemo(() => {
    const width = Math.floor(rect?.width ?? 320);
    return Math.max(240, Math.min(800, width));
  }, [rect?.width]);

  const heartPoints = useMemo(
    () => generateHeartPoints(size / 2, size / 2, size),
    [size]
  );

  const approved = couples.filter((c) => c.status === "approved");
  const filledTiles = Math.min(approved.length, heartPoints.length);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[800px]">
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        {/* tiles */}
        <div className="relative w-full h-full">
          {heartPoints.map((pt, i) => {
            const couple = i < approved.length ? approved[i] : null;

            return (
              <div
                key={i}
                style={{ left: pt.x, top: pt.y, position: "absolute" }}
              >
                <HeartTile
                  index={i}
                  couple={couple}
                  isHovered={hovered === i}
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => couple && onPick(couple)}
                />
              </div>
            );
          })}
        </div>

        {/* center pulse */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-16 h-16 text-pink-400 opacity-20" />
        </motion.div>
      </div>

      {/* expose count to parent via data-attr if needed */}
      <div data-filled-tiles={filledTiles} />
    </div>
  );
}
