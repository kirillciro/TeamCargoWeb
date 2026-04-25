import { defaultLang, isSupportedLanguage, type AppLanguage } from "@/lib/i18n";
import type nlDict from "@/dictionaries/nl.json";

export type Dictionary = typeof nlDict;

const dictionaries: Record<AppLanguage, () => Promise<Dictionary>> = {
  nl: () => import("@/dictionaries/nl.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  de: () => import("@/dictionaries/de.json").then((m) => m.default),
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
  it: () => import("@/dictionaries/it.json").then((m) => m.default),
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
  pt: () => import("@/dictionaries/pt.json").then((m) => m.default),
  pl: () => import("@/dictionaries/pl.json").then((m) => m.default),
  ro: () => import("@/dictionaries/ro.json").then((m) => m.default),
  et: () => import("@/dictionaries/et.json").then((m) => m.default),
  lv: () => import("@/dictionaries/lv.json").then((m) => m.default),
  fi: () => import("@/dictionaries/fi.json").then((m) => m.default),
  sv: () => import("@/dictionaries/sv.json").then((m) => m.default),
  da: () => import("@/dictionaries/da.json").then((m) => m.default),
  no: () => import("@/dictionaries/no.json").then((m) => m.default),
  cs: () => import("@/dictionaries/cs.json").then((m) => m.default),
  hu: () => import("@/dictionaries/hu.json").then((m) => m.default),
  el: () => import("@/dictionaries/el.json").then((m) => m.default),
};

export async function getDictionary(lang: string): Promise<Dictionary> {
  const resolvedLang = isSupportedLanguage(lang) ? lang : defaultLang;
  return dictionaries[resolvedLang]();
}
