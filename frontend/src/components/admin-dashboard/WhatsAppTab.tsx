"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/auth-client";
import { W98_RAISED, W98_SUNKEN } from "./Win98Helpers";

const PHONE_RE = /^\+[1-9]\d{6,14}$/;

type WaStatus = {
  status: "open" | "connecting" | "close";
  hasQr: boolean;
  senderPhone: string | null;
};

type WaMessage = {
  id: number;
  extraction_id: number | null;
  subject: string;
  message_text: string;
  recipients: string[];
  sent_by: string | null;
  sent_at: string;
};

export default function WhatsAppTab({ win98 = false }: { win98?: boolean }) {
  const [waStatus, setWaStatus] = useState<WaStatus | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const [recipients, setRecipients] = useState<string[]>([]);
  const [newNumber, setNewNumber] = useState("");
  const [numberError, setNumberError] = useState<string | null>(null);
  const [addingNumber, setAddingNumber] = useState(false);

  const [messages, setMessages] = useState<WaMessage[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetchWithAuth("/api/admin/whatsapp/status");
      if (!res.ok) throw new Error("Failed to fetch WhatsApp status");
      const data = (await res.json()) as WaStatus;
      setWaStatus(data);
      setError(null);
      if (data.hasQr) {
        const qrRes = await fetchWithAuth("/api/admin/whatsapp/qr");
        if (qrRes.ok) {
          const qrData = (await qrRes.json()) as { qr: string };
          setQrDataUrl(qrData.qr);
        }
      } else {
        setQrDataUrl(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection error");
    }
  }, []);

  const fetchRecipients = useCallback(async () => {
    const res = await fetchWithAuth("/api/admin/whatsapp/recipients");
    if (res.ok) {
      const data = (await res.json()) as { numbers: string[] };
      setRecipients(data.numbers ?? []);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    const res = await fetchWithAuth("/api/admin/whatsapp/messages");
    if (res.ok) {
      const data = (await res.json()) as { messages: WaMessage[] };
      setMessages(data.messages ?? []);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
    void fetchRecipients();
    void fetchMessages();
    pollRef.current = setInterval(() => void fetchStatus(), 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchStatus, fetchRecipients, fetchMessages]);

  const handleDisconnect = async () => {
    if (!confirm("Disconnect current WhatsApp account? You'll need to scan a QR code with the new phone.")) return;
    setDisconnecting(true);
    try {
      await fetchWithAuth("/api/admin/whatsapp/disconnect", { method: "POST" });
      await fetchStatus();
    } finally {
      setDisconnecting(false);
    }
  };

  const handleAddRecipient = async () => {
    const num = newNumber.trim();
    setNumberError(null);
    if (!PHONE_RE.test(num)) {
      setNumberError("Enter a valid number with country code, e.g. +393497080551");
      return;
    }
    setAddingNumber(true);
    try {
      const res = await fetchWithAuth("/api/admin/whatsapp/recipients", {
        method: "POST",
        body: JSON.stringify({ number: num }),
      });
      const data = (await res.json()) as { numbers?: string[]; message?: string };
      if (!res.ok) { setNumberError(data.message ?? "Failed to add number"); return; }
      setRecipients(data.numbers ?? []);
      setNewNumber("");
    } finally {
      setAddingNumber(false);
    }
  };

  const handleRemoveRecipient = async (number: string) => {
    const res = await fetchWithAuth(
      `/api/admin/whatsapp/recipients/${encodeURIComponent(number)}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      const data = (await res.json()) as { numbers: string[] };
      setRecipients(data.numbers);
    }
  };

  const toggleExpand = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  // ── Win98 theme ────────────────────────────────────────────────────────
  if (win98) {
    return (
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, maxWidth: 520 }}>

        {/* Connection panel */}
        <div style={{ ...W98_RAISED, padding: 16, background: "#c0c0c0", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#000080", color: "#fff", padding: "3px 8px", fontSize: 12, fontWeight: "bold" }}>
            Connection (Sender)
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>Status:</span>
            <span style={{ fontSize: 12, fontWeight: "bold", color: waStatus?.status === "open" ? "#008000" : waStatus?.status === "connecting" ? "#808000" : "#800000" }}>
              {waStatus?.status === "open" ? "● Connected" : waStatus?.status === "connecting" ? "○ Connecting..." : "○ Disconnected"}
            </span>
            <button onClick={() => void fetchStatus()} style={{ marginLeft: "auto", padding: "1px 8px", fontSize: 11, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0" }}>
              Refresh
            </button>
          </div>

          {waStatus?.status === "open" && waStatus.senderPhone && (
            <div style={{ fontSize: 12 }}>Sending from: <strong>{waStatus.senderPhone}</strong></div>
          )}

          {error && (
            <div style={{ ...W98_SUNKEN, padding: "4px 8px", fontSize: 11, color: "#800000" }}>{error}</div>
          )}

          {qrDataUrl && waStatus?.status !== "open" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 11, color: "#000080" }}>Scan with WhatsApp → Linked Devices → Link a Device:</div>
              <div style={{ ...W98_SUNKEN, padding: 8, background: "#fff", width: "100%", maxWidth: 400 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="WhatsApp QR Code" style={{ display: "block", width: "100%", height: "auto", aspectRatio: "1 / 1" }} />
              </div>
              <div style={{ fontSize: 10, color: "#555" }}>QR refreshes automatically every few seconds.</div>
            </div>
          )}

          {waStatus?.status === "open" && (
            <>
              <div style={{ ...W98_SUNKEN, padding: "5px 8px", fontSize: 12, color: "#008000", background: "#fff" }}>
                ✓ Connected. Cargo notifications will be sent from {waStatus.senderPhone ?? "this account"}.
              </div>
              <button
                onClick={() => void handleDisconnect()}
                disabled={disconnecting}
                style={{ alignSelf: "flex-start", padding: "2px 10px", fontSize: 11, ...W98_RAISED, cursor: disconnecting ? "wait" : "pointer", background: "#c0c0c0" }}
              >
                {disconnecting ? "Disconnecting..." : "Change sender number..."}
              </button>
            </>
          )}

          {waStatus?.status === "connecting" && !qrDataUrl && (
            <div style={{ fontSize: 12, color: "#808000" }}>Initialising, please wait...</div>
          )}
        </div>

        {/* Recipients panel */}
        <div style={{ ...W98_RAISED, padding: 16, background: "#c0c0c0", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#000080", color: "#fff", padding: "3px 8px", fontSize: 12, fontWeight: "bold" }}>
            Recipients
          </div>
          <div style={{ fontSize: 11, color: "#444" }}>Cargo messages are sent to all numbers below.</div>

          {recipients.length === 0 ? (
            <div style={{ fontSize: 11, color: "#808080" }}>No recipients added yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {recipients.map((num) => (
                <div key={num} style={{ display: "flex", alignItems: "center", gap: 6, ...W98_SUNKEN, padding: "3px 8px", background: "#fff" }}>
                  <span style={{ fontSize: 12, fontFamily: "monospace", flex: 1 }}>{num}</span>
                  <button
                    onClick={() => void handleRemoveRecipient(num)}
                    style={{ padding: "1px 6px", fontSize: 11, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0", color: "#800000" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 6, alignItems: "flex-start", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                type="tel"
                value={newNumber}
                onChange={(e) => { setNewNumber(e.target.value); setNumberError(null); }}
                onKeyDown={(e) => e.key === "Enter" && void handleAddRecipient()}
                placeholder="+393497080551"
                style={{ ...W98_SUNKEN, padding: "2px 6px", fontSize: 12, fontFamily: "monospace", width: 180 }}
              />
              <button
                onClick={() => void handleAddRecipient()}
                disabled={addingNumber}
                style={{ padding: "2px 10px", fontSize: 12, ...W98_RAISED, cursor: addingNumber ? "wait" : "pointer", background: "#c0c0c0" }}
              >
                {addingNumber ? "Adding..." : "Add"}
              </button>
            </div>
            {numberError && (
              <div style={{ fontSize: 11, color: "#800000" }}>{numberError}</div>
            )}
          </div>
        </div>

        {/* Win98 Message History panel */}
        <div style={{ ...W98_RAISED, padding: 16, background: "#c0c0c0", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ background: "#000080", color: "#fff", padding: "3px 8px", fontSize: 12, fontWeight: "bold" }}>
              Message Log ({messages.length})
            </div>
            <button onClick={() => void fetchMessages()} style={{ padding: "1px 8px", fontSize: 11, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0" }}>
              Refresh
            </button>
          </div>
          {messages.length === 0 ? (
            <div style={{ fontSize: 11, color: "#808080" }}>No messages sent yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 340, overflowY: "auto" }}>
              {messages.map((msg) => {
                const open = expandedIds.has(msg.id);
                return (
                  <div key={msg.id} style={{ ...W98_SUNKEN, background: "#fff", padding: "4px 8px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", userSelect: "none" }}
                      onClick={() => toggleExpand(msg.id)}
                    >
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#555", whiteSpace: "nowrap" }}>{fmtDate(msg.sent_at)}</span>
                      <span style={{ fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.subject || "(no subject)"}</span>
                      <span style={{ fontSize: 10, color: "#0000aa" }}>{open ? "▲" : "▼"}</span>
                    </div>
                    {open && (
                      <div style={{ marginTop: 6, borderTop: "1px solid #ccc", paddingTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ fontSize: 10, color: "#555" }}>To: {(msg.recipients as string[]).join(", ")}</div>
                        {msg.sent_by && <div style={{ fontSize: 10, color: "#555" }}>By: {msg.sent_by}</div>}
                        <pre style={{ margin: 0, fontSize: 10, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "monospace", color: "#222" }}>{msg.message_text}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Modern theme ───────────────────────────────────────────────────────
  return (
    <div className="max-w-[83.6352rem] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">

        {/* ── Left column: Connection + Recipients ── */}
        <div className="w-full lg:w-100 shrink-0 flex flex-col gap-4">

        {/* ── Connection card (Sender) ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-base">Connection</h2>
              <p className="text-slate-400 text-xs mt-0.5">Linked sender phone</p>
            </div>
            <button
              onClick={() => void fetchStatus()}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {/* Status badge */}
          {waStatus ? (
            <div className="flex items-center gap-2">
              {waStatus.status === "open" ? (
                <><Wifi className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium text-emerald-400">Connected</span></>
              ) : waStatus.status === "connecting" ? (
                <><Loader2 className="w-4 h-4 text-amber-400 animate-spin" /><span className="text-sm text-amber-400">Connecting…</span></>
              ) : (
                <><WifiOff className="w-4 h-4 text-red-400" /><span className="text-sm text-red-400">Disconnected</span></>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              <span className="text-sm text-slate-400">Loading…</span>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>
          )}

          {/* Sender phone + disconnect */}
          {waStatus?.status === "open" && (
            <div className="flex flex-col gap-3">
              {waStatus.senderPhone && (
                <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-400">Sending from</span>
                  <span className="text-sm font-mono font-medium text-white">{waStatus.senderPhone}</span>
                </div>
              )}
              <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">
                <Wifi className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-300">
                  WhatsApp is connected. Use the <span className="font-medium">Send WhatsApp</span> button on any cargo extraction.
                </p>
              </div>
              <button
                onClick={() => void handleDisconnect()}
                disabled={disconnecting}
                className="self-start flex items-center gap-2 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {disconnecting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Change sender number…
              </button>
            </div>
          )}

          {/* QR code */}
          {qrDataUrl && waStatus?.status !== "open" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-300">
                Open WhatsApp on your phone →{" "}
                <span className="text-slate-400">⋮ / Settings → Linked Devices → Link a Device</span>
              </p>
              <div className="bg-white rounded-2xl p-3 sm:p-4 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="WhatsApp QR Code" className="block w-full h-auto max-w-85 sm:max-w-none mx-auto" style={{ aspectRatio: "1 / 1" }} />
              </div>
              <p className="text-xs text-slate-500">QR refreshes automatically. Scan quickly — it expires every ~20 s.</p>
            </div>
          )}

          {waStatus?.status === "connecting" && !qrDataUrl && (
            <p className="text-sm text-slate-400">Initialising connection… QR code will appear shortly.</p>
          )}
        </div>

        {/* ── Recipients card ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 flex flex-col gap-5">
          <div>
            <h2 className="text-white font-semibold text-base">Recipients</h2>
            <p className="text-slate-400 text-xs mt-0.5">Cargo notifications are sent to all numbers below</p>
          </div>

          {recipients.length === 0 ? (
            <p className="text-sm text-slate-500">No recipients added yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {recipients.map((num) => (
                <li key={num} className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
                  <span className="text-sm font-mono text-slate-200">{num}</span>
                  <button
                    onClick={() => void handleRemoveRecipient(num)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-0.5 rounded"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="tel"
                value={newNumber}
                onChange={(e) => { setNewNumber(e.target.value); setNumberError(null); }}
                onKeyDown={(e) => e.key === "Enter" && void handleAddRecipient()}
                placeholder="+393497080551"
                className="flex-1 bg-slate-800 border border-slate-700 focus:border-amber-400/60 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder:text-slate-600 outline-none transition-colors"
              />
              <button
                onClick={() => void handleAddRecipient()}
                disabled={addingNumber}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-400 transition-colors disabled:opacity-50"
              >
                {addingNumber ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add
              </button>
            </div>
            {numberError && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {numberError}
              </p>
            )}
            <p className="text-xs text-slate-600">Include country code, e.g. +393497080551 or +31644351451</p>
          </div>
        </div>
        </div>{/* end left column */}

        {/* ── Right column: Message Log ── */}
        <div className="w-full lg:flex-1 flex flex-col">

        {/* ── Message History card ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 flex flex-col gap-5 h-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-base">Message Log</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {messages.length === 0 ? "No messages sent yet" : `${messages.length} message${messages.length !== 1 ? "s" : ""} sent`}
              </p>
            </div>
            <button
              onClick={() => void fetchMessages()}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-slate-600">
              <MessageSquare className="w-8 h-8 opacity-30" />
              <p className="text-sm">Messages will appear here after sending.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2 overflow-y-auto max-h-150 lg:max-h-[calc(100vh-12rem)]">
              {messages.map((msg) => {
                const open = expandedIds.has(msg.id);
                return (
                  <li key={msg.id} className="bg-slate-800/60 border border-slate-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleExpand(msg.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-700/40 transition-colors"
                    >
                      {open
                        ? <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      }
                      <span className="text-xs font-mono text-slate-400 shrink-0">{fmtDate(msg.sent_at)}</span>
                      <span className="text-sm text-slate-200 truncate flex-1">{msg.subject || "(no subject)"}</span>
                      <span className="text-xs text-slate-500 shrink-0">{(msg.recipients as string[]).length} recipient{(msg.recipients as string[]).length !== 1 ? "s" : ""}</span>
                    </button>
                    {open && (
                      <div className="border-t border-slate-700 px-4 py-3 flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {(msg.recipients as string[]).map((r) => (
                            <span key={r} className="text-xs font-mono bg-slate-700 text-slate-300 rounded px-2 py-0.5">{r}</span>
                          ))}
                        </div>
                        {msg.sent_by && (
                          <p className="text-xs text-slate-500">Sent by {msg.sent_by}</p>
                        )}
                        <pre className="mt-1 text-xs text-slate-300 whitespace-pre-wrap wrap-break-word font-mono bg-slate-900/60 rounded-lg px-3 py-2 max-h-64 overflow-y-auto">{msg.message_text}</pre>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        </div>{/* end right column */}

      </div>
    </div>
  );
}
