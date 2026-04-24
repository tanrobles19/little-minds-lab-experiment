import { Star, Sparkles } from "lucide-react";

export function FloatingDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Stars */}
      <Star className="absolute top-[8%] left-[8%] size-8 text-yellow-300 fill-yellow-300 opacity-60 animate-[spin_8s_linear_infinite]" />
      <Star className="absolute top-[15%] right-[12%] size-6 text-yellow-400 fill-yellow-400 opacity-50 animate-[spin_12s_linear_infinite]" />
      <Star className="absolute bottom-[20%] left-[5%] size-5 text-amber-300 fill-amber-300 opacity-40 animate-[spin_10s_linear_infinite]" />
      <Sparkles className="absolute top-[25%] left-[15%] size-7 text-pink-300 opacity-50 animate-[bounce_3s_ease-in-out_infinite]" />
      <Sparkles className="absolute bottom-[30%] right-[10%] size-6 text-purple-300 opacity-40 animate-[bounce_4s_ease-in-out_infinite_0.5s]" />

      {/* Toy blocks */}
      <div className="absolute top-[12%] right-[20%] size-10 rounded-lg bg-red-300/40 rotate-12 border-2 border-red-300/30" />
      <div className="absolute bottom-[15%] left-[12%] size-12 rounded-lg bg-blue-300/40 -rotate-12 border-2 border-blue-300/30" />
      <div className="absolute bottom-[25%] right-[18%] size-8 rounded-lg bg-green-300/40 rotate-6 border-2 border-green-300/30" />
      <div className="absolute top-[35%] left-[6%] size-9 rounded-lg bg-yellow-300/40 -rotate-6 border-2 border-yellow-300/30" />

      {/* Circles / balls */}
      <div className="absolute top-[5%] left-[45%] size-14 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 opacity-40" />
      <div className="absolute bottom-[10%] right-[30%] size-10 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-40" />
      <div className="absolute bottom-[8%] left-[35%] size-8 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 opacity-30" />

      {/* Floating emojis */}
      <span className="absolute top-[6%] right-[35%] text-4xl opacity-30 animate-[bounce_5s_ease-in-out_infinite]">🧸</span>
      <span className="absolute bottom-[12%] left-[25%] text-3xl opacity-25 animate-[bounce_4s_ease-in-out_infinite_1s]">🪁</span>
      <span className="absolute top-[18%] left-[30%] text-3xl opacity-25 animate-[bounce_6s_ease-in-out_infinite_0.5s]">🎈</span>
      <span className="absolute bottom-[18%] right-[8%] text-4xl opacity-20 animate-[bounce_5s_ease-in-out_infinite_2s]">🚀</span>
      <span className="absolute top-[40%] right-[5%] text-3xl opacity-20 animate-[bounce_4s_ease-in-out_infinite_1.5s]">🌈</span>
    </div>
  );
}
