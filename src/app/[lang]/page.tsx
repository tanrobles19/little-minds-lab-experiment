import { getDictionary, type Locale } from "@/lib/dictionaries";
import { LanguageSwitcher } from "@/components/language-switcher";
import { TopicCard } from "@/components/topic-card";
import { FloatingDecorations } from "@/components/floating-decorations";

const topics = [
  {
    href: "learn-numbers",
    dictKey: "learnNumbers" as const,
    iconName: "Hash" as const,
    bg: "bg-gradient-to-br from-blue-400 to-blue-500",
    border3d: "border-b-[6px] border-r-[4px] border-blue-700",
    iconBg: "bg-white/25 border-2 border-white/20",
    emoji: "🔢",
  },
  {
    href: "learn-animals",
    dictKey: "learnAnimals" as const,
    iconName: "PawPrint" as const,
    bg: "bg-gradient-to-br from-emerald-400 to-emerald-500",
    border3d: "border-b-[6px] border-r-[4px] border-emerald-700",
    iconBg: "bg-white/25 border-2 border-white/20",
    emoji: "🐾",
  },
  {
    href: "learn-body-parts",
    dictKey: "learnBodyParts" as const,
    iconName: "Heart" as const,
    bg: "bg-gradient-to-br from-rose-400 to-rose-500",
    border3d: "border-b-[6px] border-r-[4px] border-rose-700",
    iconBg: "bg-white/25 border-2 border-white/20",
    emoji: "🧍",
  },
  {
    href: "learn-colors",
    dictKey: "learnColors" as const,
    iconName: "Palette" as const,
    bg: "bg-gradient-to-br from-purple-400 to-purple-500",
    border3d: "border-b-[6px] border-r-[4px] border-purple-700",
    iconBg: "bg-white/25 border-2 border-white/20",
    emoji: "🎨",
  },
  {
    href: "toy-box-drag-drop",
    dictKey: "sortYourStuff" as const,
    iconName: "Box" as const,
    bg: "bg-gradient-to-br from-amber-400 to-amber-500",
    border3d: "border-b-[6px] border-r-[4px] border-amber-700",
    iconBg: "bg-white/25 border-2 border-white/20",
    emoji: "📦",
  },
];

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-dvh flex flex-col font-sans bg-gradient-to-b from-amber-50 via-sky-50 to-purple-50 overflow-hidden relative">
      <FloatingDecorations />

      {/* Language switcher */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex justify-end px-6 pt-5 sm:pt-6">
        <LanguageSwitcher currentLang={lang} />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 w-full max-w-5xl mx-auto flex-col items-center justify-center px-6 py-8 sm:py-12">
        {/* Title area */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-5xl sm:text-6xl mb-4 block animate-[bounce_3s_ease-in-out_infinite]">🧒</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
            {dict.home.heading}
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-slate-500 font-medium">
            {dict.home.subtitle}
          </p>
        </div>

        {/* Topic cards */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 w-full max-w-2xl">
          {topics.map(({ href, dictKey, iconName, bg, border3d, iconBg, emoji }, index) => (
            <TopicCard
              key={href}
              href={`/${lang}/${href}`}
              label={dict.home[dictKey]}
              iconName={iconName}
              bg={bg}
              border3d={border3d}
              iconBg={iconBg}
              emoji={emoji}
              delay={index * 100}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
