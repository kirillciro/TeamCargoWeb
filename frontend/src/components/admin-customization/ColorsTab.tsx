"use client";

import React from "react";
import { Check, Save, RotateCcw } from "lucide-react";
import { useAdminCustomization } from "./AdminCustomizationContext";

export default function ColorsTab() {
  const {
    win98,
    colors,
    colorSaved,
    colorFields,
    applyColor,
    saveColors,
    resetColors,
  } = useAdminCustomization();

  return (
    <>
      {!win98 && (
        <div className="space-y-4">
          {/* ── Card 1: Button Colors ── */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Button Colors
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {colorFields
                .filter(
                  (f) =>
                    f.key === "brandGreen" ||
                    f.key === "brandMid" ||
                    f.key === "brandBtnText",
                )
                .map(({ key, label, default: defaultHex }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="relative w-9 h-9 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
                        style={{ backgroundColor: colors[key] }}
                      >
                        <input
                          type="color"
                          value={colors[key]}
                          onChange={(e) => applyColor(key, e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={colors[key]}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^#[0-9a-fA-F]{0,6}$/.test(v))
                            applyColor(key, v);
                        }}
                        placeholder={defaultHex}
                        maxLength={7}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div
                className="px-5 py-2 text-sm font-bold rounded"
                style={{
                  backgroundColor: colors.brandGreen,
                  color: colors.brandBtnText,
                }}
              >
                Default
              </div>
              <div
                className="px-5 py-2 text-sm font-bold rounded"
                style={{
                  backgroundColor: colors.brandMid,
                  color: colors.brandBtnText,
                }}
              >
                Hover
              </div>
            </div>
          </div>
          {/* ── Card 2: Header & Footer ── */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Header &amp; Footer Background
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {(["headerBg", "footerBg"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {key === "headerBg" ? "Header" : "Footer"}
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className="relative w-9 h-9 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
                      style={{ backgroundColor: colors[key] }}
                    >
                      <input
                        type="color"
                        value={colors[key]}
                        onChange={(e) => applyColor(key, e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={colors[key]}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v))
                          applyColor(key, v);
                      }}
                      placeholder="#040f08"
                      maxLength={7}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div
                    className="h-7 border border-slate-700"
                    style={{ backgroundColor: colors[key] }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* ── Card 3: Save ── */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-300">
                Save all changes
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Applies all color &amp; background overrides site-wide
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={saveColors}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-300 transition-colors"
              >
                {colorSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {colorSaved ? "All saved!" : "Save all"}
              </button>
              <button
                onClick={resetColors}
                className="inline-flex items-center gap-2 rounded-lg border border-red-700/60 px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:border-red-500 transition-colors"
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
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          const FIELD_LBL: React.CSSProperties = {
            fontSize: 11,
            color: "#000",
            fontFamily: F,
            marginBottom: 2,
            display: "block",
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
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 18px",
            cursor: "pointer",
            minWidth: 88,
          };
          const BTN_RED: React.CSSProperties = { ...BTN, color: "#cc0000" };
          void BTN_RED;
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          const PREVIEW_BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "default",
          };
          const btnFields = colorFields.filter(
            (f) =>
              f.key === "brandGreen" ||
              f.key === "brandMid" ||
              f.key === "brandBtnText",
          );

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
              }}
            >
              {/* ── Row 1: two group boxes side by side ── */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  alignItems: "stretch",
                  marginTop: 8,
                }}
              >
                {/* ── Group: Button Colors ── */}
                <div style={{ ...GRP, flex: "1 1 200px" }}>
                  <span style={GRP_LBL}>Button Colors</span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, auto)",
                      gap: "6px 10px",
                    }}
                  >
                    {btnFields.map(({ key, label }) => (
                      <div key={key}>
                        <span style={FIELD_LBL}>{label}</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{ ...SWATCH, backgroundColor: colors[key] }}
                          >
                            <input
                              type="color"
                              value={colors[key]}
                              onChange={(e) => applyColor(key, e.target.value)}
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
                            value={colors[key]}
                            maxLength={7}
                            style={HEX}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (/^#[0-9a-fA-F]{0,6}$/.test(v))
                                applyColor(key, v);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={HR} />
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{ fontSize: 11, color: "#555", marginRight: 2 }}
                    >
                      Preview:
                    </span>
                    <button
                      style={{
                        ...PREVIEW_BTN,
                        backgroundColor: colors.brandGreen,
                        color: colors.brandBtnText,
                      }}
                    >
                      Default
                    </button>
                    <button
                      style={{
                        ...PREVIEW_BTN,
                        backgroundColor: colors.brandMid,
                        color: colors.brandBtnText,
                      }}
                    >
                      Hover
                    </button>
                  </div>
                </div>

                {/* ── Group: Page Structure ── */}
                <div style={{ ...GRP, flex: "1 1 200px" }}>
                  <span style={GRP_LBL}>Page Structure</span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, auto)",
                      gap: "6px 10px",
                    }}
                  >
                    {(["headerBg", "footerBg"] as const).map((key) => (
                      <div key={key}>
                        <span style={FIELD_LBL}>
                          {key === "headerBg" ? "Header" : "Footer"}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{ ...SWATCH, backgroundColor: colors[key] }}
                          >
                            <input
                              type="color"
                              value={colors[key]}
                              onChange={(e) => applyColor(key, e.target.value)}
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
                            value={colors[key]}
                            maxLength={7}
                            style={HEX}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (/^#[0-9a-fA-F]{0,6}$/.test(v))
                                applyColor(key, v);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={HR} />
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{ fontSize: 11, color: "#555", marginRight: 2 }}
                    >
                      Preview:
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      {(["headerBg", "footerBg"] as const).map((key) => (
                        <div
                          key={key}
                          style={{
                            background: colors[key],
                            width: 100,
                            border: "1px solid #808080",
                            padding: "2px 6px",
                            fontSize: 9,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span style={{ opacity: 0.55, fontSize: 8 }}>
                            ■■■
                          </span>
                          <span>
                            {key === "headerBg" ? "Header" : "Footer"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ══ Bottom bar — Global Actions ══ */}
              <div
                style={{
                  ...GRP,
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  {colorSaved
                    ? "✓  All changes saved."
                    : "Changes are applied live instantly."}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={saveColors} style={BTN_LG}>
                    {colorSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={resetColors}
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
