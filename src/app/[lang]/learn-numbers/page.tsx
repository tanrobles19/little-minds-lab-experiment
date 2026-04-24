import Link from "next/link";
import { ArrowLeft, Hash } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/dictionaries";
import { NumberGrid } from "@/components/number-grid";
import { FloatingDecorations } from "@/components/floating-decorations";

export default async function LearnNumbers({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const texts = {
    labels: {
      "0": dict.numbers["0"],
      "1": dict.numbers["1"],
      "2": dict.numbers["2"],
      "3": dict.numbers["3"],
      "4": dict.numbers["4"],
      "5": dict.numbers["5"],
      "6": dict.numbers["6"],
      "7": dict.numbers["7"],
      "8": dict.numbers["8"],
      "9": dict.numbers["9"],
    },
    start: dict.numbers.start,
    findThe: dict.numbers.findThe,
    correct: dict.numbers.correct,
    tryAgain: dict.numbers.tryAgain,
    heading: dict.numbers.heading,
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
          <div className="size-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center">
            <Hash className="size-4 text-blue-500" />
          </div>
        </div>

        <NumberGrid texts={texts} />
      </div>
    </div>
  );
}
