"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

const flags: Record<string, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
};

const labels: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const otherLang = currentLang === "en" ? "es" : "en";

  function handleSwitch() {
    const newPath = pathname.replace(`/${currentLang}`, `/${otherLang}`);
    router.push(newPath);
  }

  return (
    <button
      onClick={handleSwitch}
      className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 px-4 py-2 text-sm font-bold shadow-md hover:shadow-lg hover:bg-white hover:-translate-y-0.5 active:scale-95 transition-all duration-300 tap-target"
      aria-label={`Switch to ${otherLang === "en" ? "English" : "Spanish"}`}
    >
      <Globe className="size-4 text-slate-400" />
      <span className="text-slate-400">{labels[currentLang]}</span>
      <span className="text-slate-300">/</span>
      <span className="text-slate-700">{flags[otherLang]} {labels[otherLang]}</span>
    </button>
  );
}
