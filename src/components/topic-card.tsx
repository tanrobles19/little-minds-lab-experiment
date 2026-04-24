"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Hash, PawPrint, Heart, Palette, Box } from "lucide-react";

const iconMap = {
  Hash,
  PawPrint,
  Heart,
  Palette,
  Box,
} as const;

interface TopicCardProps {
  href: string;
  label: string;
  iconName: keyof typeof iconMap;
  bg: string;
  border3d: string;
  iconBg: string;
  emoji: string;
  delay: number;
}

export function TopicCard({
  href,
  label,
  iconName,
  bg,
  border3d,
  iconBg,
  emoji,
  delay,
}: TopicCardProps) {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const Icon = iconMap[iconName];

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setPressed(true);
      setTimeout(() => {
        router.push(href);
      }, 800);
    },
    [href, router]
  );

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`group relative flex flex-col items-center gap-4 sm:gap-5 rounded-[2rem] ${bg} ${pressed ? "border-b-[2px] border-r-[2px]" : border3d} p-7 sm:p-9 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-1 active:border-b-[2px] active:border-r-[2px] transition-all ease-out animate-[fadeSlideUp_0.6s_ease-out_both] cursor-pointer ${pressed ? "!scale-95 !translate-y-1 duration-300" : "duration-150"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top shine */}
      <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-[2rem] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

      {/* Emoji badge */}
      <span
        className={`absolute -top-4 -right-3 text-3xl sm:text-4xl drop-shadow-md transition-transform ${pressed ? "scale-150 -translate-y-4 duration-500" : "group-hover:scale-125 group-hover:-rotate-12 duration-500"}`}
      >
        {emoji}
      </span>

      {/* Icon circle */}
      <div
        className={`${iconBg} rounded-2xl p-5 sm:p-6 backdrop-blur-sm transition-transform ${pressed ? "scale-125 rotate-12 duration-500" : "group-hover:scale-110 group-hover:rotate-3 duration-500"}`}
      >
        <Icon className="size-10 sm:size-12 text-white drop-shadow-lg" strokeWidth={2.5} />
      </div>

      {/* Label */}
      <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-white text-center drop-shadow-md tracking-wide">
        {label}
      </span>
    </a>
  );
}
