import "server-only";

export { type Locale, defaultLocale, locales } from "./i18n-config";
import type { Locale } from "./i18n-config";
import { defaultLocale } from "./i18n-config";

// Infer dictionary type from the English file
type Dictionary = typeof import("@/dictionaries/en.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale];
  if (!loader) {
    return dictionaries[defaultLocale]();
  }
  return loader();
}
