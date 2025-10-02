// src\components\heart-wall\HeartGrid.tsx
"use client";
import { useMemo, useState, useCallback, memo } from "react";
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

// Memoized HeartTile component to prevent unnecessary re-renders
const MemoizedHeartTile = memo(HeartTile);

export default function HeartGrid({ couples, onPick }: Props) {
  const { ref, rect } = useMeasure();
  const [hovered, setHovered] = useState<number | null>(null);

  // compute square size from wrapper width with debouncing
  const size = useMemo(() => {
    const width = Math.floor(rect?.width ?? 320);
    return Math.max(240, Math.min(800, width));
  }, [rect?.width]);

  // Memoize heart points calculation
  const heartPoints = useMemo(
    () => generateHeartPoints(size / 2, size / 2, size),
    [size]
  );

  // Memoize approved couples to prevent unnecessary filtering
  const approved = useMemo(
    () => couples.filter((c) => c.status === "approved"),
    [couples]
  );
  
  const filledTiles = Math.min(approved.length, heartPoints.length);

  // Memoize event handlers
  const handleHoverStart = useCallback((index: number) => {
    setHovered(index);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHovered(null);
  }, []);

  const handleClick = useCallback((couple: Couple) => {
    onPick(couple);
  }, [onPick]);

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
                <MemoizedHeartTile
                  index={i}
                  couple={couple}
                  isHovered={hovered === i}
                  onHoverStart={() => handleHoverStart(i)}
                  onHoverEnd={handleHoverEnd}
                  onClick={() => couple && handleClick(couple)}
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
