"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";

const colorItems = [
  { key: "white", bg: "bg-white border border-slate-300" },
  { key: "black", bg: "bg-zinc-900" },
  { key: "yellow", bg: "bg-yellow-400" },
  { key: "green", bg: "bg-green-500" },
  { key: "purple", bg: "bg-purple-500" },
  { key: "pink", bg: "bg-pink-400" },
  { key: "blue", bg: "bg-blue-500" },
  { key: "red", bg: "bg-red-500" },
  { key: "orange", bg: "bg-orange-500" },
];

function generatePositions() {
  // Spread colors across a 3×3 virtual grid with jitter so they overlap but aren't bunched
  return colorItems.map((_, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return {
      top: row * 25 + Math.random() * 15,
      left: col * 28 + Math.random() * 15,
      rotate: Math.floor(Math.random() * 40) - 20,
      z: i,
    };
  });
}

interface ToyBoxGameProps {
  colorLabels: Record<string, string>;
  heading: string;
  subtitle: string;
  done: string;
  reset: string;
}

export function ToyBoxGame({ colorLabels, subtitle, done, reset }: ToyBoxGameProps) {
  const [sorted, setSorted] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [overBox, setOverBox] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragKey = useRef<string | null>(null);

  const positions = useMemo(() => generatePositions(), []);
  const allSorted = sorted.size === colorItems.length;

  const playAudio = useCallback((key: string) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(`/${key}.m4a`);
    audioRef.current = audio;
    audio.play().catch(() => {});
  }, []);

  const isOverBox = useCallback((clientX: number, clientY: number) => {
    if (!boxRef.current) return false;
    const rect = boxRef.current.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }, []);

  const startDrag = useCallback((key: string, clientX: number, clientY: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top };
    dragKey.current = key;
    setDragging(key);
    setDragPos({ x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y });
  }, []);

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragKey.current) return;
    setDragPos({ x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y });
    setOverBox(isOverBox(clientX, clientY));
  }, [isOverBox]);

  const endDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragKey.current) return;
    const key = dragKey.current;

    if (isOverBox(clientX, clientY)) {
      playAudio(key);
      setSorted((prev) => new Set([...prev, key]));
    }

    dragKey.current = null;
    setDragging(null);
    setDragPos(null);
    setOverBox(false);
  }, [isOverBox, playAudio]);

  // Mouse events on window (so dragging works outside the card)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const handleMouseUp = (e: MouseEvent) => endDrag(e.clientX, e.clientY);

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, moveDrag, endDrag]);

  // Touch events on window
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragKey.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!dragKey.current) return;
      const touch = e.changedTouches[0];
      endDrag(touch.clientX, touch.clientY);
    };

    if (dragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, moveDrag, endDrag]);

  const handleReset = useCallback(() => {
    setSorted(new Set());
    setDragging(null);
    setDragPos(null);
    setOverBox(false);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col md:flex-row flex-1 min-h-0 gap-4 sm:gap-6">
      {/* LEFT — Scattered color pieces */}
      <div className="flex-1 min-h-0 relative">
        <p className="text-sm text-slate-500 font-medium mb-2">{subtitle}</p>

        <div className="relative w-full h-full min-h-[300px]">
          {colorItems.map((item, i) => {
            const pos = positions[i];
            const isSorted = sorted.has(item.key);
            const isBeingDragged = dragging === item.key;

            if (isSorted) return null;
            // The dragged card is rendered as a portal-like fixed element below
            if (isBeingDragged) return null;

            return (
              <div
                key={item.key}
                onMouseDown={(e) => {
                  e.preventDefault();
                  startDrag(item.key, e.clientX, e.clientY, e.currentTarget);
                }}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  startDrag(item.key, touch.clientX, touch.clientY, e.currentTarget);
                }}
                className={`absolute w-24 h-20 sm:w-32 sm:h-28 md:w-36 md:h-28 rounded-2xl shadow-xl cursor-grab transition-transform duration-300 select-none hover:z-50 hover:scale-110 ${item.bg}`}
                style={{
                  top: `${pos.top}%`,
                  left: `${pos.left}%`,
                  transform: `rotate(${pos.rotate}deg)`,
                  zIndex: pos.z + 1,
                }}
              >
                <span
                  className="absolute bottom-1.5 left-0 right-0 text-center text-xs sm:text-sm font-bold drop-shadow-md"
                  style={{ color: item.key === "white" || item.key === "yellow" ? "#475569" : "white" }}
                >
                  {colorLabels[item.key]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT — Toy Box (bottom-aligned) */}
      <div className="md:w-[40%] flex items-end justify-center min-h-0 shrink-0">
        {allSorted ? (
          <div className="flex flex-col items-center justify-center gap-4 pb-8">
            <span className="text-6xl animate-[bounce_2s_ease-in-out_infinite]">🎉</span>
            <p className="text-2xl font-extrabold text-slate-800">{done}</p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-semibold text-black transition-all duration-300 hover:from-amber-400 hover:to-orange-400 active:scale-[0.97] tap-target"
            >
              <RotateCcw className="size-4" />
              {reset}
            </button>
          </div>
        ) : (
          <div
            ref={boxRef}
            className={`relative w-full max-w-sm transition-all duration-300 ${
              overBox ? "scale-105 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]" : ""
            }`}
          >
            <Image
              src="/toy_box.png"
              alt="Toy Box"
              width={600}
              height={600}
              className="w-full h-auto object-contain drop-shadow-2xl pointer-events-none"
            />
            {sorted.size > 0 && (
              <span className="absolute top-2 right-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-sm font-bold text-emerald-600 shadow-sm">
                {sorted.size} / {colorItems.length}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Floating dragged card — follows cursor exactly */}
      {dragging && dragPos && (() => {
        const item = colorItems.find((c) => c.key === dragging);
        if (!item) return null;
        return (
          <div
            className={`fixed w-32 h-28 sm:w-36 sm:h-28 rounded-2xl shadow-2xl z-[9999] pointer-events-none scale-110 ${item.bg}`}
            style={{
              left: dragPos.x,
              top: dragPos.y,
              transition: "none",
            }}
          >
            <span
              className="absolute bottom-1.5 left-0 right-0 text-center text-sm font-bold drop-shadow-md"
              style={{ color: item.key === "white" || item.key === "yellow" ? "#475569" : "white" }}
            >
              {colorLabels[item.key]}
            </span>
          </div>
        );
      })()}
    </div>
  );
}
