// src\components\heart-wall\CoupleModal.tsx
"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, MessageCircle } from "lucide-react";
import type { Couple } from "@/types";

type Props = {
  couple: Couple | null;
  onClose: () => void;
};

export default function CoupleModal({ couple, onClose }: Props) {
  // close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {couple && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="bg-white rounded-2xl w-[min(96vw,1100px)] max-h-[92vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Couple photo and details"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-1">
                {couple.names}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body: image + details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
              {/* Image */}
              <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
                <img
                  src={couple.photoUrl}
                  alt={couple.names}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow"
                  loading="eager"
                />
              </div>

              {/* Details (this pane can scroll if text is long) */}
              <div className="p-5 md:p-6 overflow-auto">
                <div className="grid grid-cols-1 gap-6">
                  {couple.weddingDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-pink-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Wedding Date
                        </p>
                        <p className="text-gray-800">
                          {new Date(couple.weddingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {couple.country && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-pink-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Country
                        </p>
                        <p className="text-gray-800">{couple.country}</p>
                      </div>
                    </div>
                  )}

                  {couple.story && (
                    <div className="text-left">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Love Story
                          </p>
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {couple.story}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500">
                    This couple joined the Love Wall on{" "}
                    {new Date(couple.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
