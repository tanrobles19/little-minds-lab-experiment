import Link from "next/link";
import { ArrowLeft, Palette } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/dictionaries";
import { ColorGrid } from "@/components/color-grid";
import { FloatingDecorations } from "@/components/floating-decorations";

export default async function LearnColors({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const texts = {
    labels: {
      white: dict.colors.white,
      black: dict.colors.black,
      yellow: dict.colors.yellow,
      green: dict.colors.green,
      purple: dict.colors.purple,
      pink: dict.colors.pink,
      blue: dict.colors.blue,
      red: dict.colors.red,
      orange: dict.colors.orange,
    },
    start: dict.colors.start,
    findThe: dict.colors.findThe,
    correct: dict.colors.correct,
    tryAgain: dict.colors.tryAgain,
    heading: dict.colors.heading,
    removeLabel: dict.common.remove,
  };

  return (
    <div className="h-dvh flex flex-col bg-gradient-to-b from-amber-50 via-sky-50 to-purple-50 font-sans overflow-hidden relative">
      <FloatingDecorations />
      <div className="relative z-10 flex flex-col flex-1 min-h-0 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3 mb-3 sm:mb-4 animate-[fadeSlideUp_0.6s_ease-out_both]">
          <Link
            href={`/${lang}`}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-sm font-bold text-slate-600 shadow-md transition-all duration-300 hover:shadow-lg hover:bg-white hover:-translate-y-0.5 tap-target"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {dict.common.back}
          </Link>
          <div className="size-8 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center">
            <Palette className="size-4 text-purple-500" />
          </div>
        </div>

        <ColorGrid texts={texts} />
      </div>
    </div>
  );
}
