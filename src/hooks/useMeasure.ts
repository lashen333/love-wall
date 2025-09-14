// src\hooks\useMeasure.ts
"use client";
import { useEffect, useRef, useState } from "react";

export default function useMeasure() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setRect(entry.contentRect));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return { ref, rect };
}
