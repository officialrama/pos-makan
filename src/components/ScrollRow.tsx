"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Baris kartu yang digeser mendatar. Tombol panah hanya muncul kalau memang
 * masih ada isi di arah itu — jadi hilang sendiri saat semua kartu sudah muat.
 */
export default function ScrollRow({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    // Lebar kartu bisa berubah saat layar diubah ukurannya.
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync, children]);

  function nudge(direction: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(el.clientWidth * 0.8, 180),
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={sync}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1"
      >
        {children}
      </div>

      {!atStart && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-canvas"
          />
          <ArrowButton side="kiri" onClick={() => nudge(-1)} />
        </>
      )}
      {!atEnd && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas"
          />
          <ArrowButton side="kanan" onClick={() => nudge(1)} />
        </>
      )}
    </div>
  );
}

function ArrowButton({
  side,
  onClick,
}: {
  side: "kiri" | "kanan";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Geser ke ${side}`}
      className={`absolute top-[45%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center
        rounded-full border border-line bg-white text-ink-700 shadow-sm transition-colors
        hover:border-go-500 hover:text-go-600 sm:inline-flex ${
          side === "kiri" ? "left-1" : "right-1"
        }`}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
        <path
          d={side === "kiri" ? "M12.25 4.5 6.75 10l5.5 5.5" : "M7.75 4.5 13.25 10l-5.5 5.5"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
