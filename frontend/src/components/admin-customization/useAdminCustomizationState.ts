"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/getDictionary";
import {
  COLOR_DEFAULTS,
  CSS_VAR_MAP,
  DEFAULT_PARTNERS,
  DEFAULT_SVC_CARDS,
  FONT_OPTIONS,
  LS_COLORS,
  LS_FONT,
  LS_HEADER,
  LS_HERO,
  LS_SERVICES,
  LS_ABOUT,
  LS_HOUSING,
  LS_CONTACT,
  LS_FOOTER,
  type ColorKey,
  type SubTab,
  type SectionKey,
  type ServicesSectionKey,
  type AboutSectionKey,
  type HousingSectionKey,
  type ContactSectionKey,
  type FontOption,
} from "./types";

export function useAdminCustomizationState({
  dict,
  win98,
}: {
  dict: Dictionary;
  win98: boolean;
}) {
  const [subTab, setSubTab] = useState<SubTab>("colors");

  // ── Header ────────────────────────────────────────────────────────────────
  const [headerTransparent, setHeaderTransparent] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem(LS_HEADER);
      if (saved)
        return (
          (JSON.parse(saved) as { transparent: boolean }).transparent !== false
        );
    } catch {
      /* ignore */
    }
    return true;
  });
  const [headerSaved, setHeaderSaved] = useState(false);

  // ── Colors ────────────────────────────────────────────────────────────────
  const [colors, setColors] = useState<typeof COLOR_DEFAULTS>(() => {
    if (typeof window === "undefined") return COLOR_DEFAULTS;
    try {
      const saved = localStorage.getItem(LS_COLORS);
      return saved
        ? (JSON.parse(saved) as typeof COLOR_DEFAULTS)
        : COLOR_DEFAULTS;
    } catch {
      return COLOR_DEFAULTS;
    }
  });
  const [colorSaved, setColorSaved] = useState(false);

  // ── Fonts ─────────────────────────────────────────────────────────────────
  const [selectedFont, setSelectedFont] = useState<string>(() => {
    if (typeof window === "undefined") return "helvetica";
    try {
      const saved = localStorage.getItem(LS_FONT);
      if (saved) return (JSON.parse(saved) as { id: string }).id ?? "helvetica";
    } catch {
      /* ignore */
    }
    return "helvetica";
  });
  const [letterSpacing, setLetterSpacing] = useState(() => {
    if (typeof window === "undefined") return "0.02";
    try {
      const saved = localStorage.getItem(LS_FONT);
      if (saved)
        return (
          (JSON.parse(saved) as { letterSpacing?: string }).letterSpacing ??
          "0.02"
        );
    } catch {
      /* ignore */
    }
    return "0.02";
  });
  const [lineHeight, setLineHeight] = useState(() => {
    if (typeof window === "undefined") return "1.65";
    try {
      const saved = localStorage.getItem(LS_FONT);
      if (saved)
        return (
          (JSON.parse(saved) as { lineHeight?: string }).lineHeight ?? "1.65"
        );
    } catch {
      /* ignore */
    }
    return "1.65";
  });
  const [fontWeight, setFontWeight] = useState(() => {
    if (typeof window === "undefined") return "400";
    try {
      const saved = localStorage.getItem(LS_FONT);
      if (saved)
        return (
          (JSON.parse(saved) as { fontWeight?: string }).fontWeight ?? "400"
        );
    } catch {
      /* ignore */
    }
    return "400";
  });
  const [fontSaved, setFontSaved] = useState(false);

  // ── Parse all localStorage sections once at init ──────────────────────────
  const [_lsData] = useState(() => {
    if (typeof window === "undefined")
      return {
        hero: null,
        svc: null,
        about: null,
        housing: null,
        contact: null,
        footer: null,
      } as {
        hero: Record<string, unknown> | null;
        svc: Record<string, string> | null;
        about: Record<string, string> | null;
        housing: Record<string, string> | null;
        contact: Record<string, string> | null;
        footer: Record<string, string> | null;
      };
    const parse = <T>(key: string): T | null => {
      try {
        const s = localStorage.getItem(key);
        return s ? (JSON.parse(s) as T) : null;
      } catch {
        return null;
      }
    };
    return {
      hero: parse<Record<string, unknown>>(LS_HERO),
      svc: parse<Record<string, string>>(LS_SERVICES),
      about: parse<Record<string, string>>(LS_ABOUT),
      housing: parse<Record<string, string>>(LS_HOUSING),
      contact: parse<Record<string, string>>(LS_CONTACT),
      footer: parse<Record<string, string>>(LS_FOOTER),
    };
  });
  const _h = _lsData.hero;
  const _s = _lsData.svc;
  const _a = _lsData.about;
  const _hg = _lsData.housing;
  const _c = _lsData.contact;
  const _ft = _lsData.footer;

  // ── Hero text ─────────────────────────────────────────────────────────────
  const [slogan, setSlogan] = useState(() => (_h?.slogan as string) ?? "");
  const [badge, setBadge] = useState(() => (_h?.badge as string) ?? "");
  const [trustLine, setTrustLine] = useState(
    () => (_h?.trustLine as string) ?? "",
  );
  const [heroTrustIcon, setHeroTrustIcon] = useState(
    () => (_h?.trustIcon as string) ?? "",
  );
  const [heroTrustIconPicker, setHeroTrustIconPicker] = useState(false);
  const [heroTrustIconPage, setHeroTrustIconPage] = useState(0);
  const [sectionSaved, setSectionSaved] = useState<Record<SectionKey, boolean>>(
    {
      slogan: false,
      badge: false,
      trustLine: false,
      trustIcon: false,
      trustBg: false,
      partnersBg: false,
      stats: false,
      partners: false,
      heroImgDesktop: false,
      heroImgMobile: false,
    },
  );
  const [savingKey, setSavingKey] = useState<SectionKey | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [allSaved, setAllSaved] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  // ── Hero stats ────────────────────────────────────────────────────────────
  const [stat1Value, setStat1Value] = useState(
    () => (_h?.stat1Value as string) ?? "",
  );
  const [stat1Label, setStat1Label] = useState(
    () => (_h?.stat1Label as string) ?? "",
  );
  const [stat2Value, setStat2Value] = useState(
    () => (_h?.stat2Value as string) ?? "",
  );
  const [stat2Label, setStat2Label] = useState(
    () => (_h?.stat2Label as string) ?? "",
  );
  const [stat3Value, setStat3Value] = useState(
    () => (_h?.stat3Value as string) ?? "",
  );
  const [stat3Label, setStat3Label] = useState(
    () => (_h?.stat3Label as string) ?? "",
  );
  const [stat4Value, setStat4Value] = useState(
    () => (_h?.stat4Value as string) ?? "",
  );
  const [stat4Label, setStat4Label] = useState(
    () => (_h?.stat4Label as string) ?? "",
  );
  const [trustBg, setTrustBg] = useState(
    () => (_h?.trustBg as string) ?? COLOR_DEFAULTS.trustBg,
  );
  const [partnersBg, setPartnersBg] = useState(
    () => (_h?.partnersBg as string) ?? "#ffffff",
  );
  const [heroImgDesktop, setHeroImgDesktop] = useState(
    () => (_h?.heroImgDesktop as string) ?? "",
  );
  const [heroImgMobile, setHeroImgMobile] = useState(
    () => (_h?.heroImgMobile as string) ?? "",
  );

  // ── Partners ──────────────────────────────────────────────────────────────
  const [partners, setPartners] = useState<{ name: string; logo: string }[]>(
    () => {
      const p = _h?.partners as { name: string; logo: string }[] | undefined;
      return p && p.length > 0 ? p : DEFAULT_PARTNERS;
    },
  );
  const [heroTranslationPending, setHeroTranslationPending] = useState(false);

  // ── Services ──────────────────────────────────────────────────────────────
  const [svcTitle, setSvcTitle] = useState(() => _s?.title ?? "");
  const [svcLabel, setSvcLabel] = useState(() => _s?.label ?? "");
  const [svcCards, setSvcCards] = useState<
    { title: string; desc: string; img: string }[]
  >(() => {
    if (!_s) return DEFAULT_SVC_CARDS;
    return DEFAULT_SVC_CARDS.map((c, i) => ({
      title: _s[`item${i}Title`] ?? "",
      desc: _s[`item${i}Desc`] ?? "",
      img: _s[`img${i}`] ?? c.img,
    }));
  });
  const [svcSectionSaved, setSvcSectionSaved] = useState<
    Record<ServicesSectionKey, boolean>
  >({
    svcHeading: false,
    svcCard0: false,
    svcCard1: false,
    svcCard2: false,
    svcCard3: false,
    svcCard4: false,
    svcCard5: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_svcSavingKey, setSvcSavingKey] = useState<ServicesSectionKey | null>(
    null,
  );
  const [svcTranslating, setSvcTranslating] = useState(false);
  const [svcTranslateError, setSvcTranslateError] = useState<string | null>(
    null,
  );
  const [svcSavingAll, setSvcSavingAll] = useState(false);
  const [svcAllSaved, setSvcAllSaved] = useState(false);
  const [svcTranslationPending, setSvcTranslationPending] = useState(false);

  // ── About ─────────────────────────────────────────────────────────────────
  const [aboutLabel, setAboutLabel] = useState(() => _a?.label ?? "");
  const [aboutTitle, setAboutTitle] = useState(() => _a?.title ?? "");
  const [aboutDesc, setAboutDesc] = useState(() => _a?.description ?? "");
  const [aboutDesc2, setAboutDesc2] = useState(() => _a?.description2 ?? "");
  const [aboutValuesTitle, setAboutValuesTitle] = useState(
    () => _a?.valuesTitle ?? "",
  );
  const [aboutValues, setAboutValues] = useState(() => [
    _a?.value0 ?? "",
    _a?.value1 ?? "",
    _a?.value2 ?? "",
    _a?.value3 ?? "",
  ]);
  const [aboutDriversPlaced, setAboutDriversPlaced] = useState(
    () => _a?.driversPlaced ?? "",
  );
  const [aboutYearsActive, setAboutYearsActive] = useState(
    () => _a?.yearsActive ?? "",
  );
  const [aboutLocation, setAboutLocation] = useState(() => _a?.location ?? "");
  const [aboutYearsActiveNum, setAboutYearsActiveNum] = useState(
    () => _a?.yearsActiveNum ?? "",
  );
  const [aboutDriversIcon, setAboutDriversIcon] = useState(
    () => _a?.driversIcon ?? "",
  );
  const [aboutLocationIcon, setAboutLocationIcon] = useState(
    () => _a?.locationIcon ?? "",
  );
  const [aboutIconPicker, setAboutIconPicker] = useState<
    "drivers" | "location" | null
  >(null);
  const [aboutDriversIconPage, setAboutDriversIconPage] = useState(0);
  const [aboutLocationIconPage, setAboutLocationIconPage] = useState(0);
  const [aboutImgLeft, setAboutImgLeft] = useState(() => _a?.imgLeft ?? "");
  const [aboutImgTopRight, setAboutImgTopRight] = useState(
    () => _a?.imgTopRight ?? "",
  );
  const [aboutImgBottomRight, setAboutImgBottomRight] = useState(
    () => _a?.imgBottomRight ?? "",
  );
  const [aboutSectionSaved, setAboutSectionSaved] = useState<
    Record<AboutSectionKey, boolean>
  >({
    aboutHeading: false,
    aboutDescriptions: false,
    aboutValues: false,
    aboutBadges: false,
    aboutImgLeft: false,
    aboutImgTopRight: false,
    aboutImgBottomRight: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_aboutSavingKey, setAboutSavingKey] = useState<AboutSectionKey | null>(
    null,
  );
  const [aboutTranslating, setAboutTranslating] = useState(false);
  const [aboutTranslateError, setAboutTranslateError] = useState<string | null>(
    null,
  );
  const [aboutSavingAll, setAboutSavingAll] = useState(false);
  const [aboutAllSaved, setAboutAllSaved] = useState(false);
  const [aboutTranslationPending, setAboutTranslationPending] = useState(false);

  // ── Housing ───────────────────────────────────────────────────────────────
  const [housingLabel, setHousingLabel] = useState(() => _hg?.label ?? "");
  const [housingTitle, setHousingTitle] = useState(() => _hg?.title ?? "");
  const [housingDesc, setHousingDesc] = useState(() => _hg?.description ?? "");
  const [housingPerks, setHousingPerks] = useState(() => [
    _hg?.perk0 ?? "",
    _hg?.perk1 ?? "",
    _hg?.perk2 ?? "",
    _hg?.perk3 ?? "",
  ]);
  const [housingCta, setHousingCta] = useState(() => _hg?.cta ?? "");
  const [housingPerkIcons, setHousingPerkIcons] = useState(() => [
    _hg?.perk0Icon ?? "",
    _hg?.perk1Icon ?? "",
    _hg?.perk2Icon ?? "",
    _hg?.perk3Icon ?? "",
  ]);
  const [housingImg1, setHousingImg1] = useState(() => _hg?.img1 ?? "");
  const [housingImg2, setHousingImg2] = useState(() => _hg?.img2 ?? "");
  const [housingBg, setHousingBg] = useState(() => _hg?.bg ?? "");
  const [housingIconPicker, setHousingIconPicker] = useState<number | null>(
    null,
  );
  const [housingIconPages, setHousingIconPages] = useState([0, 0, 0, 0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_housingSectionSaved, setHousingSectionSaved] = useState<
    Record<HousingSectionKey, boolean>
  >({
    housingHeading: false,
    housingDescription: false,
    housingPerks: false,
    housingCta: false,
    housingImg1: false,
    housingImg2: false,
    housingBg: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_housingSavingKey, setHousingSavingKey] =
    useState<HousingSectionKey | null>(null);
  const [housingTranslating, setHousingTranslating] = useState(false);
  const [housingTranslateError, setHousingTranslateError] = useState<
    string | null
  >(null);
  const [housingSavingAll, setHousingSavingAll] = useState(false);
  const [housingAllSaved, setHousingAllSaved] = useState(false);
  const [housingTranslationPending, setHousingTranslationPending] =
    useState(false);

  // ── Contact ───────────────────────────────────────────────────────────────
  const [contactTitle, setContactTitle] = useState(() => _c?.title ?? "");
  const [contactSubtitle, setContactSubtitle] = useState(
    () => _c?.subtitle ?? "",
  );
  const [contactPhoneLabel, setContactPhoneLabel] = useState(
    () => _c?.phone ?? "",
  );
  const [contactEmailLabel, setContactEmailLabel] = useState(
    () => _c?.email ?? "",
  );
  const [contactAddressLabel, setContactAddressLabel] = useState(
    () => _c?.address ?? "",
  );
  const [contactMapPin, setContactMapPin] = useState(() => _c?.map_pin ?? "");
  const [contactWhatsapp, setContactWhatsapp] = useState(
    () => _c?.whatsapp_number ?? "",
  );
  const [contactEmailAddress, setContactEmailAddress] = useState(
    () => _c?.email_address ?? "",
  );
  const [contactMapAddress, setContactMapAddress] = useState(
    () => _c?.map_address ?? "",
  );
  const [contactImg, setContactImg] = useState(() => _c?.img ?? "");
  const [contactSectionSaved, setContactSectionSaved] = useState<
    Record<ContactSectionKey, boolean>
  >({
    contactHeading: false,
    contactDetails: false,
    contactLabels: false,
    contactMapPin: false,
    contactImg: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_contactSavingKey, setContactSavingKey] =
    useState<ContactSectionKey | null>(null);
  const [contactTranslating, setContactTranslating] = useState(false);
  const [contactTranslateError, setContactTranslateError] = useState<
    string | null
  >(null);
  const [contactSavingAll, setContactSavingAll] = useState(false);
  const [contactAllSaved, setContactAllSaved] = useState(false);
  const [contactTranslationPending, setContactTranslationPending] =
    useState(false);
  const [contactRowIcons, setContactRowIcons] = useState(() => [
    _c?.phoneIcon ?? "",
    _c?.emailIcon ?? "",
    _c?.addressIcon ?? "",
  ]);
  const [contactIconPicker, setContactIconPicker] = useState<number | null>(
    null,
  );
  const [contactIconPages, setContactIconPages] = useState([0, 0, 0]);

  // ── Footer ────────────────────────────────────────────────────────────────
  const [footerTaglineSub, setFooterTaglineSub] = useState(
    () => _ft?.tagline_sub ?? "",
  );
  const [footerAddressLine1, setFooterAddressLine1] = useState(
    () => _ft?.address_line1 ?? "",
  );
  const [footerAddressLine2, setFooterAddressLine2] = useState(
    () => _ft?.address_line2 ?? "",
  );
  const [footerPhone, setFooterPhone] = useState(() => _ft?.phone ?? "");
  const [footerEmail, setFooterEmail] = useState(() => _ft?.email ?? "");
  const [footerSectionSaved, setFooterSectionSaved] = useState(false);
  const [footerSaving, setFooterSaving] = useState(false);
  const [footerSaveError, setFooterSaveError] = useState<string | null>(null);

  // ── Shared translation-done poller ────────────────────────────────────────
  const startTranslationPoll = (
    endpoint: string,
    setpending: (v: boolean) => void,
    event: string,
  ) => {
    let deadline = 0;
    const attempt = async () => {
      if (!deadline) deadline = Date.now() + 120_000;
      if (Date.now() > deadline) {
        setpending(false);
        return;
      }
      try {
        const r = await fetch(endpoint);
        if (r.ok) {
          const d = (await r.json()) as { _hasTranslations?: boolean };
          if (d._hasTranslations) {
            setpending(false);
            window.dispatchEvent(new Event(event));
            return;
          }
        }
      } catch {
        /* ignore */
      }
      setTimeout(() => void attempt(), 5000);
    };
    setTimeout(() => void attempt(), 5000);
  };

  // ── Color helpers ─────────────────────────────────────────────────────────
  const cloudinaryPublicId = (url: string): string | null => {
    const m = url.match(
      /res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)/,
    );
    if (!m) return null;
    return m[1].replace(/\.[^.]+$/, "");
  };

  const removePartner = (logo: string, index: number) => {
    setPartners((prev) => prev.filter((_, j) => j !== index));
    const publicId = cloudinaryPublicId(logo);
    if (publicId) {
      void fetchWithAuth("/api/admin/cloudinary/delete", {
        method: "DELETE",
        body: JSON.stringify({ publicId }),
      });
    }
  };

  const applyColor = (key: ColorKey, val: string) => {
    document.documentElement.style.setProperty(CSS_VAR_MAP[key], val);
    setColors((prev) => ({ ...prev, [key]: val }));
  };

  const saveColors = () => {
    localStorage.setItem(LS_COLORS, JSON.stringify(colors));
    setColorSaved(true);
    setTimeout(() => setColorSaved(false), 2000);
  };

  const resetColors = () => {
    Object.entries(CSS_VAR_MAP).forEach(([, cssVar]) =>
      document.documentElement.style.removeProperty(cssVar),
    );
    setColors(COLOR_DEFAULTS);
    localStorage.removeItem(LS_COLORS);
  };

  const applyFont = (font: FontOption) => {
    if (font.google) {
      const linkId = `gf-${font.id}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
        document.head.appendChild(link);
      }
    }
    document.documentElement.style.setProperty(
      "--brand-font-family",
      font.family,
    );
    setSelectedFont(font.id);
  };

  const saveFont = () => {
    const font =
      FONT_OPTIONS.find((f) => f.id === selectedFont) ?? FONT_OPTIONS[0];
    localStorage.setItem(
      LS_FONT,
      JSON.stringify({
        id: font.id,
        family: font.family,
        google: font.google,
        letterSpacing,
        lineHeight,
        fontWeight,
      }),
    );
    setFontSaved(true);
    setTimeout(() => setFontSaved(false), 2000);
  };

  const resetFont = () => {
    document.documentElement.style.removeProperty("--brand-font-family");
    document.documentElement.style.removeProperty("--brand-letter-spacing");
    document.documentElement.style.removeProperty("--brand-line-height");
    document.documentElement.style.removeProperty("--brand-font-weight");
    setSelectedFont("helvetica");
    setLetterSpacing("0.02");
    setLineHeight("1.65");
    setFontWeight("400");
    localStorage.removeItem(LS_FONT);
  };

  const applyLetterSpacing = (val: string) => {
    setLetterSpacing(val);
    document.documentElement.style.setProperty(
      "--brand-letter-spacing",
      `${val}em`,
    );
  };

  const applyLineHeight = (val: string) => {
    setLineHeight(val);
    document.documentElement.style.setProperty("--brand-line-height", val);
  };

  const applyFontWeight = (val: string) => {
    setFontWeight(val);
    document.documentElement.style.setProperty("--brand-font-weight", val);
  };

  // ── Hero helpers ──────────────────────────────────────────────────────────
  const buildSource = () => ({
    slogan,
    badge,
    trustLine,
    trustIcon: heroTrustIcon,
    trustBg,
    partnersBg,
    heroImgDesktop,
    heroImgMobile,
    partners,
    stat1Value,
    stat1Label,
    stat2Value,
    stat2Label,
    stat3Value,
    stat3Label,
    stat4Value,
    stat4Label,
  });

  const persist = async (
    source: ReturnType<typeof buildSource>,
    key: SectionKey,
  ) => {
    localStorage.setItem(LS_HERO, JSON.stringify(source));
    document.documentElement.style.setProperty(
      "--brand-trust-bg",
      source.trustBg,
    );
    document.documentElement.style.setProperty(
      "--brand-partner-bg",
      source.partnersBg,
    );
    setSavingKey(key);
    setTranslating(true);
    setTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:hero-updated"));
      if (body.translating) {
        setHeroTranslationPending(true);
        startTranslationPoll(
          "/api/hero-overrides/nl",
          setHeroTranslationPending,
          "tc:hero-updated",
        );
      }
      setSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setTranslating(false);
      setSavingKey(null);
    }
  };

  const saveAll = async () => {
    setSavingAll(true);
    setTranslateError(null);
    try {
      const source = buildSource();
      localStorage.setItem(LS_HERO, JSON.stringify(source));
      document.documentElement.style.setProperty(
        "--brand-trust-bg",
        source.trustBg,
      );
      document.documentElement.style.setProperty(
        "--brand-partner-bg",
        source.partnersBg,
      );
      const res = await fetchWithAuth("/api/admin/customization/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:hero-updated"));
      if (body.translating) {
        setHeroTranslationPending(true);
        startTranslationPoll(
          "/api/hero-overrides/nl",
          setHeroTranslationPending,
          "tc:hero-updated",
        );
      }
      setAllSaved(true);
      setTimeout(() => setAllSaved(false), 2500);
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingAll(false);
    }
  };

  const resetAll = async () => {
    setSlogan("");
    setBadge("");
    setTrustLine("");
    setHeroTrustIcon("");
    setTrustBg(COLOR_DEFAULTS.trustBg);
    document.documentElement.style.setProperty(
      "--brand-trust-bg",
      COLOR_DEFAULTS.trustBg,
    );
    setPartnersBg("#ffffff");
    document.documentElement.style.setProperty("--brand-partner-bg", "#ffffff");
    setHeroImgDesktop("");
    setHeroImgMobile("");
    setPartners(DEFAULT_PARTNERS);
    setStat1Value("");
    setStat1Label("");
    setStat2Value("");
    setStat2Label("");
    setStat3Value("");
    setStat3Label("");
    setStat4Value("");
    setStat4Label("");
    localStorage.removeItem(LS_HERO);
    setHeroTranslationPending(false);
    setSavingAll(true);
    setTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/hero", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:hero-updated"));
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setSavingAll(false);
    }
  };

  // ── Services helpers ──────────────────────────────────────────────────────
  const buildServicesSource = () => ({
    title: svcTitle,
    label: svcLabel,
    ...Object.fromEntries(
      svcCards.flatMap((c, i) => [
        [`item${i}Title`, c.title],
        [`item${i}Desc`, c.desc],
        [`img${i}`, c.img],
      ]),
    ),
  });

  const persistServices = async (
    source: ReturnType<typeof buildServicesSource>,
    key: ServicesSectionKey,
  ) => {
    localStorage.setItem(LS_SERVICES, JSON.stringify(source));
    setSvcSavingKey(key);
    setSvcTranslating(true);
    setSvcTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:services-updated"));
      if (body.translating) {
        setSvcTranslationPending(true);
        startTranslationPoll(
          "/api/services-overrides/nl",
          setSvcTranslationPending,
          "tc:services-updated",
        );
      }
      setSvcSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setSvcSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setSvcTranslateError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSvcTranslating(false);
      setSvcSavingKey(null);
    }
  };

  const saveAllServices = async () => {
    setSvcSavingAll(true);
    setSvcTranslateError(null);
    try {
      const source = buildServicesSource();
      localStorage.setItem(LS_SERVICES, JSON.stringify(source));
      const res = await fetchWithAuth("/api/admin/customization/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:services-updated"));
      if (body.translating) {
        setSvcTranslationPending(true);
        startTranslationPoll(
          "/api/services-overrides/nl",
          setSvcTranslationPending,
          "tc:services-updated",
        );
      }
      setSvcAllSaved(true);
      setTimeout(() => setSvcAllSaved(false), 2500);
    } catch (err) {
      setSvcTranslateError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSvcSavingAll(false);
    }
  };

  const resetAllServices = async () => {
    setSvcTitle("");
    setSvcLabel("");
    setSvcCards(DEFAULT_SVC_CARDS);
    localStorage.removeItem(LS_SERVICES);
    setSvcTranslationPending(false);
    setSvcSavingAll(true);
    setSvcTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/services", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:services-updated"));
    } catch (err) {
      setSvcTranslateError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setSvcSavingAll(false);
    }
  };

  // ── About helpers ─────────────────────────────────────────────────────────
  const buildAboutSource = () => ({
    label: aboutLabel,
    title: aboutTitle,
    description: aboutDesc,
    description2: aboutDesc2,
    valuesTitle: aboutValuesTitle,
    value0: aboutValues[0],
    value1: aboutValues[1],
    value2: aboutValues[2],
    value3: aboutValues[3],
    driversPlaced: aboutDriversPlaced,
    yearsActive: aboutYearsActive,
    location: aboutLocation,
    yearsActiveNum: aboutYearsActiveNum,
    driversIcon: aboutDriversIcon,
    locationIcon: aboutLocationIcon,
    imgLeft: aboutImgLeft,
    imgTopRight: aboutImgTopRight,
    imgBottomRight: aboutImgBottomRight,
  });

  const persistAbout = async (
    source: ReturnType<typeof buildAboutSource>,
    key: AboutSectionKey,
  ) => {
    localStorage.setItem(LS_ABOUT, JSON.stringify(source));
    setAboutSavingKey(key);
    setAboutTranslating(true);
    setAboutTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:about-updated"));
      if (body.translating) {
        setAboutTranslationPending(true);
        startTranslationPoll(
          "/api/about-overrides/nl",
          setAboutTranslationPending,
          "tc:about-updated",
        );
      }
      setAboutSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setAboutSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setAboutTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setAboutTranslating(false);
      setAboutSavingKey(null);
    }
  };

  const saveAllAbout = async () => {
    setAboutSavingAll(true);
    setAboutTranslateError(null);
    try {
      const source = buildAboutSource();
      localStorage.setItem(LS_ABOUT, JSON.stringify(source));
      const res = await fetchWithAuth("/api/admin/customization/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:about-updated"));
      if (body.translating) {
        setAboutTranslationPending(true);
        startTranslationPoll(
          "/api/about-overrides/nl",
          setAboutTranslationPending,
          "tc:about-updated",
        );
      }
      setAboutAllSaved(true);
      setTimeout(() => setAboutAllSaved(false), 2500);
    } catch (err) {
      setAboutTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setAboutSavingAll(false);
    }
  };

  const resetAllAbout = async () => {
    setAboutLabel("");
    setAboutTitle("");
    setAboutDesc("");
    setAboutDesc2("");
    setAboutValuesTitle("");
    setAboutValues(["", "", "", ""]);
    setAboutDriversPlaced("");
    setAboutYearsActive("");
    setAboutLocation("");
    setAboutYearsActiveNum("");
    setAboutDriversIcon("");
    setAboutLocationIcon("");
    setAboutImgLeft("");
    setAboutImgTopRight("");
    setAboutImgBottomRight("");
    localStorage.removeItem(LS_ABOUT);
    setAboutTranslationPending(false);
    setAboutSavingAll(true);
    setAboutTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/about", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:about-updated"));
    } catch (err) {
      setAboutTranslateError(
        err instanceof Error ? err.message : "Reset failed",
      );
    } finally {
      setAboutSavingAll(false);
    }
  };

  // ── Housing helpers ───────────────────────────────────────────────────────
  const buildHousingSource = () => ({
    label: housingLabel,
    title: housingTitle,
    description: housingDesc,
    perk0: housingPerks[0],
    perk1: housingPerks[1],
    perk2: housingPerks[2],
    perk3: housingPerks[3],
    cta: housingCta,
    perk0Icon: housingPerkIcons[0],
    perk1Icon: housingPerkIcons[1],
    perk2Icon: housingPerkIcons[2],
    perk3Icon: housingPerkIcons[3],
    img1: housingImg1,
    img2: housingImg2,
    bg: housingBg,
  });

  const persistHousing = async (
    source: ReturnType<typeof buildHousingSource>,
    key: HousingSectionKey,
  ) => {
    localStorage.setItem(LS_HOUSING, JSON.stringify(source));
    setHousingSavingKey(key);
    setHousingTranslating(true);
    setHousingTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/housing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:housing-updated"));
      if (body.translating) {
        setHousingTranslationPending(true);
        startTranslationPoll(
          "/api/housing-overrides/nl",
          setHousingTranslationPending,
          "tc:housing-updated",
        );
      }
      setHousingSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setHousingSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setHousingTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setHousingTranslating(false);
      setHousingSavingKey(null);
    }
  };

  const saveAllHousing = async () => {
    setHousingSavingAll(true);
    setHousingTranslateError(null);
    try {
      const source = buildHousingSource();
      localStorage.setItem(LS_HOUSING, JSON.stringify(source));
      const res = await fetchWithAuth("/api/admin/customization/housing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:housing-updated"));
      if (body.translating) {
        setHousingTranslationPending(true);
        startTranslationPoll(
          "/api/housing-overrides/nl",
          setHousingTranslationPending,
          "tc:housing-updated",
        );
      }
      setHousingAllSaved(true);
      setTimeout(() => setHousingAllSaved(false), 2500);
    } catch (err) {
      setHousingTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setHousingSavingAll(false);
    }
  };

  const resetAllHousing = async () => {
    setHousingLabel("");
    setHousingTitle("");
    setHousingDesc("");
    setHousingPerks(["", "", "", ""]);
    setHousingCta("");
    setHousingPerkIcons(["", "", "", ""]);
    setHousingImg1("");
    setHousingImg2("");
    setHousingBg("");
    localStorage.removeItem(LS_HOUSING);
    setHousingTranslationPending(false);
    setHousingSavingAll(true);
    setHousingTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/housing", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:housing-updated"));
    } catch (err) {
      setHousingTranslateError(
        err instanceof Error ? err.message : "Reset failed",
      );
    } finally {
      setHousingSavingAll(false);
    }
  };

  // ── Contact helpers ───────────────────────────────────────────────────────
  const buildContactSource = () => ({
    title: contactTitle,
    subtitle: contactSubtitle,
    phone: contactPhoneLabel,
    email: contactEmailLabel,
    address: contactAddressLabel,
    map_pin: contactMapPin,
    whatsapp_number: contactWhatsapp,
    email_address: contactEmailAddress,
    map_address: contactMapAddress,
    img: contactImg,
    phoneIcon: contactRowIcons[0],
    emailIcon: contactRowIcons[1],
    addressIcon: contactRowIcons[2],
  });

  const persistContact = async (
    source: ReturnType<typeof buildContactSource>,
    key: ContactSectionKey,
  ) => {
    localStorage.setItem(LS_CONTACT, JSON.stringify(source));
    setContactSavingKey(key);
    setContactTranslating(true);
    setContactTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:contact-updated"));
      if (body.translating) {
        setContactTranslationPending(true);
        startTranslationPoll(
          "/api/contact-overrides/nl",
          setContactTranslationPending,
          "tc:contact-updated",
        );
      }
      setContactSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setContactSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setContactTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setContactTranslating(false);
      setContactSavingKey(null);
    }
  };

  const saveAllContact = async () => {
    setContactSavingAll(true);
    setContactTranslateError(null);
    try {
      const source = buildContactSource();
      localStorage.setItem(LS_CONTACT, JSON.stringify(source));
      const res = await fetchWithAuth("/api/admin/customization/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:contact-updated"));
      if (body.translating) {
        setContactTranslationPending(true);
        startTranslationPoll(
          "/api/contact-overrides/nl",
          setContactTranslationPending,
          "tc:contact-updated",
        );
      }
      setContactAllSaved(true);
      setTimeout(() => setContactAllSaved(false), 2500);
    } catch (err) {
      setContactTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setContactSavingAll(false);
    }
  };

  const resetAllContact = async () => {
    setContactTitle("");
    setContactSubtitle("");
    setContactPhoneLabel("");
    setContactEmailLabel("");
    setContactAddressLabel("");
    setContactMapPin("");
    setContactWhatsapp("");
    setContactEmailAddress("");
    setContactMapAddress("");
    setContactImg("");
    setContactRowIcons(["", "", ""]);
    localStorage.removeItem(LS_CONTACT);
    setContactTranslationPending(false);
    setContactSavingAll(true);
    setContactTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/contact", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:contact-updated"));
    } catch (err) {
      setContactTranslateError(
        err instanceof Error ? err.message : "Reset failed",
      );
    } finally {
      setContactSavingAll(false);
    }
  };

  // ── Color fields config (depends on dict) ─────────────────────────────────
  const colorFields: { key: ColorKey; label: string; default: string }[] = [
    {
      key: "brandDark",
      label: dict.admin.custom_color_primary,
      default: COLOR_DEFAULTS.brandDark,
    },
    {
      key: "brandMid",
      label: dict.admin.custom_color_mid,
      default: COLOR_DEFAULTS.brandMid,
    },
    {
      key: "brandGreen",
      label: dict.admin.custom_color_dark,
      default: COLOR_DEFAULTS.brandGreen,
    },
    {
      key: "brandBtnText",
      label: "Button Text",
      default: COLOR_DEFAULTS.brandBtnText,
    },
    {
      key: "trustBg",
      label: dict.admin.custom_hero_trust_bg,
      default: COLOR_DEFAULTS.trustBg,
    },
  ];

  return {
    // shared
    win98,
    dict,
    subTab,
    setSubTab,
    startTranslationPoll,
    // header
    headerTransparent,
    setHeaderTransparent,
    headerSaved,
    setHeaderSaved,
    // colors
    colors,
    setColors,
    colorSaved,
    setColorSaved,
    colorFields,
    applyColor,
    saveColors,
    resetColors,
    // fonts
    selectedFont,
    setSelectedFont,
    letterSpacing,
    lineHeight,
    fontWeight,
    fontSaved,
    applyFont,
    saveFont,
    resetFont,
    applyLetterSpacing,
    applyLineHeight,
    applyFontWeight,
    // hero
    slogan,
    setSlogan,
    badge,
    setBadge,
    trustLine,
    setTrustLine,
    heroTrustIcon,
    setHeroTrustIcon,
    heroTrustIconPicker,
    setHeroTrustIconPicker,
    heroTrustIconPage,
    setHeroTrustIconPage,
    sectionSaved,
    setSectionSaved,
    savingKey,
    setSavingKey,
    savingAll,
    setSavingAll,
    allSaved,
    setAllSaved,
    translating,
    setTranslating,
    translateError,
    setTranslateError,
    stat1Value,
    setStat1Value,
    stat1Label,
    setStat1Label,
    stat2Value,
    setStat2Value,
    stat2Label,
    setStat2Label,
    stat3Value,
    setStat3Value,
    stat3Label,
    setStat3Label,
    stat4Value,
    setStat4Value,
    stat4Label,
    setStat4Label,
    trustBg,
    setTrustBg,
    partnersBg,
    setPartnersBg,
    heroImgDesktop,
    setHeroImgDesktop,
    heroImgMobile,
    setHeroImgMobile,
    partners,
    setPartners,
    heroTranslationPending,
    setHeroTranslationPending,
    buildSource,
    persist,
    saveAll,
    resetAll,
    removePartner,
    cloudinaryPublicId,
    // services
    svcTitle,
    setSvcTitle,
    svcLabel,
    setSvcLabel,
    svcCards,
    setSvcCards,
    svcSectionSaved,
    setSvcSectionSaved,
    svcTranslating,
    setSvcTranslating,
    svcTranslateError,
    setSvcTranslateError,
    svcSavingAll,
    setSvcSavingAll,
    svcAllSaved,
    setSvcAllSaved,
    svcTranslationPending,
    setSvcTranslationPending,
    buildServicesSource,
    persistServices,
    saveAllServices,
    resetAllServices,
    // about
    aboutLabel,
    setAboutLabel,
    aboutTitle,
    setAboutTitle,
    aboutDesc,
    setAboutDesc,
    aboutDesc2,
    setAboutDesc2,
    aboutValuesTitle,
    setAboutValuesTitle,
    aboutValues,
    setAboutValues,
    aboutDriversPlaced,
    setAboutDriversPlaced,
    aboutYearsActive,
    setAboutYearsActive,
    aboutLocation,
    setAboutLocation,
    aboutYearsActiveNum,
    setAboutYearsActiveNum,
    aboutDriversIcon,
    setAboutDriversIcon,
    aboutLocationIcon,
    setAboutLocationIcon,
    aboutIconPicker,
    setAboutIconPicker,
    aboutDriversIconPage,
    setAboutDriversIconPage,
    aboutLocationIconPage,
    setAboutLocationIconPage,
    aboutImgLeft,
    setAboutImgLeft,
    aboutImgTopRight,
    setAboutImgTopRight,
    aboutImgBottomRight,
    setAboutImgBottomRight,
    aboutSectionSaved,
    setAboutSectionSaved,
    aboutTranslating,
    setAboutTranslating,
    aboutTranslateError,
    setAboutTranslateError,
    aboutSavingAll,
    setAboutSavingAll,
    aboutAllSaved,
    setAboutAllSaved,
    aboutTranslationPending,
    setAboutTranslationPending,
    buildAboutSource,
    persistAbout,
    saveAllAbout,
    resetAllAbout,
    // housing
    housingLabel,
    setHousingLabel,
    housingTitle,
    setHousingTitle,
    housingDesc,
    setHousingDesc,
    housingPerks,
    setHousingPerks,
    housingCta,
    setHousingCta,
    housingPerkIcons,
    setHousingPerkIcons,
    housingImg1,
    setHousingImg1,
    housingImg2,
    setHousingImg2,
    housingBg,
    setHousingBg,
    housingIconPicker,
    setHousingIconPicker,
    housingIconPages,
    setHousingIconPages,
    housingTranslating,
    setHousingTranslating,
    housingTranslateError,
    setHousingTranslateError,
    housingSavingAll,
    setHousingSavingAll,
    housingAllSaved,
    setHousingAllSaved,
    housingTranslationPending,
    setHousingTranslationPending,
    buildHousingSource,
    persistHousing,
    saveAllHousing,
    resetAllHousing,
    // contact
    contactTitle,
    setContactTitle,
    contactSubtitle,
    setContactSubtitle,
    contactPhoneLabel,
    setContactPhoneLabel,
    contactEmailLabel,
    setContactEmailLabel,
    contactAddressLabel,
    setContactAddressLabel,
    contactMapPin,
    setContactMapPin,
    contactWhatsapp,
    setContactWhatsapp,
    contactEmailAddress,
    setContactEmailAddress,
    contactMapAddress,
    setContactMapAddress,
    contactImg,
    setContactImg,
    contactSectionSaved,
    setContactSectionSaved,
    contactTranslating,
    setContactTranslating,
    contactTranslateError,
    setContactTranslateError,
    contactSavingAll,
    setContactSavingAll,
    contactAllSaved,
    setContactAllSaved,
    contactTranslationPending,
    setContactTranslationPending,
    contactRowIcons,
    setContactRowIcons,
    contactIconPicker,
    setContactIconPicker,
    contactIconPages,
    setContactIconPages,
    buildContactSource,
    persistContact,
    saveAllContact,
    resetAllContact,
    // footer
    footerTaglineSub,
    setFooterTaglineSub,
    footerAddressLine1,
    setFooterAddressLine1,
    footerAddressLine2,
    setFooterAddressLine2,
    footerPhone,
    setFooterPhone,
    footerEmail,
    setFooterEmail,
    footerSectionSaved,
    setFooterSectionSaved,
    footerSaving,
    setFooterSaving,
    footerSaveError,
    setFooterSaveError,
  };
}
