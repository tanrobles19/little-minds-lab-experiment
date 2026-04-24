"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import Image from "next/image";
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

const numberKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const numberAudio: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
  "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
};

interface NumberGameTexts {
  labels: Record<string, string>;
  start: string;
  findThe: string;
  correct: string;
  tryAgain: string;
  heading: string;
  removeLabel: string;
}

type GameState = "idle" | "playing" | "correct" | "wrong";

export function NumberGrid({ texts }: { texts: NumberGameTexts }) {
  const numbers = useMemo(() => shuffle([...numberKeys]), []);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [targetNumber, setTargetNumber] = useState<string | null>(null);
  const [removeMode, setRemoveMode] = useState(false);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [celebrating, setCelebrating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((numKey: string) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(`/${numberAudio[numKey]}.m4a`);
    audioRef.current = audio;
    audio.play();
  }, []);

  const availableKeys = numbers.filter((k) => !removed.has(k));

  const startRound = useCallback(() => {
    const available = numberKeys.filter((k) => !removed.has(k));
    if (available.length === 0) return;
    const num = pickRandom(available);
    setTargetNumber(num);
    setGameState("playing");
    setTimeout(() => playAudio(num), 1000);
  }, [playAudio, removed]);

  const handleNumberClick = useCallback(
    (key: string) => {
      if (gameState !== "playing") return;
      playAudio(key);

      if (key === targetNumber) {
        setGameState("correct");
        const newRemoved = removeMode ? new Set([...removed, key]) : removed;
        if (removeMode) setRemoved(newRemoved);

        const remaining = numberKeys.filter((k) => !newRemoved.has(k));
        if (remaining.length === 0) {
          setTimeout(() => { setCelebrating(true); setGameState("idle"); }, 1200);
        } else {
          setTimeout(() => {
            const next = pickRandom(remaining);
            setTargetNumber(next);
            setGameState("playing");
            setTimeout(() => playAudio(next), 1000);
          }, 1200);
        }
      } else {
        setGameState("wrong");
        setTimeout(() => setGameState("playing"), 600);
      }
    },
    [gameState, targetNumber, startRound, playAudio, removeMode, removed]
  );

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3 sm:mb-4 flex-wrap">
        {gameState === "idle" ? (
          <div className="hidden sm:flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-700">
              {texts.heading}
            </h1>
          </div>
        ) : null}

        <button
          onClick={startRound}
          disabled={availableKeys.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-semibold text-black transition-all duration-300 hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.97] tap-target disabled:opacity-50"
        >
          <Play className="size-4" />
          {texts.start}
        </button>

        {gameState !== "idle" && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">{texts.findThe}</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-800 animate-[fadeSlideUp_0.3s_ease-out_both]" key={targetNumber}>
                {targetNumber !== null ? texts.labels[targetNumber] : ""}
              </span>
            </div>
            {gameState === "correct" && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-sm font-bold text-emerald-600 shadow-sm animate-[fadeSlideUp_0.3s_ease-out_both]">
                {texts.correct}
              </span>
            )}
            {gameState === "wrong" && (
              <span className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-sm font-bold text-red-600 shadow-sm animate-[fadeSlideUp_0.3s_ease-out_both]">
                {texts.tryAgain}
              </span>
            )}
          </>
        )}

        {/* Remove toggle — pushed to the right */}
        <button
          onClick={() => setRemoveMode(!removeMode)}
          className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 tap-target ${
            removeMode
              ? "bg-rose-500 text-white shadow-md shadow-rose-300/40"
              : "bg-white/80 border border-slate-200 text-slate-500 shadow-sm hover:bg-white"
          }`}
        >
          <Trash2 className="size-3.5" />
          {texts.removeLabel}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 grid-rows-5 md:grid-rows-2 gap-3 sm:gap-4 flex-1 min-h-0 max-h-[75dvh] self-center w-full">
        {numbers.map((key, index) => {
          const isPlaying = gameState === "playing";
          const isRemoved = removed.has(key);

          return (
            <div
              key={key}
              onClick={() => !isRemoved && handleNumberClick(key)}
              className={`group relative rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-lg shadow-slate-300/30 hover:shadow-xl hover:shadow-slate-400/30 hover:-translate-y-1 active:scale-[0.97] transition-all duration-500 ease-out overflow-hidden animate-[fadeSlideUp_0.6s_ease-out_both] ${isPlaying && !isRemoved ? "cursor-pointer" : ""} ${isRemoved ? "!opacity-0 !scale-75 pointer-events-none" : ""}`}
              style={{ animationDelay: `${200 + index * 80}ms` }}
            >
              <div className="absolute inset-2 sm:inset-3 rounded-xl bg-slate-50 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                  src={`/${key}.svg`}
                  alt={texts.labels[key]}
                  width={120}
                  height={120}
                  className="w-3/4 h-3/4 object-contain drop-shadow-lg"
                />
              </div>
            </div>
          );
        })}
      </div>
      {celebrating && <Celebration onComplete={() => setCelebrating(false)} />}
    </>
  );
}
