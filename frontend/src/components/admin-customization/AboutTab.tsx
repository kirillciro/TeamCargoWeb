"use client";

import React from "react";
import { Loader2, Check, Save, RotateCcw, Users, MapPin } from "lucide-react";
import Image from "next/image";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { BADGE_ICON_OPTS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";
import type { AboutSectionKey } from "./types";

export default function AboutTab() {
  const {
    win98,
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
    aboutTranslating,
    aboutTranslateError,
    aboutSavingAll,
    aboutAllSaved,
    aboutTranslationPending,
    buildAboutSource,
    persistAbout,
    saveAllAbout,
    resetAllAbout,
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

          const imgItems = [
            {
              key: "aboutImgLeft" as AboutSectionKey,
              label: "Left Portrait",
              hint: "Tall portrait — left column",
              state: aboutImgLeft,
              setter: setAboutImgLeft,
              defaultSrc: "/teamCargo-trans-webP/TeamCargoGeletEdited.webp",
            },
            {
              key: "aboutImgTopRight" as AboutSectionKey,
              label: "Top-Right Image",
              hint: "Upper image in right column",
              state: aboutImgTopRight,
              setter: setAboutImgTopRight,
              defaultSrc: "/images/amazon_courier_webP.webp",
            },
            {
              key: "aboutImgBottomRight" as AboutSectionKey,
              label: "Bottom-Right Image",
              hint: "Lower image in right column",
              state: aboutImgBottomRight,
              setter: setAboutImgBottomRight,
              defaultSrc: "/images/cargoTeam_webP.webp",
            },
          ];

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
                @media (max-width: 800px) { .w98a-grid { grid-template-columns: 1fr 1fr !important; } }
                @media (max-width: 480px) { .w98a-grid { grid-template-columns: 1fr !important; } }
              `}</style>

              {aboutTranslateError && (
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
                  {aboutTranslateError}
                </div>
              )}
              {aboutTranslationPending && (
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
                    value={aboutLabel}
                    onChange={(e) => setAboutLabel(e.target.value)}
                    placeholder="About us"
                    style={INPUT}
                  />
                </div>
                <div style={{ flex: 2, minWidth: 200 }}>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Main title
                  </div>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    placeholder="About Team Cargo"
                    style={INPUT}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() =>
                      void persistAbout(buildAboutSource(), "aboutHeading")
                    }
                    disabled={aboutTranslating}
                    style={BTN}
                  >
                    {aboutSectionSaved.aboutHeading ? "Saved ✓" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setAboutLabel("");
                      setAboutTitle("");
                      void persistAbout(
                        { ...buildAboutSource(), label: "", title: "" },
                        "aboutHeading",
                      );
                    }}
                    disabled={aboutTranslating}
                    style={BTN_RED}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* ══ 3-column grid ══ */}
              <div
                className="w98a-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  marginBottom: 12,
                  alignItems: "start",
                }}
              >
                {/* Descriptions */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Descriptions</span>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    First paragraph
                  </div>
                  <textarea
                    value={aboutDesc}
                    onChange={(e) => setAboutDesc(e.target.value)}
                    rows={3}
                    placeholder="Team Cargo is a driver recruitment agency based in Amsterdam…"
                    style={TEXTAREA}
                  />
                  <div style={{ ...HR }} />
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Second paragraph
                  </div>
                  <textarea
                    value={aboutDesc2}
                    onChange={(e) => setAboutDesc2(e.target.value)}
                    rows={3}
                    placeholder="We work with trusted partners such as GLS, FedEx, Amazon, and DPD…"
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
                        void persistAbout(
                          buildAboutSource(),
                          "aboutDescriptions",
                        )
                      }
                      disabled={aboutTranslating}
                      style={BTN}
                    >
                      {aboutSectionSaved.aboutDescriptions ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setAboutDesc("");
                        setAboutDesc2("");
                        void persistAbout(
                          {
                            ...buildAboutSource(),
                            description: "",
                            description2: "",
                          },
                          "aboutDescriptions",
                        );
                      }}
                      disabled={aboutTranslating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Our Values */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Our Values</span>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Values title
                  </div>
                  <input
                    type="text"
                    value={aboutValuesTitle}
                    onChange={(e) => setAboutValuesTitle(e.target.value)}
                    placeholder="Our values"
                    style={INPUT}
                  />
                  <div style={{ ...HR }} />
                  {(
                    [
                      "Reliability",
                      "Efficiency",
                      "Customer focus",
                      "Safety",
                    ] as const
                  ).map((ph, i) => (
                    <div key={i} style={{ marginBottom: i < 3 ? 5 : 0 }}>
                      <input
                        type="text"
                        value={aboutValues[i]}
                        onChange={(e) =>
                          setAboutValues((prev) =>
                            prev.map((v, j) => (j === i ? e.target.value : v)),
                          )
                        }
                        placeholder={ph}
                        style={INPUT}
                      />
                    </div>
                  ))}
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
                        void persistAbout(buildAboutSource(), "aboutValues")
                      }
                      disabled={aboutTranslating}
                      style={BTN}
                    >
                      {aboutSectionSaved.aboutValues ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setAboutValuesTitle("");
                        setAboutValues(["", "", "", ""]);
                        void persistAbout(
                          {
                            ...buildAboutSource(),
                            valuesTitle: "",
                            value0: "",
                            value1: "",
                            value2: "",
                            value3: "",
                          },
                          "aboutValues",
                        );
                      }}
                      disabled={aboutTranslating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Stat Badges */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Stat Badges</span>
                  {aboutIconPicker && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAboutIconPicker(null)}
                    />
                  )}
                  {/* Drivers badge */}
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Drivers placed
                  </div>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setAboutIconPicker(
                            aboutIconPicker === "drivers" ? null : "drivers",
                          );
                          setAboutDriversIconPage(0);
                        }}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-700 border border-slate-600 hover:border-amber-400 transition-colors"
                        title="Pick icon"
                      >
                        {(() => {
                          const opt = BADGE_ICON_OPTS.drivers
                            .flat()
                            .find((o) => o.id === aboutDriversIcon);
                          const Ic = opt?.Icon ?? Users;
                          return <Ic className="w-4 h-4 text-amber-400" />;
                        })()}
                      </button>
                      {aboutIconPicker === "drivers" && (
                        <div className="absolute bottom-full left-0 mb-2 z-50 w-56 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">
                              Choose icon
                            </p>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={aboutDriversIconPage === 0}
                                onClick={() =>
                                  setAboutDriversIconPage((p) => p - 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                              >
                                ‹
                              </button>
                              <span className="text-[9px] text-slate-500 w-8 text-center">
                                {aboutDriversIconPage + 1} /{" "}
                                {BADGE_ICON_OPTS.drivers.length}
                              </span>
                              <button
                                type="button"
                                disabled={
                                  aboutDriversIconPage ===
                                  BADGE_ICON_OPTS.drivers.length - 1
                                }
                                onClick={() =>
                                  setAboutDriversIconPage((p) => p + 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                              >
                                ›
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {BADGE_ICON_OPTS.drivers[aboutDriversIconPage].map(
                              ({ id, Icon: Ic, label }) => (
                                <button
                                  key={id}
                                  type="button"
                                  title={label}
                                  onClick={() => {
                                    setAboutDriversIcon(id);
                                    setAboutIconPicker(null);
                                  }}
                                  className={
                                    "w-9 h-9 flex items-center justify-center rounded-lg transition-colors " +
                                    (aboutDriversIcon === id
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
                            onClick={() => {
                              setAboutDriversIcon("");
                              setAboutIconPicker(null);
                            }}
                            className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg py-1 text-[10px] text-slate-500 hover:bg-slate-700 hover:text-white transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" /> Reset
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={aboutDriversPlaced}
                      onChange={(e) => setAboutDriversPlaced(e.target.value)}
                      placeholder="500+ Drivers placed"
                      style={{ ...INPUT, width: "auto", flex: 1 }}
                    />
                  </div>
                  <div style={{ ...HR }} />
                  {/* Location badge */}
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Location
                  </div>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setAboutIconPicker(
                            aboutIconPicker === "location" ? null : "location",
                          );
                          setAboutLocationIconPage(0);
                        }}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-700 border border-slate-600 hover:border-amber-400 transition-colors"
                        title="Pick icon"
                      >
                        {(() => {
                          const opt = BADGE_ICON_OPTS.location
                            .flat()
                            .find((o) => o.id === aboutLocationIcon);
                          const Ic = opt?.Icon ?? MapPin;
                          return <Ic className="w-4 h-4 text-amber-400" />;
                        })()}
                      </button>
                      {aboutIconPicker === "location" && (
                        <div className="absolute bottom-full left-0 mb-2 z-50 w-56 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">
                              Choose icon
                            </p>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={aboutLocationIconPage === 0}
                                onClick={() =>
                                  setAboutLocationIconPage((p) => p - 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                              >
                                ‹
                              </button>
                              <span className="text-[9px] text-slate-500 w-8 text-center">
                                {aboutLocationIconPage + 1} /{" "}
                                {BADGE_ICON_OPTS.location.length}
                              </span>
                              <button
                                type="button"
                                disabled={
                                  aboutLocationIconPage ===
                                  BADGE_ICON_OPTS.location.length - 1
                                }
                                onClick={() =>
                                  setAboutLocationIconPage((p) => p + 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                              >
                                ›
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {BADGE_ICON_OPTS.location[
                              aboutLocationIconPage
                            ].map(({ id, Icon: Ic, label }) => (
                              <button
                                key={id}
                                type="button"
                                title={label}
                                onClick={() => {
                                  setAboutLocationIcon(id);
                                  setAboutIconPicker(null);
                                }}
                                className={
                                  "w-9 h-9 flex items-center justify-center rounded-lg transition-colors " +
                                  (aboutLocationIcon === id
                                    ? "bg-amber-400/20 border border-amber-400/50 text-amber-300"
                                    : "text-slate-400 hover:bg-slate-700 hover:text-white")
                                }
                              >
                                <Ic className="w-4 h-4" />
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAboutLocationIcon("");
                              setAboutIconPicker(null);
                            }}
                            className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg py-1 text-[10px] text-slate-500 hover:bg-slate-700 hover:text-white transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" /> Reset
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={aboutLocation}
                      onChange={(e) => setAboutLocation(e.target.value)}
                      placeholder="Amsterdam, Netherlands"
                      style={{ ...INPUT, width: "auto", flex: 1 }}
                    />
                  </div>
                  <div style={{ ...HR }} />
                  {/* Years badge */}
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Years active badge
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      type="text"
                      value={aboutYearsActiveNum}
                      onChange={(e) => setAboutYearsActiveNum(e.target.value)}
                      placeholder="7+"
                      style={{ ...INPUT, width: 50 }}
                    />
                    <input
                      type="text"
                      value={aboutYearsActive}
                      onChange={(e) => setAboutYearsActive(e.target.value)}
                      placeholder="Years active"
                      style={{ ...INPUT, flex: 1, width: "auto" }}
                    />
                  </div>
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
                        void persistAbout(buildAboutSource(), "aboutBadges")
                      }
                      disabled={aboutTranslating}
                      style={BTN}
                    >
                      {aboutSectionSaved.aboutBadges ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setAboutDriversPlaced("");
                        setAboutYearsActive("");
                        setAboutLocation("");
                        setAboutYearsActiveNum("");
                        setAboutDriversIcon("");
                        setAboutLocationIcon("");
                        void persistAbout(
                          {
                            ...buildAboutSource(),
                            driversPlaced: "",
                            yearsActive: "",
                            location: "",
                            yearsActiveNum: "",
                            driversIcon: "",
                            locationIcon: "",
                          },
                          "aboutBadges",
                        );
                      }}
                      disabled={aboutTranslating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* 3 Images */}
                {imgItems.map(
                  ({ key, label, hint, state, setter, defaultSrc }) => (
                    <div
                      key={key}
                      style={{
                        ...GRP,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span style={GRP_LBL}>{label}</span>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#555",
                          marginBottom: 5,
                          fontFamily: F,
                        }}
                      >
                        {hint}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: 140,
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
                          src={state || defaultSrc}
                          alt={label}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                      <CloudinaryLogoUpload
                        value={state}
                        onChange={setter}
                        folder="tc-about"
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
                            void persistAbout(buildAboutSource(), key)
                          }
                          disabled={aboutTranslating}
                          style={BTN}
                        >
                          {aboutSectionSaved[key] ? "Saved ✓" : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setter("");
                            const imgKey = key
                              .replace(/^about/, "")
                              .replace(/^I/, "i");
                            void persistAbout(
                              { ...buildAboutSource(), [imgKey]: "" },
                              key,
                            );
                          }}
                          disabled={aboutTranslating}
                          style={BTN_RED}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  ),
                )}
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
                  Save all fields &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAllAbout()}
                    disabled={aboutSavingAll || aboutTranslating}
                    style={BTN_LG}
                  >
                    {aboutAllSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAllAbout()}
                    disabled={aboutSavingAll || aboutTranslating}
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
          {aboutTranslateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {aboutTranslateError}
            </p>
          )}
          {aboutTranslationPending && (
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
                  value={aboutLabel}
                  onChange={(e) => setAboutLabel(e.target.value)}
                  placeholder="ABOUT US"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Main title</p>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  placeholder="Who We Are"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Content
            </p>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-500">Description 1</p>
              <textarea
                value={aboutDesc}
                onChange={(e) => setAboutDesc(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-500">Description 2</p>
              <textarea
                value={aboutDesc2}
                onChange={(e) => setAboutDesc2(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
              />
            </div>
          </div>

          {/* Values */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Values
            </p>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-500">Values title</p>
              <input
                type="text"
                value={aboutValuesTitle}
                onChange={(e) => setAboutValuesTitle(e.target.value)}
                placeholder="Our Values"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {aboutValues.map((v, i) => (
                <input
                  key={i}
                  type="text"
                  value={v}
                  onChange={(e) =>
                    setAboutValues((prev) =>
                      prev.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  placeholder={`Value ${i + 1}`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Stat Badges
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Drivers placed</p>
                <input
                  type="text"
                  value={aboutDriversPlaced}
                  onChange={(e) => setAboutDriversPlaced(e.target.value)}
                  placeholder="500+"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Years active (label)</p>
                <input
                  type="text"
                  value={aboutYearsActive}
                  onChange={(e) => setAboutYearsActive(e.target.value)}
                  placeholder="Years Active"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Years active (number)</p>
                <input
                  type="text"
                  value={aboutYearsActiveNum}
                  onChange={(e) => setAboutYearsActiveNum(e.target.value)}
                  placeholder="5+"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Location</p>
                <input
                  type="text"
                  value={aboutLocation}
                  onChange={(e) => setAboutLocation(e.target.value)}
                  placeholder="Amsterdam, NL"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Left Image
              </p>
              {aboutImgLeft && (
                <Image
                  src={aboutImgLeft}
                  alt=""
                  width={400}
                  height={112}
                  className="w-full h-28 object-cover rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              )}
              <CloudinaryLogoUpload
                value={aboutImgLeft}
                onChange={setAboutImgLeft}
              />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Top Right Image
              </p>
              {aboutImgTopRight && (
                <Image
                  src={aboutImgTopRight}
                  alt=""
                  width={400}
                  height={112}
                  className="w-full h-28 object-cover rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              )}
              <CloudinaryLogoUpload
                value={aboutImgTopRight}
                onChange={setAboutImgTopRight}
              />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Bottom Right Image
              </p>
              {aboutImgBottomRight && (
                <Image
                  src={aboutImgBottomRight}
                  alt=""
                  width={400}
                  height={112}
                  className="w-full h-28 object-cover rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              )}
              <CloudinaryLogoUpload
                value={aboutImgBottomRight}
                onChange={setAboutImgBottomRight}
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
                onClick={() => void saveAllAbout()}
                disabled={aboutSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {aboutSavingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : aboutAllSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {aboutAllSaved ? "All Saved ✓" : "Save All"}
              </button>
              <button
                onClick={() => void resetAllAbout()}
                disabled={aboutSavingAll}
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
