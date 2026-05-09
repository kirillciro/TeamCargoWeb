"use client";

import React from "react";
import { LS_HEADER } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";

export default function HeaderTab() {
  const {
    win98,
    headerTransparent,
    setHeaderTransparent,
    headerSaved,
    setHeaderSaved,
  } = useAdminCustomization();

  return (
    <>
      {!win98 && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Header Transparency
            </p>
            <p className="text-xs text-slate-500">
              Control whether the header fades in from transparent as the user
              scrolls, or always appears solid.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setHeaderTransparent(true)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                  headerTransparent
                    ? "bg-amber-400 text-amber-900 border-amber-400"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500"
                }`}
              >
                Transparent at top
              </button>
              <button
                onClick={() => setHeaderTransparent(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                  !headerTransparent
                    ? "bg-amber-400 text-amber-900 border-amber-400"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500"
                }`}
              >
                Always visible (solid)
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {headerTransparent
                ? "Header starts transparent and fades in as you scroll down."
                : "Header is always solid — no fade effect."}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Apply header display settings across the entire site
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  localStorage.setItem(
                    LS_HEADER,
                    JSON.stringify({ transparent: headerTransparent }),
                  );
                  window.dispatchEvent(new Event("tc-header-settings-changed"));
                  setHeaderSaved(true);
                  setTimeout(() => setHeaderSaved(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 transition-colors"
              >
                {headerSaved ? "All Saved ✓" : "Save All"}
              </button>
              <button
                onClick={() => {
                  setHeaderTransparent(true);
                  localStorage.removeItem(LS_HEADER);
                  window.dispatchEvent(new Event("tc-header-settings-changed"));
                }}
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
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          const RADIO: React.CSSProperties = {
            accentColor: "#000080",
            marginRight: 4,
            cursor: "pointer",
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
              <div style={{ ...GRP, marginTop: 8 }}>
                <span style={GRP_LBL}>Header Transparency</span>
                <p
                  style={{
                    fontFamily: F,
                    fontSize: 11,
                    color: "#000",
                    marginBottom: 10,
                  }}
                >
                  Control whether the header fades in from transparent on
                  scroll, or stays solid.
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      fontFamily: F,
                      fontSize: 11,
                    }}
                  >
                    <input
                      type="radio"
                      name="headerMode"
                      checked={headerTransparent}
                      onChange={() => setHeaderTransparent(true)}
                      style={RADIO}
                    />
                    Transparent at top (fades in on scroll)
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      fontFamily: F,
                      fontSize: 11,
                    }}
                  >
                    <input
                      type="radio"
                      name="headerMode"
                      checked={!headerTransparent}
                      onChange={() => setHeaderTransparent(false)}
                      style={RADIO}
                    />
                    Always visible (solid)
                  </label>
                </div>
              </div>
              <div
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap" as const,
                  marginTop: 14,
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Apply header display settings across the entire site
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        LS_HEADER,
                        JSON.stringify({ transparent: headerTransparent }),
                      );
                      window.dispatchEvent(
                        new Event("tc-header-settings-changed"),
                      );
                      setHeaderSaved(true);
                      setTimeout(() => setHeaderSaved(false), 2000);
                    }}
                    style={BTN_LG}
                  >
                    {headerSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => {
                      setHeaderTransparent(true);
                      localStorage.removeItem(LS_HEADER);
                      window.dispatchEvent(
                        new Event("tc-header-settings-changed"),
                      );
                    }}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
}
