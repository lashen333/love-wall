// src\components\heart-wall\HeartTile.tsx
"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Couple } from "@/types";

type Props = {
  index: number;
  couple: Couple | null;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
};

export default function HeartTile({
  index,
  couple,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
}: Props) {
  const isEmpty = !couple;

  return (
    <motion.div
      className={`absolute heart-tile ${
        isEmpty ? "heart-tile-empty" : "heart-tile-filled"
      }`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.001,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ scale: 1.2, zIndex: 20 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      style={{ zIndex: isHovered ? 10 : 1 }}
    >
      {couple ? (
        <div className="relative w-full h-full group cursor-pointer">
          <div
            className="w-full h-full bg-cover bg-center rounded-sm"
            style={{ backgroundImage: `url(${couple.thumbUrl})` }}
          />
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 border border-pink-200 min-w-max"
            >
              <div className="text-center">
                <p className="font-semibold text-gray-800 text-sm">
                  {couple.names}
                </p>
                {couple.weddingDate && (
                  <p className="text-xs text-gray-600">
                    {new Date(couple.weddingDate).toLocaleDateString()}
                  </p>
                )}
                {couple.country && (
                  <p className="text-xs text-gray-600">{couple.country}</p>
                )}
                <p className="text-xs text-pink-500 mt-1">Click to view</p>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
            </motion.div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Heart className="w-3 h-3 text-pink-300" />
        </div>
      )}
    </motion.div>
  );
}
