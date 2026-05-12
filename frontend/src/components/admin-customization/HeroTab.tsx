"use client";

import React from "react";
import { Loader2, Check, Save, RotateCcw, Shield } from "lucide-react";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { DEFAULT_PARTNERS, TRUST_ICON_OPTS, COLOR_DEFAULTS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";

export default function HeroTab() {
  const {
    win98,
    dict,
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
    savingKey,
    savingAll,
    allSaved,
    translating,
    translateError,
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
    buildSource,
    persist,
    saveAll,
    resetAll,
    removePartner,
  } = useAdminCustomization();

  return (
    <>
      {!win98 && (
        <div className="space-y-4">
          {translateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {translateError}
            </p>
          )}

          {heroTranslationPending && (
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-3 text-xs text-amber-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              Translating to all 18 languages in the background… This tab will
              auto-refresh when done.
            </div>
          )}

          {/* 1 ── Slogan */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_slogan}
            </p>
            <textarea
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              rows={3}
              placeholder="Start Your Driving Job in the Netherlands — We Handle the Rest."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "slogan")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "slogan" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.slogan ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.slogan ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setSlogan("");
                  void persist({ ...buildSource(), slogan: "" }, "slogan");
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 2 ── Badge Text */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_badge}
            </p>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Driver Recruitment · Amsterdam, NL"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "badge")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "badge" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.badge ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.badge ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setBadge("");
                  void persist({ ...buildSource(), badge: "" }, "badge");
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 3 ── Trust Line */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_trust}
            </p>
            <div className="flex items-center gap-2">
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setHeroTrustIconPicker((v) => !v);
                    setHeroTrustIconPage(0);
                  }}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-700 border border-slate-600 hover:border-amber-400 transition-colors"
                  title="Pick icon"
                >
                  {(() => {
                    const opt = TRUST_ICON_OPTS.flat().find(
                      (o) => o.id === heroTrustIcon,
                    );
                    const Ic = opt?.Icon ?? Shield;
                    return <Ic className="w-4 h-4 text-amber-400" />;
                  })()}
                </button>
                {heroTrustIconPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-50 w-56 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">
                        Choose icon
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={heroTrustIconPage === 0}
                          onClick={() => setHeroTrustIconPage((p) => p - 1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                        >
                          ‹
                        </button>
                        <span className="text-[9px] text-slate-500 w-8 text-center">
                          {heroTrustIconPage + 1} / {TRUST_ICON_OPTS.length}
                        </span>
                        <button
                          type="button"
                          disabled={
                            heroTrustIconPage === TRUST_ICON_OPTS.length - 1
                          }
                          onClick={() => setHeroTrustIconPage((p) => p + 1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {TRUST_ICON_OPTS[heroTrustIconPage].map(
                        ({ id, Icon: Ic, label }) => (
                          <button
                            key={id}
                            type="button"
                            title={label}
                            onClick={() => {
                              setHeroTrustIcon(id);
                              setHeroTrustIconPicker(false);
                            }}
                            className={
                              "w-9 h-9 flex items-center justify-center rounded-lg transition-colors " +
                              (heroTrustIcon === id
                                ? "bg-amber-400/20 border border-amber-400/50 text-amber-300"
                                : "text-slate-400 hover:bg-slate-700 hover:text-white")
                            }
                          >
                            <Ic className="w-4 h-4" />
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      type="button"
                      title="Reset to default"
                      onClick={() => {
                        setHeroTrustIcon("");
                        setHeroTrustIconPicker(false);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg py-1 text-[10px] text-slate-500 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset to default
                    </button>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={trustLine}
                onChange={(e) => setTrustLine(e.target.value)}
                placeholder="No experience with Dutch paperwork? No problem — we guide you step by step."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "trustLine")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "trustLine" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.trustLine ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.trustLine ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setTrustLine("");
                  setHeroTrustIcon("");
                  void persist(
                    { ...buildSource(), trustLine: "", trustIcon: "" },
                    "trustLine",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 4 ── Trust Bar Background */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_trust_bg}
            </p>
            <div className="flex items-center gap-3">
              <div
                className="relative w-10 h-10 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
                style={{ backgroundColor: trustBg }}
              >
                <input
                  type="color"
                  value={trustBg}
                  onChange={(e) => {
                    setTrustBg(e.target.value);
                    document.documentElement.style.setProperty(
                      "--brand-trust-bg",
                      e.target.value,
                    );
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={trustBg}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                    setTrustBg(v);
                    if (v.length === 7)
                      document.documentElement.style.setProperty(
                        "--brand-trust-bg",
                        v,
                      );
                  }
                }}
                maxLength={7}
                className="max-w-35 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
              <div
                className="flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-xs font-medium"
                style={{ backgroundColor: trustBg, color: "#ffffff" }}
              >
                <span>&#128737;</span>
                <span className="truncate opacity-80">Trust bar preview</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "trustBg")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "trustBg" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.trustBg ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.trustBg ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setTrustBg(COLOR_DEFAULTS.trustBg);
                  document.documentElement.style.setProperty(
                    "--brand-trust-bg",
                    COLOR_DEFAULTS.trustBg,
                  );
                  void persist(
                    { ...buildSource(), trustBg: COLOR_DEFAULTS.trustBg },
                    "trustBg",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 5 ── Partners Strip Background */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Partners Strip Background
            </p>
            <div className="flex items-center gap-3">
              <div
                className="relative w-10 h-10 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
                style={{ backgroundColor: partnersBg }}
              >
                <input
                  type="color"
                  value={partnersBg}
                  onChange={(e) => {
                    setPartnersBg(e.target.value);
                    document.documentElement.style.setProperty(
                      "--brand-partner-bg",
                      e.target.value,
                    );
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={partnersBg}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                    setPartnersBg(v);
                    if (v.length === 7)
                      document.documentElement.style.setProperty(
                        "--brand-partner-bg",
                        v,
                      );
                  }
                }}
                maxLength={7}
                className="max-w-35 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
              <div
                className="flex-1 h-10 rounded-lg flex items-center justify-center border border-slate-700 text-xs font-medium"
                style={{ backgroundColor: partnersBg, color: "#6b7280" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Our Partners
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "partnersBg")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "partnersBg" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.partnersBg ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.partnersBg ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setPartnersBg("#ffffff");
                  document.documentElement.style.setProperty(
                    "--brand-partner-bg",
                    "#ffffff",
                  );
                  void persist(
                    { ...buildSource(), partnersBg: "#ffffff" },
                    "partnersBg",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 6 ── Hero Stats */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_stats}
            </p>
            <div className="grid grid-cols-[1fr_120px_1fr] gap-3 items-center">
              <span />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide text-center">
                {dict.admin.custom_hero_stat_value}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {dict.admin.custom_hero_stat_label_text}
              </span>
            </div>
            {(
              [
                {
                  id: "1",
                  defaultVal: "500+",
                  defaultLabel: "Happy clients",
                  val: stat1Value,
                  label: stat1Label,
                  setVal: setStat1Value,
                  setLabel: setStat1Label,
                },
                {
                  id: "2",
                  defaultVal: "7+",
                  defaultLabel: "Years experience",
                  val: stat2Value,
                  label: stat2Label,
                  setVal: setStat2Value,
                  setLabel: setStat2Label,
                },
                {
                  id: "3",
                  defaultVal: "24/7",
                  defaultLabel: "Available",
                  val: stat3Value,
                  label: stat3Label,
                  setVal: setStat3Value,
                  setLabel: setStat3Label,
                },
                {
                  id: "4",
                  defaultVal: "5",
                  defaultLabel: "Top partners",
                  val: stat4Value,
                  label: stat4Label,
                  setVal: setStat4Value,
                  setLabel: setStat4Label,
                },
              ] as const
            ).map(
              ({
                id,
                defaultVal,
                defaultLabel,
                val,
                label,
                setVal,
                setLabel,
              }) => (
                <div
                  key={id}
                  className="grid grid-cols-[1fr_120px_1fr] gap-3 items-center"
                >
                  <span className="text-xs text-slate-500 font-medium">
                    {defaultLabel}
                  </span>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder={defaultVal}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder={defaultLabel}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                </div>
              ),
            )}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => void persist(buildSource(), "stats")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "stats" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.stats ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.stats ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setStat1Value("");
                  setStat1Label("");
                  setStat2Value("");
                  setStat2Label("");
                  setStat3Value("");
                  setStat3Label("");
                  setStat4Value("");
                  setStat4Label("");
                  void persist(
                    {
                      ...buildSource(),
                      stat1Value: "",
                      stat1Label: "",
                      stat2Value: "",
                      stat2Label: "",
                      stat3Value: "",
                      stat3Label: "",
                      stat4Value: "",
                      stat4Label: "",
                    },
                    "stats",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 7 ── Partner Logos */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Partner Logos
              </p>
              <button
                type="button"
                onClick={() =>
                  setPartners((p) => [...p, { name: "", logo: "" }])
                }
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                + Add partner
              </button>
            </div>
            <div className="space-y-2">
              {partners.map((p, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) =>
                      setPartners((prev) =>
                        prev.map((x, j) =>
                          j === i ? { ...x, name: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Name (e.g. FedEx)"
                    className="w-28 shrink-0 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CloudinaryLogoUpload
                      value={p.logo}
                      onChange={(url) =>
                        setPartners((prev) =>
                          prev.map((x, j) => (j === i ? { ...x, logo: url } : x)),
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removePartner(p.logo, i)}
                      className="text-slate-500 hover:text-red-400 transition-colors shrink-0 text-lg leading-none"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => void persist(buildSource(), "partners")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "partners" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.partners ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.partners ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setPartners(DEFAULT_PARTNERS);
                  void persist(
                    { ...buildSource(), partners: DEFAULT_PARTNERS },
                    "partners",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 8 ── Desktop Hero Image */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Desktop Hero Image
            </p>
            <p className="text-xs text-slate-500">
              Shown on screens ≥ 768 px. Use a wide landscape photo for best
              results.
            </p>
            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  heroImgDesktop ||
                  "/teamCargo-trans-webP/cargo-trans-horizontal-3.webp"
                }
                alt="Desktop hero preview"
                className="w-full h-full object-cover object-center"
              />
              {heroImgDesktop && (
                <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                  Custom
                </span>
              )}
            </div>
            <CloudinaryLogoUpload
              value={heroImgDesktop}
              onChange={setHeroImgDesktop}
              folder="tc-hero"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => void persist(buildSource(), "heroImgDesktop")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "heroImgDesktop" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.heroImgDesktop ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.heroImgDesktop ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setHeroImgDesktop("");
                  void persist(
                    { ...buildSource(), heroImgDesktop: "" },
                    "heroImgDesktop",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 9 ── Mobile Hero Image */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Mobile Hero Image
            </p>
            <p className="text-xs text-slate-500">
              Shown on screens &lt; 768 px. Use a tall portrait photo for best
              results.
            </p>
            <div className="relative w-40 h-56 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  heroImgMobile ||
                  "/teamCargo-trans-webP/cargo-trans-vertical-3.webp"
                }
                alt="Mobile hero preview"
                className="w-full h-full object-cover object-center"
              />
              {heroImgMobile && (
                <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                  Custom
                </span>
              )}
            </div>
            <CloudinaryLogoUpload
              value={heroImgMobile}
              onChange={setHeroImgMobile}
              folder="tc-hero"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => void persist(buildSource(), "heroImgMobile")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "heroImgMobile" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.heroImgMobile ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.heroImgMobile ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setHeroImgMobile("");
                  void persist(
                    { ...buildSource(), heroImgMobile: "" },
                    "heroImgMobile",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* ── Global action bar */}
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-amber-300">
                Save all changes
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Applies every section above at once &amp; translates to all 18
                languages
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => void saveAll()}
                disabled={savingAll || translating}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : allSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {allSaved ? "All saved!" : "Save all"}
              </button>
              <button
                onClick={() => void resetAll()}
                disabled={savingAll || translating}
                className="inline-flex items-center gap-2 rounded-lg border border-red-700/60 px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:border-red-500 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore all defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const INPUT: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "2px 4px",
          };
          const TEXTAREA: React.CSSProperties = {
            ...INPUT,
            resize: "vertical" as const,
            width: "100%",
            display: "block",
          };
          const HEX: React.CSSProperties = {
            width: 80,
            fontFamily: '"Courier New", monospace',
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "1px 4px",
          };
          const SWATCH: React.CSSProperties = {
            width: 20,
            height: 20,
            flexShrink: 0,
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "pointer",
            minWidth: 68,
          };
          const BTN_RED: React.CSSProperties = { ...BTN, color: "#cc0000" };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          const ROW: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: 6,
          };

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
              }}
            >
              <style>{`
                @media (max-width: 600px) {
                  .w98h-grid-a, .w98h-grid-b, .w98h-grid-c {
                    grid-template-columns: 1fr !important;
                  }
                  .w98h-colors {
                    flex-direction: column !important;
                    gap: 10px !important;
                  }
                  .w98h-vdivider { display: none !important; }
                  .w98h-color-row { flex-wrap: wrap !important; }
                }
              `}</style>
              {translateError && (
                <div
                  style={{
                    background: "#fff0f0",
                    border: "2px solid #cc0000",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#cc0000",
                  }}
                >
                  {translateError}
                </div>
              )}
              {heroTranslationPending && (
                <div
                  style={{
                    background: "#ffffd0",
                    border: "1px solid #808080",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#555",
                  }}
                >
                  Translating to all 18 languages… please wait.
                </div>
              )}

              {/* ══ Section A — Content ══ */}
              <div
                className="w98h-grid-a"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 10,
                  marginTop: 8,
                }}
              >
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Slogan</span>
                  <textarea
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    rows={2}
                    placeholder="Start Your Driving Job in the Netherlands — We Handle the Rest."
                    style={{ ...TEXTAREA }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button
                      onClick={() => void persist(buildSource(), "slogan")}
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.slogan ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setSlogan("");
                        void persist(
                          { ...buildSource(), slogan: "" },
                          "slogan",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Badge Text</span>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Driver Recruitment · Amsterdam, NL"
                    style={{ ...INPUT, width: "100%", marginBottom: 6 }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <button
                      onClick={() => void persist(buildSource(), "badge")}
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.badge ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setBadge("");
                        void persist({ ...buildSource(), badge: "" }, "badge");
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Trust Line — full width */}
                <div style={{ ...GRP, gridColumn: "1 / -1" }}>
                  <span style={GRP_LBL}>Trust Line</span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroTrustIconPicker((v) => !v);
                          setHeroTrustIconPage(0);
                        }}
                        style={{ ...BTN, minWidth: 0, padding: "2px 8px" }}
                        title="Pick icon"
                      >
                        {(() => {
                          const opt = TRUST_ICON_OPTS.flat().find(
                            (o) => o.id === heroTrustIcon,
                          );
                          return (
                            <span style={{ fontSize: 10 }}>
                              {opt ? opt.label.slice(0, 3) : "Ico"}
                            </span>
                          );
                        })()}
                      </button>
                      {heroTrustIconPicker && (
                        <div
                          data-iconpicker
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            marginTop: 2,
                            zIndex: 50,
                            width: 176,
                            background: "#c0c0c0",
                            border: "2px solid",
                            borderColor: "#fff #808080 #808080 #fff",
                            padding: 6,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 4,
                            }}
                          >
                            <span style={{ fontSize: 10, color: "#555" }}>
                              Choose icon
                            </span>
                            <div
                              style={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                              }}
                            >
                              <button
                                type="button"
                                disabled={heroTrustIconPage === 0}
                                onClick={() =>
                                  setHeroTrustIconPage((p) => p - 1)
                                }
                                style={{
                                  ...BTN,
                                  minWidth: 0,
                                  padding: "0 5px",
                                }}
                              >
                                ‹
                              </button>
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "#555",
                                  width: 30,
                                  textAlign: "center" as const,
                                }}
                              >
                                {heroTrustIconPage + 1}/{TRUST_ICON_OPTS.length}
                              </span>
                              <button
                                type="button"
                                disabled={
                                  heroTrustIconPage ===
                                  TRUST_ICON_OPTS.length - 1
                                }
                                onClick={() =>
                                  setHeroTrustIconPage((p) => p + 1)
                                }
                                style={{
                                  ...BTN,
                                  minWidth: 0,
                                  padding: "0 5px",
                                }}
                              >
                                ›
                              </button>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(5, 1fr)",
                              gap: 2,
                            }}
                          >
                            {TRUST_ICON_OPTS[heroTrustIconPage].map(
                              ({ id, Icon: Ic, label }) => (
                                <button
                                  key={id}
                                  type="button"
                                  title={label}
                                  onClick={() => {
                                    setHeroTrustIcon(id);
                                    setHeroTrustIconPicker(false);
                                  }}
                                  style={{
                                    ...BTN,
                                    minWidth: 0,
                                    padding: "3px",
                                    background:
                                      heroTrustIcon === id
                                        ? "#d0d0d0"
                                        : "#c0c0c0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Ic
                                    style={{
                                      width: 12,
                                      height: 12,
                                      display: "block",
                                    }}
                                  />
                                </button>
                              ),
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setHeroTrustIcon("");
                              setHeroTrustIconPicker(false);
                            }}
                            style={{
                              ...BTN,
                              width: "100%",
                              marginTop: 4,
                              fontSize: 10,
                            }}
                          >
                            Reset icon
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={trustLine}
                      onChange={(e) => setTrustLine(e.target.value)}
                      placeholder="No experience with Dutch paperwork? No problem…"
                      style={{ ...INPUT, flex: 1 }}
                    />
                    <button
                      onClick={() => void persist(buildSource(), "trustLine")}
                      disabled={translating}
                      style={{ ...BTN, flexShrink: 0 }}
                    >
                      {sectionSaved.trustLine ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setTrustLine("");
                        setHeroTrustIcon("");
                        void persist(
                          { ...buildSource(), trustLine: "", trustIcon: "" },
                          "trustLine",
                        );
                      }}
                      disabled={translating}
                      style={{ ...BTN_RED, flexShrink: 0 }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Strip Colors — full-width row ══ */}
              <div style={{ ...GRP, marginTop: 10 }}>
                <span style={GRP_LBL}>Strip Colors</span>
                <div
                  className="w98h-colors"
                  style={{ display: "flex", gap: 24, alignItems: "flex-start" }}
                >
                  {/* Trust Bar */}
                  <div className="w98h-color-row" style={{ ...ROW, flex: 1 }}>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#555",
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      Trust Bar
                    </span>
                    <div style={{ ...SWATCH, backgroundColor: trustBg }}>
                      <input
                        type="color"
                        value={trustBg}
                        onChange={(e) => {
                          setTrustBg(e.target.value);
                          document.documentElement.style.setProperty(
                            "--brand-trust-bg",
                            e.target.value,
                          );
                        }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={trustBg}
                      maxLength={7}
                      style={{ ...HEX, width: 72 }}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                          setTrustBg(v);
                          if (v.length === 7)
                            document.documentElement.style.setProperty(
                              "--brand-trust-bg",
                              v,
                            );
                        }
                      }}
                    />
                    <button
                      onClick={() => void persist(buildSource(), "trustBg")}
                      disabled={translating}
                      style={{ ...BTN, minWidth: 0, padding: "3px 8px" }}
                    >
                      {sectionSaved.trustBg ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setTrustBg(COLOR_DEFAULTS.trustBg);
                        document.documentElement.style.setProperty(
                          "--brand-trust-bg",
                          COLOR_DEFAULTS.trustBg,
                        );
                        void persist(
                          {
                            ...buildSource(),
                            trustBg: COLOR_DEFAULTS.trustBg,
                          },
                          "trustBg",
                        );
                      }}
                      disabled={translating}
                      style={{ ...BTN_RED, minWidth: 0, padding: "3px 8px" }}
                    >
                      Reset
                    </button>
                    <div
                      style={{
                        flex: 1,
                        height: 20,
                        background: trustBg,
                        border: "1px solid #808080",
                      }}
                    />
                  </div>

                  <div
                    className="w98h-vdivider"
                    style={{
                      borderLeft: "1px solid #808080",
                      alignSelf: "stretch",
                    }}
                  />

                  {/* Partners Strip */}
                  <div className="w98h-color-row" style={{ ...ROW, flex: 1 }}>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#555",
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      Partners Strip
                    </span>
                    <div style={{ ...SWATCH, backgroundColor: partnersBg }}>
                      <input
                        type="color"
                        value={partnersBg}
                        onChange={(e) => {
                          setPartnersBg(e.target.value);
                          document.documentElement.style.setProperty(
                            "--brand-partner-bg",
                            e.target.value,
                          );
                        }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={partnersBg}
                      maxLength={7}
                      style={{ ...HEX, width: 72 }}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                          setPartnersBg(v);
                          if (v.length === 7)
                            document.documentElement.style.setProperty(
                              "--brand-partner-bg",
                              v,
                            );
                        }
                      }}
                    />
                    <button
                      onClick={() => void persist(buildSource(), "partnersBg")}
                      disabled={translating}
                      style={{ ...BTN, minWidth: 0, padding: "3px 8px" }}
                    >
                      {sectionSaved.partnersBg ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setPartnersBg("#ffffff");
                        document.documentElement.style.setProperty(
                          "--brand-partner-bg",
                          "#ffffff",
                        );
                        void persist(
                          { ...buildSource(), partnersBg: "#ffffff" },
                          "partnersBg",
                        );
                      }}
                      disabled={translating}
                      style={{ ...BTN_RED, minWidth: 0, padding: "3px 8px" }}
                    >
                      Reset
                    </button>
                    <div
                      style={{
                        flex: 1,
                        height: 20,
                        background: partnersBg,
                        border: "1px solid #808080",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ══ Section B — Stats + Logos ══ */}
              <div
                className="w98h-grid-b"
                style={{
                  display: "grid",
                  gridTemplateColumns: "30fr 70fr",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Hero Stats</span>
                  {(
                    [
                      {
                        id: "1",
                        dv: "500+",
                        dl: "Happy clients",
                        val: stat1Value,
                        lbl: stat1Label,
                        sv: setStat1Value,
                        sl: setStat1Label,
                      },
                      {
                        id: "2",
                        dv: "7+",
                        dl: "Years exp.",
                        val: stat2Value,
                        lbl: stat2Label,
                        sv: setStat2Value,
                        sl: setStat2Label,
                      },
                      {
                        id: "3",
                        dv: "24/7",
                        dl: "Available",
                        val: stat3Value,
                        lbl: stat3Label,
                        sv: setStat3Value,
                        sl: setStat3Label,
                      },
                      {
                        id: "4",
                        dv: "5",
                        dl: "Top partners",
                        val: stat4Value,
                        lbl: stat4Label,
                        sv: setStat4Value,
                        sl: setStat4Label,
                      },
                    ] as const
                  ).map(({ id, dv, dl, val, lbl, sv, sl }) => (
                    <div
                      key={id}
                      style={{
                        border: "2px solid",
                        borderColor: "#808080 #fff #fff #808080",
                        padding: "8px 6px 4px",
                        position: "relative",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: -6,
                          left: 6,
                          background: "#c0c0c0",
                          padding: "0 3px",
                          fontSize: 9,
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        {dl}
                      </span>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0 6px",
                        }}
                      >
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => sv(e.target.value)}
                          placeholder={dv}
                          style={{
                            ...INPUT,
                            width: "100%",
                            textAlign: "center" as const,
                            fontFamily: '"Courier New", monospace',
                            fontWeight: "bold",
                          }}
                        />
                        <input
                          type="text"
                          value={lbl}
                          onChange={(e) => sl(e.target.value)}
                          placeholder={dl}
                          style={{ ...INPUT, width: "100%" }}
                        />
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: "auto",
                      paddingTop: 6,
                    }}
                  >
                    <button
                      onClick={() => void persist(buildSource(), "stats")}
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.stats ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setStat1Value("");
                        setStat1Label("");
                        setStat2Value("");
                        setStat2Label("");
                        setStat3Value("");
                        setStat3Label("");
                        setStat4Value("");
                        setStat4Label("");
                        void persist(
                          {
                            ...buildSource(),
                            stat1Value: "",
                            stat1Label: "",
                            stat2Value: "",
                            stat2Label: "",
                            stat3Value: "",
                            stat3Label: "",
                            stat4Value: "",
                            stat4Label: "",
                          },
                          "stats",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Partner Logos</span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: 5,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setPartners((p) => [...p, { name: "", logo: "" }])
                      }
                      style={{ ...BTN, fontSize: 10 }}
                    >
                      + Add
                    </button>
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {partners.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) =>
                            setPartners((prev) =>
                              prev.map((x, j) =>
                                j === i ? { ...x, name: e.target.value } : x,
                              ),
                            )
                          }
                          placeholder="Name"
                          style={{ ...INPUT, width: 60 }}
                        />
                        <CloudinaryLogoUpload
                          value={p.logo}
                          onChange={(url) =>
                            setPartners((prev) =>
                              prev.map((x, j) =>
                                j === i ? { ...x, logo: url } : x,
                              ),
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removePartner(p.logo, i)}
                          style={{
                            ...BTN_RED,
                            minWidth: 0,
                            padding: "1px 5px",
                            fontSize: 13,
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button
                      onClick={() => void persist(buildSource(), "partners")}
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.partners ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setPartners(DEFAULT_PARTNERS);
                        void persist(
                          { ...buildSource(), partners: DEFAULT_PARTNERS },
                          "partners",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Section C — Hero Images ══ */}
              <div
                className="w98h-grid-c"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Desktop Hero Image</span>
                  <p style={{ fontSize: 10, color: "#555", margin: "0 0 5px" }}>
                    Wide landscape · screens ≥ 768 px
                  </p>
                  <div
                    style={{
                      width: "100%",
                      height: 72,
                      overflow: "hidden",
                      border: "2px solid",
                      borderColor: "#808080 #fff #fff #808080",
                      marginBottom: 5,
                      position: "relative",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        heroImgDesktop ||
                        "/teamCargo-trans-webP/cargo-trans-horizontal-3.webp"
                      }
                      alt="Desktop hero"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {heroImgDesktop && (
                      <span
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          background: "#c0c0c0",
                          border: "1px solid #808080",
                          fontSize: 9,
                          padding: "0 4px",
                        }}
                      >
                        Custom
                      </span>
                    )}
                  </div>
                  <CloudinaryLogoUpload
                    value={heroImgDesktop}
                    onChange={setHeroImgDesktop}
                    folder="tc-hero"
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                    <button
                      onClick={() =>
                        void persist(buildSource(), "heroImgDesktop")
                      }
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.heroImgDesktop ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setHeroImgDesktop("");
                        void persist(
                          { ...buildSource(), heroImgDesktop: "" },
                          "heroImgDesktop",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Mobile Hero Image</span>
                  <p style={{ fontSize: 10, color: "#555", margin: "0 0 5px" }}>
                    Tall portrait · screens &lt; 768 px
                  </p>
                  <div
                    style={{
                      width: "100%",
                      height: 72,
                      overflow: "hidden",
                      border: "2px solid",
                      borderColor: "#808080 #fff #fff #808080",
                      marginBottom: 5,
                      position: "relative",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        heroImgMobile ||
                        "/teamCargo-trans-webP/cargo-trans-vertical-3.webp"
                      }
                      alt="Mobile hero"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                      }}
                    />
                    {heroImgMobile && (
                      <span
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          background: "#c0c0c0",
                          border: "1px solid #808080",
                          fontSize: 9,
                          padding: "0 4px",
                        }}
                      >
                        Custom
                      </span>
                    )}
                  </div>
                  <CloudinaryLogoUpload
                    value={heroImgMobile}
                    onChange={setHeroImgMobile}
                    folder="tc-hero"
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                    <button
                      onClick={() =>
                        void persist(buildSource(), "heroImgMobile")
                      }
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.heroImgMobile ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setHeroImgMobile("");
                        void persist(
                          { ...buildSource(), heroImgMobile: "" },
                          "heroImgMobile",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Bottom bar — Global Actions ══ */}
              <div
                style={{
                  ...GRP,
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all sections &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAll()}
                    disabled={savingAll || translating}
                    style={BTN_LG}
                  >
                    {allSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAll()}
                    disabled={savingAll || translating}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
}
