"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  getLanguageOption,
  languageOptions,
  languages,
  type AppLanguage,
} from "@/lib/i18n";

function buildLocalizedPath(pathname: string, lang: AppLanguage): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${lang}`;
  if ((languages as readonly string[]).includes(segments[0]!)) {
    segments[0] = lang;
  } else {
    segments.unshift(lang);
  }
  return `/${segments.join("/")}`;
}

export default function LanguageSwitcher({
  currentLang,
}: {
  currentLang: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingLang, setPendingLang] = useState<AppLanguage | null>(null);
  const currentOption =
    getLanguageOption(currentLang) ?? getLanguageOption("nl");

  useEffect(() => {
    if (!pendingLang) return;
    document.cookie = `preferred_lang=${pendingLang}; path=/; max-age=31536000`;
  }, [pendingLang]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(lang: AppLanguage) {
    setIsOpen(false);
    setPendingLang(lang);
    router.push(buildLocalizedPath(pathname, lang));
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex items-center gap-2 h-9 rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white font-semibold transition hover:border-white/50 hover:bg-white/20"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4 text-white/70" />
        <span className="text-base leading-none">{currentOption?.flag}</span>
        <span className="text-xs font-bold tracking-wide">
          {currentOption?.code.toUpperCase()}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-white/10 bg-[#022b14] shadow-2xl overflow-hidden">
          <ul
            role="listbox"
            className="max-h-72 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full"
            style={{
              scrollbarColor: "rgba(255,255,255,0.3) transparent",
              scrollbarWidth: "thin",
            }}
          >
            {languageOptions.map((opt) => (
              <li key={opt.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.code === currentLang}
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 ${
                    opt.code === currentLang
                      ? "text-white font-bold"
                      : "text-white/80"
                  }`}
                >
                  <span className="text-base">{opt.flag}</span>
                  <span>{opt.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
