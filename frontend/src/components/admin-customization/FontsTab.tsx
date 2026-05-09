"use client";

import React from "react";
import { FONT_OPTIONS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";

export default function FontsTab() {
  const {
    win98,
    selectedFont,
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
  } = useAdminCustomization();

  const activeFontFamily =
    FONT_OPTIONS.find((f) => f.id === selectedFont)?.family ??
    '"MS Sans Serif", Arial, sans-serif';
  const weightLabel: Record<string, string> = {
    "100": "Thin",
    "200": "ExtraLight",
    "300": "Light",
    "400": "Regular",
    "500": "Medium",
    "600": "SemiBold",
    "700": "Bold",
    "800": "ExtraBold",
    "900": "Black",
  };

  return (
    <>
      {!win98 && (
        <div className="space-y-4">
          {/* Font family grid */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Typeface
            </p>
            <p className="text-[11px] text-slate-500">
              Choose the font family used across the entire site.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {FONT_OPTIONS.map((font) => {
                const isActive = selectedFont === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => applyFont(font)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      isActive
                        ? "bg-amber-400/10 border-amber-400/60 ring-1 ring-amber-400/30"
                        : "bg-slate-800/40 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <p
                      className={`text-base font-bold truncate mb-0.5 ${isActive ? "text-amber-300" : "text-white"}`}
                      style={{ fontFamily: font.family }}
                    >
                      {font.label}
                    </p>
                    <p
                      className="text-[11px] text-slate-500"
                      style={{ fontFamily: font.family }}
                    >
                      Aa Bb 123
                    </p>
                    {isActive && (
                      <p className="text-[10px] font-bold text-amber-400 mt-1 uppercase tracking-widest">
                        ✓ Active
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography controls + live preview */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Controls */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Typography Controls
              </p>
              {/* Weight */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Font Weight</p>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {weightLabel[fontWeight] ?? fontWeight}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={900}
                  step={100}
                  value={fontWeight}
                  onChange={(e) => applyFontWeight(e.target.value)}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                  <span>100</span>
                  <span>300</span>
                  <span>400</span>
                  <span>600</span>
                  <span>700</span>
                  <span>900</span>
                </div>
              </div>
              <div className="border-t border-slate-800" />
              {/* Letter spacing */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Letter Spacing</p>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {letterSpacing}em
                  </span>
                </div>
                <input
                  type="range"
                  min={-0.05}
                  max={0.2}
                  step={0.005}
                  value={letterSpacing}
                  onChange={(e) => applyLetterSpacing(e.target.value)}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                  <span>-0.05</span>
                  <span>0</span>
                  <span>0.1</span>
                  <span>0.2em</span>
                </div>
              </div>
              <div className="border-t border-slate-800" />
              {/* Line height */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Line Height</p>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {lineHeight}
                  </span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={2.2}
                  step={0.05}
                  value={lineHeight}
                  onChange={(e) => applyLineHeight(e.target.value)}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                  <span>1.0</span>
                  <span>1.4</span>
                  <span>1.65</span>
                  <span>2.0</span>
                  <span>2.2</span>
                </div>
              </div>
            </div>

            {/* Live preview */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Live Preview
              </p>
              <div
                className="rounded-xl bg-slate-800 border border-slate-700 p-4 space-y-2"
                style={{
                  fontFamily: activeFontFamily,
                  letterSpacing: `${letterSpacing}em`,
                  lineHeight,
                  fontWeight,
                }}
              >
                <p className="text-lg font-bold text-white">
                  Team Cargo — Professioneel Transport
                </p>
                <p className="text-sm text-slate-300">
                  Wij maken onze klanten en die van uw tevreden. Betrouwbaar,
                  snel en professioneel.
                </p>
                <p className="text-xs text-slate-500">
                  De beste keuze voor uw logistieke behoeften. Snel, veilig en
                  betrouwbaar transport door heel Nederland.
                </p>
              </div>
              <div
                className="rounded-xl bg-amber-400 p-3"
                style={{
                  fontFamily: activeFontFamily,
                  letterSpacing: `${letterSpacing}em`,
                  lineHeight,
                  fontWeight,
                }}
              >
                <p className="text-xs text-amber-900 opacity-70 mb-0.5">
                  Dark button sample
                </p>
                <p className="text-sm font-bold text-amber-900">
                  Transport · Logistiek · Nederland
                </p>
              </div>
            </div>
          </div>

          {/* Global actions */}
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Apply typography settings across the entire site
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={saveFont}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 transition-colors"
              >
                {fontSaved ? "All Saved ✓" : "Save All"}
              </button>
              <button
                onClick={resetFont}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
              >
                Restore Defaults
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
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
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
            minWidth: 60,
            whiteSpace: "nowrap" as const,
          };
          const BTN_RED: React.CSSProperties = { ...BTN, color: "#800000" };
          void BTN_RED;
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "5px 20px",
            fontWeight: "bold",
            fontSize: 12,
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
                  .w98f-typeface { grid-template-columns: repeat(2, 1fr) !important; }
                  .w98f-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>

              {/* ══ Section A — Typeface ══ */}
              <div style={{ ...GRP, marginTop: 8 }}>
                <span style={GRP_LBL}>Typeface</span>
                <p style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>
                  Choose the font family used across the entire site.
                </p>
                <div
                  className="w98f-typeface"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 8,
                  }}
                >
                  {FONT_OPTIONS.map((font) => {
                    const isActive = selectedFont === font.id;
                    return (
                      <button
                        key={font.id}
                        onClick={() => applyFont(font)}
                        style={{
                          fontFamily: F,
                          border: "2px solid",
                          borderColor: isActive
                            ? "#000080 #c0c0c0 #c0c0c0 #000080"
                            : "#fff #808080 #808080 #fff",
                          background: isActive ? "#000080" : "#c0c0c0",
                          color: isActive ? "#fff" : "#000",
                          padding: "8px 6px",
                          cursor: "pointer",
                          textAlign: "left" as const,
                          position: "relative" as const,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: font.family,
                            fontSize: 15,
                            fontWeight: "bold",
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap" as const,
                          }}
                        >
                          {font.label}
                        </div>
                        <div
                          style={{
                            fontFamily: font.family,
                            fontSize: 10,
                            opacity: 0.75,
                          }}
                        >
                          Aa Bb Cc 123
                        </div>
                        {isActive && (
                          <div
                            style={{
                              fontSize: 9,
                              marginTop: 4,
                              fontWeight: "bold",
                              letterSpacing: 1,
                            }}
                          >
                            ✓ ACTIVE
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ══ Section B — Typography Controls + Live Preview ══ */}
              <div
                className="w98f-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {/* Typography Controls */}
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Typography Controls</span>

                  {/* Font Weight */}
                  <div style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontSize: 10, color: "#555" }}>
                        Font Weight
                      </span>
                      <span
                        style={{
                          fontFamily: '"Courier New", monospace',
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {weightLabel[fontWeight] ?? fontWeight}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={900}
                      step={100}
                      value={fontWeight}
                      onChange={(e) => applyFontWeight(e.target.value)}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        accentColor: "#000080",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 9,
                        color: "#808080",
                        fontFamily: '"Courier New", monospace',
                        marginTop: 1,
                      }}
                    >
                      <span>100</span>
                      <span>300</span>
                      <span>400</span>
                      <span>600</span>
                      <span>700</span>
                      <span>900</span>
                    </div>
                  </div>

                  <div style={{ ...HR }} />

                  {/* Letter Spacing */}
                  <div style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontSize: 10, color: "#555" }}>
                        Letter Spacing
                      </span>
                      <span
                        style={{
                          fontFamily: '"Courier New", monospace',
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {letterSpacing}em
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-0.05}
                      max={0.2}
                      step={0.005}
                      value={letterSpacing}
                      onChange={(e) => applyLetterSpacing(e.target.value)}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        accentColor: "#000080",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 9,
                        color: "#808080",
                        fontFamily: '"Courier New", monospace',
                        marginTop: 1,
                      }}
                    >
                      <span>-0.05em</span>
                      <span>0em</span>
                      <span>0.1em</span>
                      <span>0.2em</span>
                    </div>
                  </div>

                  <div style={{ ...HR }} />

                  {/* Line Height */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontSize: 10, color: "#555" }}>
                        Line Height
                      </span>
                      <span
                        style={{
                          fontFamily: '"Courier New", monospace',
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {lineHeight}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1.0}
                      max={2.2}
                      step={0.05}
                      value={lineHeight}
                      onChange={(e) => applyLineHeight(e.target.value)}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        accentColor: "#000080",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 9,
                        color: "#808080",
                        fontFamily: '"Courier New", monospace',
                        marginTop: 1,
                      }}
                    >
                      <span>1.0</span>
                      <span>1.4</span>
                      <span>1.65</span>
                      <span>2.0</span>
                      <span>2.2</span>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Live Preview</span>
                  <div
                    style={{
                      border: "2px solid",
                      borderColor: "#808080 #fff #fff #808080",
                      background: "#fff",
                      padding: 10,
                      fontFamily: activeFontFamily,
                      letterSpacing: `${letterSpacing}em`,
                      lineHeight,
                      fontWeight,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#000",
                        margin: "0 0 6px",
                      }}
                    >
                      Team Cargo — Professioneel Transport
                    </p>
                    <p
                      style={{ fontSize: 12, color: "#333", margin: "0 0 5px" }}
                    >
                      Wij maken onze klanten en die van uw tevreden.
                      Betrouwbaar, snel en professioneel.
                    </p>
                    <p style={{ fontSize: 10, color: "#808080", margin: 0 }}>
                      De beste keuze voor uw logistieke behoeften. Snel, veilig
                      en betrouwbaar transport door heel Nederland.
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      border: "2px solid",
                      borderColor: "#808080 #fff #fff #808080",
                      background: "#000080",
                      color: "#fff",
                      padding: "6px 8px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: activeFontFamily,
                        letterSpacing: `${letterSpacing}em`,
                        lineHeight,
                        fontWeight,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          opacity: 0.7,
                          display: "block",
                          marginBottom: 2,
                          fontFamily: F,
                        }}
                      >
                        Dark background sample
                      </span>
                      <span style={{ fontSize: 13 }}>
                        Transport · Logistiek · Nederland
                      </span>
                    </div>
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
                  Applies all typography settings across the entire site
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={saveFont} style={BTN_LG}>
                    {fontSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={resetFont}
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
