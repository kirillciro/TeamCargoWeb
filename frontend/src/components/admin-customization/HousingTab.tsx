"use client";

import React from "react";
import { Loader2, Check, Save } from "lucide-react";
import Image from "next/image";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { HOUSING_ICON_OPTS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";

export default function HousingTab() {
  const {
    win98,
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
    housingTranslateError,
    housingSavingAll,
    housingAllSaved,
    housingTranslationPending,
    buildHousingSource,
    persistHousing,
    saveAllHousing,
    resetAllHousing,
  } = useAdminCustomization();

  return (
    <>
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
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          void HR;
          const INPUT: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "2px 4px",
            width: "100%",
            boxSizing: "border-box" as const,
          };
          const TEXTAREA: React.CSSProperties = {
            ...INPUT,
            resize: "vertical" as const,
            display: "block",
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
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <style>{`
                .w98h-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
                @media (max-width: 800px) { .w98h-grid { grid-template-columns: 1fr 1fr; } }
                @media (max-width: 480px) { .w98h-grid { grid-template-columns: 1fr; } }
              `}</style>

              {housingTranslateError && (
                <div
                  style={{
                    background: "#ffcccc",
                    border: "1px solid #cc0000",
                    padding: "4px 8px",
                    fontFamily: F,
                    fontSize: 11,
                    color: "#cc0000",
                  }}
                >
                  {housingTranslateError}
                </div>
              )}
              {housingTranslationPending && (
                <div
                  style={{
                    background: "#fffacc",
                    border: "1px solid #808000",
                    padding: "4px 8px",
                    fontFamily: F,
                    fontSize: 11,
                    color: "#555500",
                  }}
                >
                  Translating to all 18 languages in the background… This tab
                  will auto-refresh when done.
                </div>
              )}

              {/* ══ Section Heading + CTA ══ */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <div style={GRP}>
                  <span style={GRP_LBL}>Section Heading</span>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: "0 0 160px" }}>
                      <div
                        style={{
                          fontFamily: F,
                          fontSize: 11,
                          color: "#000",
                          marginBottom: 2,
                        }}
                      >
                        Small label
                      </div>
                      <input
                        style={INPUT}
                        value={housingLabel}
                        onChange={(e) => setHousingLabel(e.target.value)}
                        placeholder="HOUSING"
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div
                        style={{
                          fontFamily: F,
                          fontSize: 11,
                          color: "#000",
                          marginBottom: 2,
                        }}
                      >
                        Main title
                      </div>
                      <input
                        style={INPUT}
                        value={housingTitle}
                        onChange={(e) => setHousingTitle(e.target.value)}
                        placeholder="Your New Home"
                      />
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        style={BTN}
                        onClick={() =>
                          void persistHousing(
                            buildHousingSource(),
                            "housingHeading",
                          )
                        }
                        disabled={housingTranslating}
                      >
                        Save
                      </button>
                      <button
                        style={BTN}
                        onClick={() => {
                          setHousingLabel("");
                          setHousingTitle("");
                          void persistHousing(
                            { ...buildHousingSource(), label: "", title: "" },
                            "housingHeading",
                          );
                        }}
                        disabled={housingTranslating}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ ...GRP, minWidth: 160 }}>
                  <span style={GRP_LBL}>CTA Button Text</span>
                  <div
                    style={{ display: "flex", gap: 4, alignItems: "flex-end" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: F,
                          fontSize: 11,
                          color: "#000",
                          marginBottom: 2,
                        }}
                      >
                        Button label
                      </div>
                      <input
                        style={INPUT}
                        value={housingCta}
                        onChange={(e) => setHousingCta(e.target.value)}
                        placeholder="Get Started"
                      />
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        style={BTN}
                        onClick={() =>
                          void persistHousing(
                            buildHousingSource(),
                            "housingCta",
                          )
                        }
                        disabled={housingTranslating}
                      >
                        Save
                      </button>
                      <button
                        style={BTN}
                        onClick={() => {
                          setHousingCta("");
                          void persistHousing(
                            { ...buildHousingSource(), cta: "" },
                            "housingCta",
                          );
                        }}
                        disabled={housingTranslating}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ══ 3-col row: Description | BG Color | Perks ══ */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  alignItems: "stretch",
                }}
              >
                {/* Description */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Description</span>
                  <textarea
                    style={{ ...TEXTAREA, flex: 1 }}
                    rows={4}
                    value={housingDesc}
                    onChange={(e) => setHousingDesc(e.target.value)}
                    placeholder="We provide housing for drivers moving from abroad…"
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: "auto",
                      paddingTop: 6,
                    }}
                  >
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(
                          buildHousingSource(),
                          "housingDescription",
                        )
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingDesc("");
                        void persistHousing(
                          { ...buildHousingSource(), description: "" },
                          "housingDescription",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* BG Color */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Section Background Color</span>
                  <div
                    style={{
                      fontFamily: F,
                      fontSize: 10,
                      color: "#444",
                      marginBottom: 4,
                    }}
                  >
                    Default: #0d2e18
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <input
                      type="color"
                      value={housingBg || "#0d2e18"}
                      onChange={(e) => setHousingBg(e.target.value)}
                      style={{
                        width: 32,
                        height: 24,
                        border: "2px solid #808080",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                    <input
                      style={{ ...INPUT, width: 80, fontFamily: "monospace" }}
                      value={housingBg}
                      onChange={(e) => setHousingBg(e.target.value)}
                      placeholder="#0d2e18"
                      maxLength={7}
                    />
                  </div>
                  <div
                    style={{
                      height: 16,
                      border: "2px inset #808080",
                      marginBottom: 6,
                      background: housingBg || "#0d2e18",
                    }}
                  />
                  <div style={{ display: "flex", gap: 4, marginTop: "auto" }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(buildHousingSource(), "housingBg")
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingBg("");
                        void persistHousing(
                          { ...buildHousingSource(), bg: "" },
                          "housingBg",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Perks */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Perks (4 items)</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      flex: 1,
                    }}
                  >
                    {housingPerks.map((perkText, i) => {
                      const isPickerOpen = housingIconPicker === i;
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <div style={{ position: "relative", flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => {
                                setHousingIconPicker(isPickerOpen ? null : i);
                                setHousingIconPages((prev) => {
                                  const next = [...prev];
                                  next[i] = 0;
                                  return next;
                                });
                              }}
                              style={{
                                ...BTN,
                                minWidth: 0,
                                padding: "2px 8px",
                              }}
                              title="Pick icon"
                            >
                              <span style={{ fontSize: 10 }}>
                                {housingPerkIcons[i]
                                  ? housingPerkIcons[i].slice(0, 3)
                                  : "Ico"}
                              </span>
                            </button>
                            {isPickerOpen && (
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
                                      disabled={housingIconPages[i] === 0}
                                      onClick={() =>
                                        setHousingIconPages((prev) => {
                                          const next = [...prev];
                                          next[i] = Math.max(0, next[i] - 1);
                                          return next;
                                        })
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
                                      {housingIconPages[i] + 1}/
                                      {HOUSING_ICON_OPTS.length}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={
                                        housingIconPages[i] >=
                                        HOUSING_ICON_OPTS.length - 1
                                      }
                                      onClick={() =>
                                        setHousingIconPages((prev) => {
                                          const next = [...prev];
                                          next[i] = Math.min(
                                            HOUSING_ICON_OPTS.length - 1,
                                            next[i] + 1,
                                          );
                                          return next;
                                        })
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
                                  {HOUSING_ICON_OPTS[housingIconPages[i]].map(
                                    ({ id, Icon: Ic, label }) => (
                                      <button
                                        key={id}
                                        type="button"
                                        title={label}
                                        onClick={() => {
                                          setHousingPerkIcons((prev) => {
                                            const next = [...prev];
                                            next[i] = id;
                                            return next;
                                          });
                                          setHousingIconPicker(null);
                                        }}
                                        style={{
                                          ...BTN,
                                          minWidth: 0,
                                          padding: "3px",
                                          background:
                                            housingPerkIcons[i] === id
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
                                    setHousingPerkIcons((prev) => {
                                      const next = [...prev];
                                      next[i] = "";
                                      return next;
                                    });
                                    setHousingIconPicker(null);
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
                            style={{ ...INPUT, flex: 1 }}
                            type="text"
                            value={perkText}
                            onChange={(e) =>
                              setHousingPerks((prev) => {
                                const next = [...prev];
                                next[i] = e.target.value;
                                return next;
                              })
                            }
                            placeholder={`Perk ${i + 1} text`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: "auto",
                      paddingTop: 8,
                    }}
                  >
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(
                          buildHousingSource(),
                          "housingPerks",
                        )
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingPerks(["", "", "", ""]);
                        setHousingPerkIcons(["", "", "", ""]);
                        void persistHousing(
                          {
                            ...buildHousingSource(),
                            perk0: "",
                            perk1: "",
                            perk2: "",
                            perk3: "",
                            perk0Icon: "",
                            perk1Icon: "",
                            perk2Icon: "",
                            perk3Icon: "",
                          },
                          "housingPerks",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Photos ══ */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div style={GRP}>
                  <span style={GRP_LBL}>Photo 1 (left column)</span>
                  <Image
                    src={housingImg1 || "/images/living_1_webP.webp"}
                    alt=""
                    width={400}
                    height={140}
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "contain",
                      background: "#000",
                      display: "block",
                      marginBottom: 6,
                    }}
                  />
                  <CloudinaryLogoUpload
                    value={housingImg1 || "/images/living_1_webP.webp"}
                    onChange={(url) => setHousingImg1(url)}
                  />
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(buildHousingSource(), "housingImg1")
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingImg1("");
                        void persistHousing(
                          { ...buildHousingSource(), img1: "" },
                          "housingImg1",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div style={GRP}>
                  <span style={GRP_LBL}>Photo 2 (right column)</span>
                  <Image
                    src={housingImg2 || "/images/living_2_webP.webp"}
                    alt=""
                    width={400}
                    height={140}
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "contain",
                      background: "#000",
                      display: "block",
                      marginBottom: 6,
                    }}
                  />
                  <CloudinaryLogoUpload
                    value={housingImg2 || "/images/living_2_webP.webp"}
                    onChange={(url) => setHousingImg2(url)}
                  />
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(buildHousingSource(), "housingImg2")
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingImg2("");
                        void persistHousing(
                          { ...buildHousingSource(), img2: "" },
                          "housingImg2",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Global Actions ══ */}
              <div
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all Housing fields &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAllHousing()}
                    style={BTN_LG}
                    disabled={housingSavingAll || housingTranslating}
                  >
                    {housingAllSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAllHousing()}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                    disabled={housingSavingAll || housingTranslating}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {!win98 && (
        <div className="space-y-4">
          {housingTranslateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {housingTranslateError}
            </p>
          )}
          {housingTranslationPending && (
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-3 text-xs text-amber-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              Translating to all 18 languages in the background… This tab will
              auto-refresh when done.
            </div>
          )}

          {/* Section Heading */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Small label</p>
                <input
                  type="text"
                  value={housingLabel}
                  onChange={(e) => setHousingLabel(e.target.value)}
                  placeholder="HOUSING"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Main title</p>
                <input
                  type="text"
                  value={housingTitle}
                  onChange={(e) => setHousingTitle(e.target.value)}
                  placeholder="Your New Home"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* CTA + BG Color */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                CTA Button
              </p>
              <input
                type="text"
                value={housingCta}
                onChange={(e) => setHousingCta(e.target.value)}
                placeholder="Get Started"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Background Color
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={housingBg || "#0d2e18"}
                  onChange={(e) => setHousingBg(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={housingBg}
                  onChange={(e) => setHousingBg(e.target.value)}
                  placeholder="#0d2e18"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
                <div
                  className="w-8 h-8 rounded border border-slate-600 shrink-0"
                  style={{ background: housingBg || "#0d2e18" }}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Description
            </p>
            <textarea
              value={housingDesc}
              onChange={(e) => setHousingDesc(e.target.value)}
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
            />
          </div>

          {/* Perks */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Perks
            </p>
            <div className="space-y-2">
              {housingPerks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-14 shrink-0">
                    Perk {i + 1}
                  </span>
                  <input
                    type="text"
                    value={perk}
                    onChange={(e) =>
                      setHousingPerks((prev) =>
                        prev.map((p, j) => (j === i ? e.target.value : p)),
                      )
                    }
                    placeholder={`Perk ${i + 1}`}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Photo 1
              </p>
              {housingImg1 && (
                <Image
                  src={housingImg1}
                  alt=""
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              )}
              <CloudinaryLogoUpload
                value={housingImg1}
                onChange={setHousingImg1}
              />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Photo 2
              </p>
              {housingImg2 && (
                <Image
                  src={housingImg2}
                  alt=""
                  width={400}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              )}
              <CloudinaryLogoUpload
                value={housingImg2}
                onChange={setHousingImg2}
              />
            </div>
          </div>

          {/* Global Actions */}
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Save all changes &amp; translate to 18 languages
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => void saveAllHousing()}
                disabled={housingSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {housingSavingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : housingAllSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {housingAllSaved ? "All Saved ✓" : "Save All"}
              </button>
              <button
                onClick={() => void resetAllHousing()}
                disabled={housingSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-60 transition-colors"
              >
                Restore All Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
