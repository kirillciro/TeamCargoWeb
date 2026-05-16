"use client";

import React from "react";
import { Loader2, Check, Save } from "lucide-react";
import Image from "next/image";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { DEFAULT_SVC_IMGS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";
import type { ServicesSectionKey } from "./types";

export default function ServicesTab() {
  const {
    win98,
    svcTitle,
    setSvcTitle,
    svcLabel,
    setSvcLabel,
    svcCards,
    setSvcCards,
    svcSectionSaved,
    svcTranslating,
    svcTranslateError,
    svcSavingAll,
    svcAllSaved,
    svcTranslationPending,
    buildServicesSource,
    persistServices,
    saveAllServices,
    resetAllServices,
  } = useAdminCustomization();

  const defaultTitles = [
    "Driver Job Placement",
    "Documents Support",
    "Ongoing Support",
    "Reliable Opportunities",
    "Local Transport",
  ];
  const defaultDescs = [
    "We connect drivers with delivery jobs at trusted logistics companies in Amsterdam and surrounding areas.",
    "We help you handle all necessary paperwork to legally work in the Netherlands.",
    "We stay available to assist you before and after you start working.",
    "We work with established logistics partners to offer stable, long-term jobs.",
    "We arrange local transport solutions to get you to and from your workplace.",
  ];

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
          const BTN_RED: React.CSSProperties = { ...BTN, color: "#cc0000" };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
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
                @media (max-width: 800px) {
                  .w98s-cards-grid { grid-template-columns: 1fr 1fr !important; }
                }
                @media (max-width: 480px) {
                  .w98s-cards-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>

              {svcTranslateError && (
                <div
                  style={{
                    background: "#fff0f0",
                    border: "2px solid #cc0000",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#cc0000",
                    fontFamily: F,
                  }}
                >
                  {svcTranslateError}
                </div>
              )}
              {svcTranslationPending && (
                <div
                  style={{
                    background: "#ffffd0",
                    border: "1px solid #808080",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#555",
                    fontFamily: F,
                  }}
                >
                  Translating to all 18 languages… please wait.
                </div>
              )}

              {/* ══ Section Heading ══ */}
              <div
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 10,
                }}
              >
                <span style={GRP_LBL}>Section Heading</span>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Small label
                  </div>
                  <input
                    type="text"
                    value={svcLabel}
                    onChange={(e) => setSvcLabel(e.target.value)}
                    placeholder="Our Services"
                    style={INPUT}
                  />
                </div>
                <div style={{ flex: 2, minWidth: 200 }}>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Main title
                  </div>
                  <input
                    type="text"
                    value={svcTitle}
                    onChange={(e) => setSvcTitle(e.target.value)}
                    placeholder="What We Do"
                    style={INPUT}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() =>
                      void persistServices(buildServicesSource(), "svcHeading")
                    }
                    disabled={svcTranslating}
                    style={BTN}
                  >
                    {svcSectionSaved.svcHeading ? "Saved ✓" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setSvcTitle("");
                      setSvcLabel("");
                      void persistServices(
                        { ...buildServicesSource(), title: "", label: "" },
                        "svcHeading",
                      );
                    }}
                    disabled={svcTranslating}
                    style={BTN_RED}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* ══ Service Cards 3-col grid ══ */}
              <div
                className="w98s-cards-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  marginBottom: 12,
                  alignItems: "start",
                }}
              >
                {svcCards.map((card, i) => {
                  const cardKey = `svcCard${i}` as ServicesSectionKey;
                  return (
                    <div
                      key={i}
                      style={{
                        ...GRP,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span style={GRP_LBL}>Card {i + 1}</span>
                      <div
                        style={{
                          width: "100%",
                          height: 160,
                          overflow: "hidden",
                          border: "2px solid",
                          borderColor: "#808080 #fff #fff #808080",
                          marginBottom: 6,
                          position: "relative",
                          flexShrink: 0,
                          background: "#000",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.img || DEFAULT_SVC_IMGS[i]}
                          alt={`Card ${i + 1} preview`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                      <CloudinaryLogoUpload
                        value={card.img}
                        onChange={(url) =>
                          setSvcCards((prev) =>
                            prev.map((c, j) =>
                              j === i ? { ...c, img: url } : c,
                            ),
                          )
                        }
                        folder="tc-services"
                      />
                      <div style={{ ...HR }} />
                      <div
                        style={{
                          marginBottom: 3,
                          fontFamily: F,
                          fontSize: 11,
                        }}
                      >
                        Title
                      </div>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) =>
                          setSvcCards((prev) =>
                            prev.map((c, j) =>
                              j === i ? { ...c, title: e.target.value } : c,
                            ),
                          )
                        }
                        placeholder={defaultTitles[i]}
                        style={INPUT}
                      />
                      <div style={{ ...HR }} />
                      <div
                        style={{
                          marginBottom: 3,
                          fontFamily: F,
                          fontSize: 11,
                        }}
                      >
                        Description
                      </div>
                      <textarea
                        value={card.desc}
                        onChange={(e) =>
                          setSvcCards((prev) =>
                            prev.map((c, j) =>
                              j === i ? { ...c, desc: e.target.value } : c,
                            ),
                          )
                        }
                        rows={3}
                        placeholder={defaultDescs[i]}
                        style={TEXTAREA}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          marginTop: "auto",
                          paddingTop: 8,
                        }}
                      >
                        <button
                          onClick={() =>
                            void persistServices(buildServicesSource(), cardKey)
                          }
                          disabled={svcTranslating}
                          style={BTN}
                        >
                          {svcSectionSaved[cardKey] ? "Saved ✓" : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setSvcCards((prev) =>
                              prev.map((c, j) =>
                                j === i
                                  ? {
                                      title: "",
                                      desc: "",
                                      img: DEFAULT_SVC_IMGS[i],
                                    }
                                  : c,
                              ),
                            );
                            const updated = buildServicesSource();
                            void persistServices(
                              {
                                ...updated,
                                [`item${i}Title`]: "",
                                [`item${i}Desc`]: "",
                                [`img${i}`]: DEFAULT_SVC_IMGS[i],
                              },
                              cardKey,
                            );
                          }}
                          disabled={svcTranslating}
                          style={BTN_RED}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                  Save all cards &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAllServices()}
                    disabled={svcSavingAll || svcTranslating}
                    style={BTN_LG}
                  >
                    {svcAllSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAllServices()}
                    disabled={svcSavingAll || svcTranslating}
                    style={{ ...BTN_LG, color: "#cc0000" }}
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
          {svcTranslateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {svcTranslateError}
            </p>
          )}
          {svcTranslationPending && (
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
                  value={svcLabel}
                  onChange={(e) => setSvcLabel(e.target.value)}
                  placeholder="OUR SERVICES"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Main title</p>
                <input
                  type="text"
                  value={svcTitle}
                  onChange={(e) => setSvcTitle(e.target.value)}
                  placeholder="What We Offer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {svcCards.map((card, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3"
              >
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Service {i + 1}
                </p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) =>
                      setSvcCards((prev) =>
                        prev.map((c, j) =>
                          j === i ? { ...c, title: e.target.value } : c,
                        ),
                      )
                    }
                    placeholder="Title"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                  <textarea
                    value={card.desc}
                    rows={3}
                    onChange={(e) =>
                      setSvcCards((prev) =>
                        prev.map((c, j) =>
                          j === i ? { ...c, desc: e.target.value } : c,
                        ),
                      )
                    }
                    placeholder="Description"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
                  />
                </div>
                {card.img && (
                  <Image
                    src={card.img}
                    alt=""
                    width={400}
                    height={96}
                    className="w-full h-24 object-cover rounded-lg"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
                <CloudinaryLogoUpload
                  value={card.img}
                  onChange={(url: string) =>
                    setSvcCards((prev) =>
                      prev.map((c, j) => (j === i ? { ...c, img: url } : c)),
                    )
                  }
                />
              </div>
            ))}
          </div>

          {/* Global Actions */}
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Save all changes &amp; translate to 18 languages
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => void saveAllServices()}
                disabled={svcSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {svcSavingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : svcAllSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {svcAllSaved ? "All Saved ✓" : "Save All"}
              </button>
              <button
                onClick={() => void resetAllServices()}
                disabled={svcSavingAll}
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
