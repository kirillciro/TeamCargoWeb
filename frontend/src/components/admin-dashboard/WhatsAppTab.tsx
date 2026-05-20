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
  Trash2,
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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [deletingAll, setDeletingAll] = useState(false);

  // Filter state
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterDay, setFilterDay] = useState<string>("");

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const showConfirm = (message: string, onConfirm: () => void) =>
    setConfirmModal({ message, onConfirm });
  const closeConfirm = () => setConfirmModal(null);

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

  const fetchMessages = useCallback(async (year = filterYear, month = filterMonth, day = filterDay) => {
    const params = new URLSearchParams();
    if (year)  params.set("year",  year);
    if (month) params.set("month", month);
    if (day)   params.set("day",   day);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await fetchWithAuth(`/api/admin/whatsapp/messages${qs}`);
    if (res.ok) {
      const data = (await res.json()) as { messages: WaMessage[] };
      setMessages(data.messages ?? []);
      setSelectedIds(new Set());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDisconnect = () =>
    showConfirm(
      "Disconnect current WhatsApp account? You'll need to scan a QR code with the new phone.",
      async () => {
        setDisconnecting(true);
        try {
          await fetchWithAuth("/api/admin/whatsapp/disconnect", { method: "POST" });
          await fetchStatus();
        } finally {
          setDisconnecting(false);
        }
      },
    );

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

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = () =>
    setSelectedIds((prev) =>
      prev.size === messages.length
        ? new Set()
        : new Set(messages.map((m) => m.id)),
    );

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    showConfirm(
      `Delete ${selectedIds.size} selected message${selectedIds.size !== 1 ? "s" : ""}?`,
      async () => {
        setDeletingIds(new Set(selectedIds));
        await fetchWithAuth("/api/admin/whatsapp/messages", {
          method: "DELETE",
          body: JSON.stringify({ ids: [...selectedIds] }),
        });
        setDeletingIds(new Set());
        await fetchMessages(filterYear, filterMonth, filterDay);
      },
    );
  };

  const handleDeleteAll = () =>
    showConfirm(
      "Delete ALL WhatsApp message logs? This cannot be undone.",
      async () => {
        setDeletingAll(true);
        await fetchWithAuth("/api/admin/whatsapp/messages", {
          method: "DELETE",
          body: JSON.stringify({}),
        });
        setDeletingAll(false);
        await fetchMessages(filterYear, filterMonth, filterDay);
      },
    );

  const applyFilter = () => void fetchMessages(filterYear, filterMonth, filterDay);
  const clearFilter = () => {
    setFilterYear(""); setFilterMonth(""); setFilterDay("");
    void fetchMessages("", "", "");
  };

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
      <div style={{ padding: 16, display: "flex", flexDirection: "row", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── Left column: Connection + Recipients ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340, minWidth: 280, flexShrink: 0 }}>

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
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 12, color: "#808000" }}>Initialising, please wait...</div>
              <button
                onClick={() =>
                  showConfirm(
                    "Clear the current session and force a fresh QR code scan?",
                    async () => {
                      await fetchWithAuth("/api/admin/whatsapp/disconnect", { method: "POST" });
                      await fetchStatus();
                    },
                  )
                }
                style={{ alignSelf: "flex-start", padding: "2px 10px", fontSize: 11, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0", color: "#000080" }}
              >
                Force new QR code...
              </button>
            </div>
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

        </div>{/* end left column */}

        {/* ── Right column: Message Log ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 280 }}>

        {/* Win98 Message History panel */}
        <div style={{ ...W98_RAISED, padding: 16, background: "#c0c0c0", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Title bar + action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <div style={{ background: "#000080", color: "#fff", padding: "3px 8px", fontSize: 12, fontWeight: "bold", flex: 1, minWidth: 120 }}>
              Message Log ({messages.length}{(filterYear || filterMonth || filterDay) ? ", filtered" : ""})
            </div>
            {selectedIds.size > 0 && (
              <button
                onClick={() => void handleDeleteSelected()}
                style={{ padding: "1px 8px", fontSize: 11, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0", color: "#800000", fontWeight: "bold" }}
              >
                Delete {selectedIds.size}
              </button>
            )}
            <button
              onClick={() => void handleDeleteAll()}
              disabled={deletingAll || messages.length === 0}
              style={{ padding: "1px 8px", fontSize: 11, ...W98_RAISED, cursor: deletingAll || messages.length === 0 ? "default" : "pointer", background: "#c0c0c0", color: "#800000", fontWeight: "bold", opacity: messages.length === 0 ? 0.5 : 1 }}
            >
              {deletingAll ? "Deleting..." : "Delete All"}
            </button>
            <button
              onClick={() => void fetchMessages(filterYear, filterMonth, filterDay)}
              style={{ padding: "1px 8px", fontSize: 11, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0" }}
            >
              Refresh
            </button>
          </div>

          {/* Filter row */}
          <div style={{ ...W98_SUNKEN, background: "#fff", padding: "6px 8px", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, whiteSpace: "nowrap" }}>Filter:</span>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              placeholder="Year"
              min={2020}
              style={{ fontSize: 11, padding: "1px 4px", ...W98_SUNKEN, background: "#fff", width: 60 }}
            />
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{ fontSize: 11, padding: "1px 2px", ...W98_SUNKEN, background: "#fff" }}
            >
              <option value="">All months</option>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                <option key={i} value={String(i + 1)}>{m}</option>
              ))}
            </select>
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              style={{ fontSize: 11, padding: "1px 2px", ...W98_SUNKEN, background: "#fff" }}
            >
              <option value="">All days</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={String(d)}>{d}</option>
              ))}
            </select>
            <button
              onClick={applyFilter}
              style={{ padding: "1px 8px", fontSize: 11, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0" }}
            >
              Apply
            </button>
            {(filterYear || filterMonth || filterDay) && (
              <button
                onClick={clearFilter}
                style={{ padding: "1px 6px", fontSize: 11, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0" }}
              >
                Clear
              </button>
            )}
          </div>

          {messages.length === 0 ? (
            <div style={{ fontSize: 11, color: "#808080" }}>
              {(filterYear || filterMonth || filterDay) ? "No messages match the filter." : "No messages sent yet."}
            </div>
          ) : (
            <>
              {/* Select all row */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={selectedIds.size === messages.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ fontSize: 11, color: "#444" }}>Select all</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 380, overflowY: "auto" }}>
                {messages.map((msg) => {
                  const open = expandedIds.has(msg.id);
                  const selected = selectedIds.has(msg.id);
                  const deleting = deletingIds.has(msg.id);
                  return (
                    <div
                      key={msg.id}
                      style={{ ...W98_SUNKEN, background: selected ? "#fffbe6" : "#fff", padding: "4px 8px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelect(msg.id)}
                          style={{ cursor: "pointer", flexShrink: 0 }}
                        />
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, cursor: "pointer", userSelect: "none", overflow: "hidden" }}
                          onClick={() => toggleExpand(msg.id)}
                        >
                          <span style={{ fontSize: 10, color: "#0000aa", flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
                          <span style={{ fontSize: 11, fontFamily: "monospace", color: "#555", whiteSpace: "nowrap", flexShrink: 0 }}>{fmtDate(msg.sent_at)}</span>
                          <span style={{ fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.subject || "(no subject)"}</span>
                          <span style={{ fontSize: 10, color: "#555", whiteSpace: "nowrap", flexShrink: 0 }}>{(msg.recipients as string[]).length} rcpt</span>
                        </div>
                        <button
                          onClick={async () => {
                            setDeletingIds((p) => new Set([...p, msg.id]));
                            await fetchWithAuth(`/api/admin/whatsapp/messages/${msg.id}`, { method: "DELETE" });
                            setDeletingIds((p) => { const n = new Set(p); n.delete(msg.id); return n; });
                            setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                          }}
                          disabled={deleting}
                          title="Delete"
                          style={{ padding: "0px 4px", fontSize: 10, ...W98_RAISED, cursor: deleting ? "wait" : "pointer", background: "#c0c0c0", color: "#800000", flexShrink: 0 }}
                        >
                          {deleting ? "…" : "✕"}
                        </button>
                      </div>
                      {open && (
                        <div style={{ marginTop: 6, borderTop: "1px solid #ccc", paddingTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ fontSize: 10, color: "#000080", fontFamily: "monospace" }}>
                            To: {(msg.recipients as string[]).join(", ")}
                          </div>
                          {msg.sent_by && <div style={{ fontSize: 10, color: "#555" }}>By: {msg.sent_by}</div>}
                          <pre style={{ margin: 0, fontSize: 10, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "monospace", color: "#222", ...W98_SUNKEN, background: "#f8f8f8", padding: "4px 6px", maxHeight: 160, overflowY: "auto" }}>{msg.message_text}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        </div>{/* end right column */}

      {/* Win98 confirm modal */}
      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ ...W98_RAISED, background: "#c0c0c0", minWidth: 280, maxWidth: 380, display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ background: "#000080", color: "#fff", padding: "3px 8px", fontSize: 12, fontWeight: "bold" }}>Confirm</div>
            <div style={{ padding: "14px 16px 10px", fontSize: 12 }}>{confirmModal.message}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, padding: "0 12px 12px" }}>
              <button
                onClick={() => { closeConfirm(); void (confirmModal.onConfirm as () => Promise<void>)(); }}
                style={{ padding: "2px 16px", fontSize: 12, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0", fontWeight: "bold" }}
              >OK</button>
              <button
                onClick={closeConfirm}
                style={{ padding: "2px 16px", fontSize: 12, ...W98_RAISED, cursor: "pointer", background: "#c0c0c0" }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
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
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-400">Initialising connection… QR code will appear shortly.</p>
              <button
                onClick={() =>
                  showConfirm(
                    "Clear the current session and force a fresh QR code scan?",
                    async () => {
                      await fetchWithAuth("/api/admin/whatsapp/disconnect", { method: "POST" });
                      await fetchStatus();
                    },
                  )
                }
                className="self-start flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400/60 rounded-lg px-3 py-1.5 transition-colors"
              >
                Force new QR code
              </button>
            </div>
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

          {/* Header */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h2 className="text-white font-semibold text-base">Message Log</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {messages.length === 0 ? "No messages" : `${messages.length} message${messages.length !== 1 ? "s" : ""}`}
                {(filterYear || filterMonth || filterDay) && " (filtered)"}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedIds.size > 0 && (
                <button
                  onClick={() => void handleDeleteSelected()}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-500/40 hover:border-red-400 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete {selectedIds.size}
                </button>
              )}
              <button
                onClick={() => void handleDeleteAll()}
                disabled={deletingAll || messages.length === 0}
                className="flex items-center gap-1.5 text-xs text-white bg-red-600 hover:bg-red-500 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40"
              >
                {deletingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete All
              </button>
              <button
                onClick={() => void fetchMessages(filterYear, filterMonth, filterDay)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-end gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5">
            <span className="text-xs text-slate-400 shrink-0 self-center">Filter:</span>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              placeholder="Year"
              min={2020}
              className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 outline-none w-20"
            />
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 outline-none"
            >
              <option value="">All months</option>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                <option key={i} value={String(i + 1)}>{m}</option>
              ))}
            </select>
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 outline-none"
            >
              <option value="">All days</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={String(d)}>{d}</option>
              ))}
            </select>
            <button
              onClick={applyFilter}
              className="px-3 py-1 text-xs bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-400 rounded transition-colors"
            >
              Apply
            </button>
            {(filterYear || filterMonth || filterDay) && (
              <button onClick={clearFilter} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Clear
              </button>
            )}
          </div>

          {/* Messages */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-600">
              <MessageSquare className="w-8 h-8 opacity-30" />
              <p className="text-sm">{(filterYear || filterMonth || filterDay) ? "No messages match the filter." : "Messages will appear here after sending."}</p>
            </div>
          ) : (
            <>
              {/* Select all row */}
              <div className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  checked={selectedIds.size === messages.length}
                  onChange={toggleSelectAll}
                  className="accent-amber-400 cursor-pointer"
                />
                <span className="text-xs text-slate-500">Select all</span>
              </div>

              <ul className="flex flex-col gap-2 overflow-y-auto max-h-150 lg:max-h-[calc(100vh-22rem)]">
                {messages.map((msg) => {
                  const open = expandedIds.has(msg.id);
                  const selected = selectedIds.has(msg.id);
                  const deleting = deletingIds.has(msg.id);
                  return (
                    <li key={msg.id} className={`border rounded-lg overflow-hidden transition-colors ${selected ? "bg-amber-400/5 border-amber-400/30" : "bg-slate-800/60 border-slate-700"}`}>
                      <div className="flex items-center gap-2 px-3 py-2.5">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelect(msg.id)}
                          className="accent-amber-400 cursor-pointer shrink-0"
                        />
                        <button
                          onClick={() => toggleExpand(msg.id)}
                          className="flex items-center gap-2 flex-1 text-left min-w-0"
                        >
                          {open
                            ? <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                            : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                          }
                          <span className="text-xs font-mono text-slate-400 shrink-0">{fmtDate(msg.sent_at)}</span>
                          <span className="text-sm text-slate-200 truncate flex-1">{msg.subject || "(no subject)"}</span>
                          <span className="text-xs text-slate-500 shrink-0">{(msg.recipients as string[]).length} rcpt</span>
                        </button>
                        <button
                          onClick={async () => {
                            setDeletingIds((p) => new Set([...p, msg.id]));
                            await fetchWithAuth(`/api/admin/whatsapp/messages/${msg.id}`, { method: "DELETE" });
                            setDeletingIds((p) => { const n = new Set(p); n.delete(msg.id); return n; });
                            setMessages((prev) => prev.filter((m) => m.id !== msg.id));
                          }}
                          disabled={deleting}
                          className="text-slate-600 hover:text-red-400 transition-colors p-0.5 rounded shrink-0"
                          title="Delete"
                        >
                          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {open && (
                        <div className="border-t border-slate-700 px-4 py-3 flex flex-col gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            {(msg.recipients as string[]).map((r) => (
                              <span key={r} className="text-xs font-mono bg-slate-700 text-slate-300 rounded px-2 py-0.5">{r}</span>
                            ))}
                          </div>
                          {msg.sent_by && <p className="text-xs text-slate-500">Sent by {msg.sent_by}</p>}
                          <pre className="mt-1 text-xs text-slate-300 whitespace-pre-wrap wrap-break-word font-mono bg-slate-900/60 rounded-lg px-3 py-2 max-h-64 overflow-y-auto">{msg.message_text}</pre>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        </div>{/* end right column */}

      </div>

      {/* Modern confirm modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 flex flex-col gap-5 w-full max-w-sm mx-4">
            <p className="text-sm text-slate-200 leading-relaxed">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 text-sm rounded-lg border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 transition-colors"
              >Cancel</button>
              <button
                onClick={() => { closeConfirm(); void (confirmModal.onConfirm as () => Promise<void>)(); }}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
              >Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
