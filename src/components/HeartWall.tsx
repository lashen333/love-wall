// src\components\HeartWall.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Calendar, MapPin, MessageCircle } from 'lucide-react';
import { Couple } from '@/types';
import { generateHeartPoints } from '@/utils/heartUtils';

interface HeartWallProps {
  couples: Couple[];
  loading: boolean;
}

export function HeartWall({ couples, loading }: HeartWallProps) {
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [selectedCouple, setSelectedCouple] = useState<Couple | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // responsive square size
  const [size, setSize] = useState(320);
  const [centerX, setCenterX] = useState(160);
  const [centerY, setCenterY] = useState(160);

  // Measure wrapper width and drive size from it (not window.innerWidth)
  useEffect(() => {
    if (!wrapperRef.current) return;

    const ro = new ResizeObserver((entries) => {
      const width = Math.floor(entries[0].contentRect.width);
      // clamp to keep tiles legible
      const s = Math.max(240, Math.min(800, width));
      setSize(s);
      setCenterX(s / 2);
      setCenterY(s / 2);
    });

    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const heartPoints = useMemo(
    () => generateHeartPoints(centerX, centerY, size),
    [centerX, centerY, size]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500" />
      </div>
    );
  }

  const approvedCouples = couples.filter((c) => c.status === 'approved');
  const filledTiles = Math.min(approvedCouples.length, heartPoints.length);

  const handleTileClick = (couple: Couple) => setSelectedCouple(couple);

  return (
    <div className="text-center">
      {/* header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-4">The Love Wall</h2>
        <p className="text-lg text-gray-600">
          {filledTiles.toLocaleString()} couples have joined the wall
        </p>
      </div>

      {/* wrapper decides available width */}
      <div ref={wrapperRef} className="relative mx-auto w-full max-w-[800px]">
        <div className="relative mx-auto" style={{ width: size, height: size }}>
          {/* Heart Container */}
          <div className="relative w-full h-full">
            {heartPoints.map((point, index) => {
              const couple =
                index < approvedCouples.length ? approvedCouples[index] : null;
              const isEmpty = !couple;
              const isHovered = hoveredTile === index;

              return (
                <motion.div
                  key={index}
                  className={`absolute heart-tile ${
                    isEmpty ? 'heart-tile-empty' : 'heart-tile-filled'
                  }`}
                  style={{
                    left: point.x,
                    top: point.y,
                    zIndex: isHovered ? 10 : 1,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.001,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  whileHover={{ scale: 1.2, zIndex: 20 }}
                  onHoverStart={() => setHoveredTile(index)}
                  onHoverEnd={() => setHoveredTile(null)}
                  onClick={() => couple && handleTileClick(couple)}
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
                                {new Date(
                                  couple.weddingDate
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {couple.country && (
                              <p className="text-xs text-gray-600">
                                {couple.country}
                              </p>
                            )}
                            <p className="text-xs text-pink-500 mt-1">
                              Click to view full photo
                            </p>
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
            })}
          </div>

          {/* Center Heart Icon */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-pink-400 opacity-20" />
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-600">
            {filledTiles.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Photos Added</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-600">
            {(1_000_000 - filledTiles).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Spots Left</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-600">
            {Math.round((filledTiles / 1_000_000) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Photo Popup Modal */}
      <AnimatePresence>
        {selectedCouple && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCouple(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCouple.names}
                </h2>
                <button
                  onClick={() => setSelectedCouple(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <img
                    src={selectedCouple.photoUrl}
                    alt={selectedCouple.names}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCouple.weddingDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-pink-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Wedding Date
                        </p>
                        <p className="text-gray-800">
                          {new Date(
                            selectedCouple.weddingDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedCouple.country && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-pink-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Country
                        </p>
                        <p className="text-gray-800">
                          {selectedCouple.country}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedCouple.story && (
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Love Story
                          </p>
                          <p className="text-gray-800 leading-relaxed">
                            {selectedCouple.story}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500">
                    This couple joined the Love Wall on{' '}
                    {new Date(selectedCouple.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
