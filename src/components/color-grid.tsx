"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { Play, Trash2 } from "lucide-react";
import { Celebration } from "@/components/celebration";

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRandom<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

const colorKeys = ["white","black","yellow","green","purple","pink","blue","red","orange"] as const;

const colorStyles: Record<string, { bg: string }> = {
  white: { bg: "bg-white" }, black: { bg: "bg-zinc-900" },
  yellow: { bg: "bg-yellow-400" }, green: { bg: "bg-green-500" },
  purple: { bg: "bg-purple-500" }, pink: { bg: "bg-pink-400" },
  blue: { bg: "bg-blue-500" }, red: { bg: "bg-red-500" },
  orange: { bg: "bg-orange-500" },
};

interface ColorGameTexts {
  labels: Record<string, string>;
  start: string;
  findThe: string;
  correct: string;
  tryAgain: string;
  heading: string;
  removeLabel: string;
}

type GameState = "idle" | "playing" | "correct" | "wrong";

export function ColorGrid({ texts }: { texts: ColorGameTexts }) {
  const colors = useMemo(() => shuffle([...colorKeys]), []);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [targetColor, setTargetColor] = useState<string | null>(null);
  const [removeMode, setRemoveMode] = useState(false);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [celebrating, setCelebrating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((colorKey: string) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(`/${colorKey}.m4a`);
    audioRef.current = audio;
    audio.play();
  }, []);

  const availableKeys = colors.filter((k) => !removed.has(k));

  const startRound = useCallback(() => {
    const available = colorKeys.filter((k) => !removed.has(k));
    if (available.length === 0) return;
    const color = pickRandom(available);
    setTargetColor(color);
    setGameState("playing");
    setTimeout(() => playAudio(color), 1000);
  }, [playAudio, removed]);

  const handleColorClick = useCallback(
    (key: string) => {
      if (gameState !== "playing") return;
      playAudio(key);

      if (key === targetColor) {
        setGameState("correct");
        const newRemoved = removeMode ? new Set([...removed, key]) : removed;
        if (removeMode) setRemoved(newRemoved);

        const remaining = colorKeys.filter((k) => !newRemoved.has(k));
        if (remaining.length === 0) {
          setTimeout(() => { setCelebrating(true); setGameState("idle"); }, 1200);
        } else {
          setTimeout(() => {
            const next = pickRandom(remaining);
            setTargetColor(next);
            setGameState("playing");
            setTimeout(() => playAudio(next), 1000);
          }, 1200);
        }
      } else {
        setGameState("wrong");
        setTimeout(() => setGameState("playing"), 600);
      }
    },
    [gameState, targetColor, playAudio, removeMode, removed]
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-3 sm:mb-4 flex-wrap">
        {gameState === "idle" ? (
          <div className="hidden sm:flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-700">{texts.heading}</h1>
          </div>
        ) : null}

        <button onClick={startRound} disabled={availableKeys.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-semibold text-black transition-all duration-300 hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.97] tap-target disabled:opacity-50">
          <Play className="size-4" />{texts.start}
        </button>

        {gameState !== "idle" && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">{texts.findThe}</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-800 animate-[fadeSlideUp_0.3s_ease-out_both]" key={targetColor}>
                {targetColor ? texts.labels[targetColor] : ""}
              </span>
            </div>
            {gameState === "correct" && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-sm font-bold text-emerald-600 shadow-sm animate-[fadeSlideUp_0.3s_ease-out_both]">{texts.correct}</span>
            )}
            {gameState === "wrong" && (
              <span className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-sm font-bold text-red-600 shadow-sm animate-[fadeSlideUp_0.3s_ease-out_both]">{texts.tryAgain}</span>
            )}
          </>
        )}

        <button onClick={() => setRemoveMode(!removeMode)}
          className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 tap-target ${removeMode ? "bg-rose-500 text-white shadow-md shadow-rose-300/40" : "bg-white/80 border border-slate-200 text-slate-500 shadow-sm hover:bg-white"}`}>
          <Trash2 className="size-3.5" />{texts.removeLabel}
        </button>
      </div>

      <div className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 flex-1 min-h-0 max-h-[75dvh] self-center w-full">
        {colors.map((key, index) => {
          const { bg } = colorStyles[key];
          const isPlaying = gameState === "playing";
          const isRemoved = removed.has(key);

          return (
            <div key={key} onClick={() => !isRemoved && handleColorClick(key)}
              className={`group relative rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg shadow-slate-300/30 hover:shadow-xl hover:shadow-slate-400/30 hover:-translate-y-1 active:scale-[0.97] transition-all duration-500 ease-out overflow-hidden animate-[fadeSlideUp_0.6s_ease-out_both] ${isPlaying && !isRemoved ? "cursor-pointer" : ""} ${isRemoved ? "!opacity-0 !scale-75 pointer-events-none" : ""}`}
              style={{ animationDelay: `${200 + index * 80}ms` }}>
              <div className={`absolute inset-2 sm:inset-3 rounded-xl ${bg} transition-transform duration-700 ease-out group-hover:scale-105 shadow-lg shadow-slate-400/30`} />
            </div>
          );
        })}
      </div>
      {celebrating && <Celebration onComplete={() => setCelebrating(false)} />}
    </>
  );
}
