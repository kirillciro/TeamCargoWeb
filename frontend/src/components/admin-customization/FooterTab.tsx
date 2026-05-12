"use client";

import React from "react";
import { Loader2, Check, Save } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth-client";
import { useAdminCustomization } from "./AdminCustomizationContext";

export default function FooterTab() {
  const {
    win98,
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
  } = useAdminCustomization();

  const buildSource = () => ({
    tagline_sub: footerTaglineSub,
    address_line1: footerAddressLine1,
    address_line2: footerAddressLine2,
    phone: footerPhone,
    email: footerEmail,
  });

  const handleFooterSave = () => {
    const source = buildSource();
    localStorage.setItem("tc_footer_overrides", JSON.stringify(source));
    setFooterSaving(true);
    setFooterSaveError(null);
    void fetchWithAuth("/api/admin/customization/footer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
    })
      .then((r) => r.json() as Promise<{ ok?: boolean; message?: string }>)
      .then((body) => {
        if (!body.ok) throw new Error(body.message ?? "Save failed");
        window.dispatchEvent(new Event("tc:footer-updated"));
        setFooterSectionSaved(true);
        setTimeout(() => setFooterSectionSaved(false), 2500);
      })
      .catch((err: unknown) =>
        setFooterSaveError(err instanceof Error ? err.message : "Save failed"),
      )
      .finally(() => setFooterSaving(false));
  };

  const handleFooterReset = () => {
    setFooterTaglineSub("");
    setFooterAddressLine1("");
    setFooterAddressLine2("");
    setFooterPhone("");
    setFooterEmail("");
    localStorage.removeItem("tc_footer_overrides");
    void fetchWithAuth("/api/admin/customization/footer", {
      method: "DELETE",
    })
      .then(() => window.dispatchEvent(new Event("tc:footer-updated")))
      .catch((err: unknown) =>
        setFooterSaveError(err instanceof Error ? err.message : "Reset failed"),
      );
  };

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
            boxSizing: "border-box" as const,
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
          const LBL: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            color: "#000",
            display: "block",
            marginBottom: 2,
          };

          const saveFooter = () => {
            const source = buildSource();
            localStorage.setItem("tc_footer_overrides", JSON.stringify(source));
            setFooterSaving(true);
            setFooterSaveError(null);
            fetchWithAuth("/api/admin/customization/footer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ source }),
            })
              .then(
                (r) => r.json() as Promise<{ ok?: boolean; message?: string }>,
              )
              .then((body) => {
                if (!body.ok) throw new Error(body.message ?? "Save failed");
                window.dispatchEvent(new Event("tc:footer-updated"));
                setFooterSectionSaved(true);
                setTimeout(() => setFooterSectionSaved(false), 2500);
              })
              .catch((err: unknown) =>
                setFooterSaveError(
                  err instanceof Error ? err.message : "Save failed",
                ),
              )
              .finally(() => setFooterSaving(false));
          };

          const resetFooter = () => {
            setFooterTaglineSub("");
            setFooterAddressLine1("");
            setFooterAddressLine2("");
            setFooterPhone("");
            setFooterEmail("");
            localStorage.removeItem("tc_footer_overrides");
            fetchWithAuth("/api/admin/customization/footer", {
              method: "DELETE",
            })
              .then(() => window.dispatchEvent(new Event("tc:footer-updated")))
              .catch((err: unknown) =>
                setFooterSaveError(
                  err instanceof Error ? err.message : "Reset failed",
                ),
              );
          };

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <style>{`
                @media (max-width: 600px) {
                  .w98f-cols { grid-template-columns: 1fr !important; }
                  .w98f-global { flex-direction: column !important; align-items: flex-start !important; }
                }
              `}</style>

              {footerSaveError && (
                <div
                  style={{
                    background: "#fff0f0",
                    border: "2px solid #cc0000",
                    padding: "4px 8px",
                    fontSize: 11,
                    color: "#cc0000",
                  }}
                >
                  {footerSaveError}
                </div>
              )}

              {/* ── Tagline ── */}
              <div style={GRP}>
                <span style={GRP_LBL}>Tagline</span>
                <span style={LBL}>Description line shown in the footer</span>
                <input
                  type="text"
                  value={footerTaglineSub}
                  onChange={(e) => setFooterTaglineSub(e.target.value)}
                  placeholder="Driver recruitment — Amsterdam"
                  style={{ ...INPUT, width: 320 }}
                />
              </div>

              {/* ── Contact Info ── */}
              <div style={GRP}>
                <span style={GRP_LBL}>Contact Info</span>
                <span
                  style={{
                    fontFamily: F,
                    fontSize: 11,
                    color: "#808080",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Used directly — not translated.
                </span>
                <div
                  className="w98f-cols"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 24px",
                    alignItems: "end",
                  }}
                >
                  <div>
                    <span style={LBL}>Address line 1</span>
                    <input
                      type="text"
                      value={footerAddressLine1}
                      onChange={(e) => setFooterAddressLine1(e.target.value)}
                      placeholder="Poortland 146, 1046 BD Amsterdam"
                      style={{ ...INPUT, width: "100%" }}
                    />
                  </div>
                  <div>
                    <span style={LBL}>Phone (WhatsApp)</span>
                    <input
                      type="text"
                      value={footerPhone}
                      onChange={(e) => setFooterPhone(e.target.value)}
                      placeholder="+31 6 85352412"
                      style={{ ...INPUT, width: "100%" }}
                    />
                  </div>
                  <div>
                    <span style={LBL}>Country</span>
                    <input
                      type="text"
                      value={footerAddressLine2}
                      onChange={(e) => setFooterAddressLine2(e.target.value)}
                      placeholder="Netherlands"
                      style={{ ...INPUT, width: "100%" }}
                    />
                  </div>
                  <div>
                    <span style={LBL}>Email address</span>
                    <input
                      type="email"
                      value={footerEmail}
                      onChange={(e) => setFooterEmail(e.target.value)}
                      placeholder="info@teamcargo.nl"
                      style={{ ...INPUT, width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Global Actions ── */}
              <div
                className="w98f-global"
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap" as const,
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all footer changes
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={saveFooter}
                    disabled={footerSaving}
                    style={BTN_LG}
                  >
                    {footerSectionSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={resetFooter}
                    disabled={footerSaving}
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
          {footerSaveError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {footerSaveError}
            </p>
          )}

          {/* Tagline */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Tagline
            </p>
            <input
              type="text"
              value={footerTaglineSub}
              onChange={(e) => setFooterTaglineSub(e.target.value)}
              placeholder="Your tagline here"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
          </div>

          {/* Contact Info */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Contact Info
            </p>
            <p className="text-xs text-slate-500">
              These values are not auto-translated.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Address line 1</p>
                <input
                  type="text"
                  value={footerAddressLine1}
                  onChange={(e) => setFooterAddressLine1(e.target.value)}
                  placeholder="Streetname 1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Phone</p>
                <input
                  type="text"
                  value={footerPhone}
                  onChange={(e) => setFooterPhone(e.target.value)}
                  placeholder="+31 6 00000000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">
                  Address line 2 (Country)
                </p>
                <input
                  type="text"
                  value={footerAddressLine2}
                  onChange={(e) => setFooterAddressLine2(e.target.value)}
                  placeholder="Netherlands"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Email</p>
                <input
                  type="text"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="info@teamcargo.nl"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Global Actions */}
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">Save all changes</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleFooterSave}
                disabled={footerSaving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {footerSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : footerSectionSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {footerSectionSaved ? "Saved ✓" : "Save All"}
              </button>
              <button
                onClick={handleFooterReset}
                disabled={footerSaving}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-60 transition-colors"
              >
                Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
