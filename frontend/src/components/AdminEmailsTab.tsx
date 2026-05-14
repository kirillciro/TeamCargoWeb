"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/getDictionary";
import {
  Loader2,
  RefreshCw,
  Inbox,
  Trash2,
  ShieldAlert,
  Paperclip,
  FileText,
  ChevronLeft,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

// ── Win98 style constants ───────────────────────────────────────────────────

const W98_BTN: React.CSSProperties = {
  fontFamily: "inherit",
  fontSize: 11,
  background: "#c0c0c0",
  color: "#000",
  border: "2px solid",
  borderColor: "#fff #808080 #808080 #fff",
  padding: "2px 8px",
  cursor: "pointer",
};

const W98_INSET: React.CSSProperties = {
  border: "2px solid",
  borderColor: "#808080 #fff #fff #808080",
  background: "#fff",
};

// ── Modal ────────────────────────────────────────────────────────────────────

type ModalState =
  | { type: "confirm"; message: string; onConfirm: () => void }
  | { type: "error"; message: string }
  | null;

function AppModal({
  modal,
  onClose,
  dict,
  win98,
}: {
  modal: ModalState;
  onClose: () => void;
  dict: Dictionary;
  win98?: boolean;
}) {
  if (!modal) return null;

  if (win98) {
    const closeBtn: React.CSSProperties = {
      background: "#c0c0c0",
      border: "2px solid",
      borderColor: "#fff #808080 #808080 #fff",
      width: 16,
      height: 14,
      fontSize: 9,
      lineHeight: 1,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
    };
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.5)",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "#c0c0c0",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            width: 320,
            fontFamily: "MS Sans Serif, Arial, sans-serif",
            fontSize: 11,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              background: "linear-gradient(to right,#000080,#1084d0)",
              color: "#fff",
              padding: "3px 6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 11,
              fontWeight: "bold",
            }}
          >
            <span>{modal.type === "confirm" ? "Confirm" : "Error"}</span>
            <button style={closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>
          <div
            style={{
              padding: "16px 12px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: 28,
                lineHeight: 1,
                color: modal.type === "confirm" ? "#000080" : "#800000",
                fontWeight: "bold",
              }}
            >
              {modal.type === "confirm" ? "?" : "!"}
            </span>
            <div>
              <p style={{ fontWeight: "bold", marginBottom: 4 }}>
                {modal.type === "confirm"
                  ? dict.admin.modal_are_you_sure
                  : dict.admin.modal_something_went_wrong}
              </p>
              <p style={{ color: "#333" }}>{modal.message}</p>
            </div>
          </div>
          <div
            style={{
              padding: "8px 12px",
              borderTop: "1px solid #808080",
              display: "flex",
              justifyContent: "flex-end",
              gap: 6,
            }}
          >
            {modal.type === "confirm" ? (
              <>
                <button
                  style={W98_BTN}
                  onClick={() => {
                    modal.onConfirm();
                    onClose();
                  }}
                >
                  {dict.admin.modal_delete}
                </button>
                <button style={W98_BTN} onClick={onClose}>
                  {dict.admin.cancel}
                </button>
              </>
            ) : (
              <button style={W98_BTN} onClick={onClose}>
                {dict.admin.modal_ok}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {modal.type === "confirm" ? (
          <>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {dict.admin.modal_are_you_sure}
                </p>
                <p className="mt-1 text-sm text-slate-500">{modal.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {dict.admin.cancel}
              </button>
              <button
                onClick={() => {
                  modal.onConfirm();
                  onClose();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                {dict.admin.modal_delete}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                <XCircle className="w-5 h-5 text-red-500" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {dict.admin.modal_something_went_wrong}
                </p>
                <p className="mt-1 text-sm text-slate-500">{modal.message}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                {dict.admin.modal_ok}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Folder = "INBOX" | "SPAM" | "TRASH";

type FolderCounts = Record<string, { total: number; unread: number }>;

type EmailSummary = {
  id: number;
  from_address: string;
  from_name: string | null;
  subject: string;
  received_at: string;
  is_read: boolean;
  folder: string;
  attachment_count: number;
  extraction_status:
    | "none"
    | "pending"
    | "extracting"
    | "extracted"
    | "failed"
    | "sent";
};

type Attachment = {
  id: number;
  filename: string;
  content_type: string;
  size_bytes: number;
};

type CargoData = {
  // Route / dispatch
  route?: string | null;
  chauffeurs?: number | null;
  date_from?: string | null;
  date_to?: string | null;
  stops_total?: number | null;
  // Cargo / shipment
  shipper_name?: string | null;
  shipper_address?: string | null;
  consignee_name?: string | null;
  consignee_address?: string | null;
  origin?: string | null;
  destination?: string | null;
  transport_mode?: string | null;
  booking_reference?: string | null;
  eta?: string | null;
  etd?: string | null;
  incoterms?: string | null;
  cargo_description?: string | null;
  pieces?: number | null;
  weight_kg?: number | null;
  volume_cbm?: number | null;
  dimensions?: string | null;
  hs_code?: string | null;
  special_instructions?: string | null;
};

type Extraction = {
  id: number;
  attachment_id: number;
  status: "pending" | "extracting" | "extracted" | "failed" | "sent";
  extracted_json: CargoData | null;
  whatsapp_sent_at: string | null;
  error_message: string | null;
};

type EmailDetail = {
  email: {
    id: number;
    from_address: string;
    from_name: string | null;
    subject: string;
    received_at: string;
    body_text: string | null;
    body_html: string | null;
    is_read: boolean;
    folder: string;
  };
  attachments: Attachment[];
  extractions: Extraction[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
}

// ── Folder sidebar ────────────────────────────────────────────────────────────

const FOLDER_META: {
  key: Folder;
  labelKey: keyof Dictionary["admin"];
  Icon: React.ElementType;
  color: string;
}[] = [
  {
    key: "INBOX",
    labelKey: "folder_inbox",
    Icon: Inbox,
    color: "text-blue-600",
  },
  {
    key: "SPAM",
    labelKey: "folder_spam",
    Icon: ShieldAlert,
    color: "text-orange-500",
  },
  {
    key: "TRASH",
    labelKey: "folder_trash",
    Icon: Trash2,
    color: "text-slate-500",
  },
];

function FolderSidebar({
  active,
  counts,
  onSelect,
  dict,
  win98,
}: {
  active: Folder;
  counts: FolderCounts;
  onSelect: (f: Folder) => void;
  dict: Dictionary;
  win98?: boolean;
}) {
  if (win98) {
    return (
      <div style={{ padding: 2 }}>
        {FOLDER_META.map(({ key, labelKey }) => {
          const label = dict.admin[labelKey] as string;
          const unread = counts[key]?.unread ?? 0;
          const total = counts[key]?.total ?? 0;
          const isActive = active === key;
          const icons: Record<string, string> = {
            INBOX: "[+]",
            SPAM: "[!]",
            TRASH: "[-]",
          };
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                width: "100%",
                padding: "2px 4px",
                textAlign: "left",
                background: isActive ? "#000080" : "transparent",
                color: isActive ? "#fff" : "#000",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 11,
              }}
            >
              <span style={{ fontFamily: "monospace", fontSize: 10 }}>
                {icons[key]}
              </span>
              <span style={{ flex: 1 }}>{label}</span>
              <span
                style={{ fontSize: 10, color: isActive ? "#ccc" : "#808080" }}
              >
                {total > 999 ? "999+" : total}
              </span>
              {unread > 0 && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    color: isActive ? "#ffff00" : "#000080",
                    marginLeft: 2,
                  }}
                >
                  ({unread})
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="flex flex-row flex-wrap md:flex-col gap-0.5 p-1 md:p-2">
      {FOLDER_META.map(({ key, labelKey, Icon, color }) => {
        const label = dict.admin[labelKey] as string;
        const unread = counts[key]?.unread ?? 0;
        const total = counts[key]?.total ?? 0;
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex items-center gap-1.5 md:gap-3 rounded-lg px-2 md:px-3 py-1.5 md:py-2.5 text-xs md:text-sm font-medium transition-colors text-left ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : color}`}
            />
            <span className="flex-1">{label}</span>
            <span className="flex items-center gap-1.5">
              {total > 0 && (
                <span
                  className={`text-xs ${
                    isActive ? "text-blue-500" : "text-slate-400"
                  }`}
                >
                  {total > 999 ? "999+" : total}
                </span>
              )}
              {unread > 0 && (
                <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white leading-none">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Email list item ───────────────────────────────────────────────────────────

function EmailListItem({
  email,
  selected,
  checked,
  onToggle,
  onClick,
  dict,
  win98,
}: {
  email: EmailSummary;
  selected: boolean;
  checked: boolean;
  onToggle: (id: number) => void;
  onClick: () => void;
  dict: Dictionary;
  win98?: boolean;
}) {
  const sender = email.from_name || email.from_address;

  if (win98) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "24px 1fr 1.6fr 60px",
          alignItems: "center",
          borderBottom: "1px solid #d4d4d4",
          background: selected ? "#000080" : "transparent",
          color: selected ? "#fff" : "#000",
          cursor: "default",
          minHeight: 20,
        }}
        onClick={onClick}
      >
        <div
          style={{ padding: "1px 4px", display: "flex", alignItems: "center" }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(email.id);
          }}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(email.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div
          style={{
            padding: "1px 2px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {!email.is_read && (
            <span
              style={{
                display: "inline-block",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: selected ? "#7fa8ff" : "#000080",
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontWeight: email.is_read ? "normal" : "bold",
              fontSize: 11,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {sender}
          </span>
        </div>
        <div style={{ padding: "1px 2px", overflow: "hidden" }}>
          <span
            style={{
              fontSize: 11,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {email.subject || dict.admin.no_subject}
          </span>
        </div>
        <div
          style={{
            padding: "1px 4px",
            fontSize: 10,
            color: selected ? "#ccc" : "#808080",
            whiteSpace: "nowrap",
            textAlign: "right",
          }}
        >
          {formatDate(email.received_at)}
          {email.attachment_count > 0 ? " [A]" : ""}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-stretch border-b border-slate-100 transition-colors hover:bg-slate-50 ${
        selected ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
      }`}
    >
      <div
        className="flex items-center px-2 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(email.id);
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(email.id)}
          onClick={(e) => e.stopPropagation()}
          className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
        />
      </div>
      <button onClick={onClick} className="flex-1 min-w-0 px-2 py-3 text-left">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span
            className={`text-sm truncate max-w-36 ${
              !email.is_read
                ? "font-bold text-slate-900"
                : "font-medium text-slate-600"
            }`}
          >
            {sender}
          </span>
          <span className="text-xs text-slate-400 shrink-0">
            {formatDate(email.received_at)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {!email.is_read && (
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          )}
          <span
            className={`text-xs truncate flex-1 ${
              !email.is_read ? "text-slate-700" : "text-slate-400"
            }`}
          >
            {email.subject || dict.admin.no_subject}
          </span>
          {email.attachment_count > 0 && (
            <Paperclip className="w-3 h-3 text-slate-400 shrink-0" />
          )}
        </div>
      </button>
    </div>
  );
}

// ── Extraction badge ──────────────────────────────────────────────────────────

function ExtractionBadge({
  status,
  dict,
  win98,
}: {
  status: Extraction["status"] | "none";
  dict: Dictionary;
  win98?: boolean;
}) {
  if (win98) {
    const textMap: Record<string, string> = {
      none: "Not extracted",
      pending: "Pending...",
      extracting: "Processing...",
      extracted: "[OK] Extracted",
      failed: "[ERR] Failed",
      sent: "[OK] Sent",
    };
    const colorMap: Record<string, string> = {
      none: "#808080",
      pending: "#808000",
      extracting: "#000080",
      extracted: "#006400",
      failed: "#800000",
      sent: "#006400",
    };
    return (
      <span
        style={{
          fontSize: 11,
          color: colorMap[status] ?? "#000",
          fontWeight:
            status === "extracted" || status === "sent" ? "bold" : "normal",
        }}
      >
        {textMap[status] ?? status}
      </span>
    );
  }

  const map: Record<
    string,
    {
      labelKey: keyof Dictionary["admin"];
      cls: string;
      Icon: React.ElementType;
    }
  > = {
    none: {
      labelKey: "extract_not_extracted",
      cls: "text-slate-400",
      Icon: Clock,
    },
    pending: {
      labelKey: "extract_pending",
      cls: "text-yellow-500",
      Icon: Clock,
    },
    extracting: {
      labelKey: "extract_extracting",
      cls: "text-blue-500",
      Icon: Loader2,
    },
    extracted: {
      labelKey: "extract_extracted",
      cls: "text-green-600",
      Icon: CheckCircle,
    },
    failed: { labelKey: "extract_failed", cls: "text-red-500", Icon: XCircle },
    sent: {
      labelKey: "extract_sent",
      cls: "text-emerald-600",
      Icon: CheckCircle,
    },
  };
  const m = map[status] ?? map.none;
  const Icon = m.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${m.cls}`}
    >
      <Icon
        className={`w-3.5 h-3.5 ${status === "extracting" ? "animate-spin" : ""}`}
      />
      {dict.admin[m.labelKey] as string}
    </span>
  );
}

// ── Extraction data grid ──────────────────────────────────────────────────────

function ExtractionGrid({
  data,
  dict,
  win98,
}: {
  data: CargoData;
  dict: Dictionary;
  win98?: boolean;
}) {
  const rows: [string, string | number | null | undefined][] = [
    // Route / dispatch — shown first
    ["Route", data.route],
    ["Chauffeurs", data.chauffeurs],
    ["Date From", data.date_from],
    ["Date To", data.date_to],
    ["Stops Total", data.stops_total],
    // Cargo / shipment
    ["Shipper", data.shipper_name],
    ["Shipper Address", data.shipper_address],
    ["Consignee", data.consignee_name],
    ["Consignee Address", data.consignee_address],
    ["Origin", data.origin],
    ["Destination", data.destination],
    ["Transport Mode", data.transport_mode],
    ["Booking Ref", data.booking_reference],
    ["ETD", data.etd],
    ["ETA", data.eta],
    ["Incoterms", data.incoterms],
    ["Description", data.cargo_description],
    ["Pieces", data.pieces],
    ["Weight (kg)", data.weight_kg],
    ["Volume (CBM)", data.volume_cbm],
    ["Dimensions", data.dimensions],
    ["HS Code", data.hs_code],
    ["Special Instructions", data.special_instructions],
  ].filter(([, v]) => v !== null && v !== undefined && v !== "") as [
    string,
    string | number,
  ][];

  if (rows.length === 0) {
    return win98 ? (
      <p style={{ fontSize: 11, color: "#808080", fontStyle: "italic" }}>
        {dict.admin.extract_no_data}
      </p>
    ) : (
      <p className="text-xs text-slate-400 italic">
        {dict.admin.extract_no_data}
      </p>
    );
  }

  if (win98) {
    return (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 11,
          background: "#fff",
          border: "1px solid #808080",
        }}
      >
        <tbody>
          {rows.map(([label, val], i) => (
            <tr
              key={label}
              style={{ background: i % 2 === 0 ? "#fff" : "#f0f0f0" }}
            >
              <td
                style={{
                  padding: "2px 6px",
                  fontWeight: "bold",
                  color: "#000080",
                  borderRight: "1px solid #d4d4d4",
                  whiteSpace: "nowrap",
                  width: "35%",
                  verticalAlign: "top",
                }}
              >
                {label}
              </td>
              <td style={{ padding: "2px 6px", wordBreak: "break-word" }}>
                {String(val)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-3 bg-white rounded-lg border border-slate-200 p-3">
      {rows.map(([label, val]) => (
        <div key={label}>
          <dt className="font-semibold text-slate-400 uppercase tracking-wide text-[10px]">
            {label}
          </dt>
          <dd className="text-slate-700 mt-0.5 wrap-break-word">
            {String(val)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ── Attachment row ────────────────────────────────────────────────────────────

function AttachmentRow({
  emailId,
  attachment,
  existingExtraction,
  onExtractionUpdate,
  dict,
  win98,
}: {
  emailId: number;
  attachment: Attachment;
  existingExtraction: Extraction | undefined;
  onExtractionUpdate: (e: Extraction) => void;
  dict: Dictionary;
  win98?: boolean;
}) {
  const [extraction, setExtraction] = useState<Extraction | undefined>(
    existingExtraction,
  );
  const [extracting, setExtracting] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const pollStatus = useCallback(
    (id: number) => {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetchWithAuth(`/api/admin/extractions/${id}`);
          if (!res.ok) {
            stopPolling();
            return;
          }
          const updated = (await res.json()) as Extraction;
          setExtraction(updated);
          onExtractionUpdate(updated);
          if (updated.status !== "extracting" && updated.status !== "pending") {
            stopPolling();
            setExtracting(false);
          }
        } catch {
          stopPolling();
          setExtracting(false);
        }
      }, 2500);
    },
    [onExtractionUpdate, stopPolling],
  );

  const handleExtract = async () => {
    setExtracting(true);
    try {
      const res = await fetchWithAuth(
        `/api/admin/emails/${emailId}/extract/${attachment.id}`,
        { method: "POST" },
      );
      if (!res.ok) throw new Error("Failed");
      const { extractionId } = (await res.json()) as { extractionId: number };
      const next: Extraction = {
        id: extractionId,
        attachment_id: attachment.id,
        status: "extracting",
        extracted_json: null,
        whatsapp_sent_at: null,
        error_message: null,
      };
      setExtraction(next);
      onExtractionUpdate(next);
      pollStatus(extractionId);
    } catch {
      setExtracting(false);
    }
  };

  const handleSendWA = async () => {
    if (!extraction) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetchWithAuth(
        `/api/admin/extractions/${extraction.id}/send-whatsapp`,
        { method: "POST" },
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(body.message ?? "Failed to send WhatsApp message.");
      }
      const updated: Extraction = { ...extraction, status: "sent" };
      setExtraction(updated);
      onExtractionUpdate(updated);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Failed to send WhatsApp message.",
      );
    } finally {
      setSending(false);
    }
  };

  if (win98) {
    return (
      <div
        style={{
          border: "1px solid #808080",
          background: "#f0f0f0",
          padding: 6,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11, fontFamily: "monospace" }}>[DOC]</span>
            <a
              href={`/api/admin/emails/${emailId}/attachment/${attachment.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#000080",
                textDecoration: "underline",
                fontSize: 11,
              }}
            >
              {attachment.filename}
            </a>
            <span style={{ fontSize: 10, color: "#808080" }}>
              ({formatBytes(attachment.size_bytes)})
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {extraction && (
              <ExtractionBadge status={extraction.status} dict={dict} win98 />
            )}
            {(!extraction || extraction.status === "failed") && (
              <button
                onClick={() => void handleExtract()}
                disabled={extracting}
                style={{ ...W98_BTN, opacity: extracting ? 0.6 : 1 }}
              >
                {extracting
                  ? dict.admin.processing
                  : dict.admin.extract_with_ai}
              </button>
            )}
            {(extraction?.status === "extracted" ||
              extraction?.status === "sent") && (
              <button
                onClick={() => void handleExtract()}
                disabled={extracting}
                style={{ ...W98_BTN, opacity: extracting ? 0.6 : 1 }}
              >
                {extracting ? dict.admin.processing : dict.admin.re_extract}
              </button>
            )}
          </div>
        </div>
        {(extraction?.status === "extracted" ||
          extraction?.status === "sent") &&
          extraction.extracted_json && (
            <div style={{ marginTop: 6 }}>
              <ExtractionGrid
                data={extraction.extracted_json}
                dict={dict}
                win98
              />
            </div>
          )}
        {extraction?.status === "extracted" && (
          <div style={{ marginTop: 6 }}>
            <button
              onClick={() => void handleSendWA()}
              disabled={sending}
              style={{ ...W98_BTN, opacity: sending ? 0.6 : 1 }}
            >
              {sending ? dict.admin.sending : dict.admin.send_to_whatsapp}
            </button>
          </div>
        )}
        {sendError && (
          <p style={{ fontSize: 11, color: "#800000", marginTop: 4 }}>
            {sendError}
          </p>
        )}
        {extraction?.status === "sent" && (
          <p
            style={{
              fontSize: 11,
              color: "#006400",
              marginTop: 4,
              fontWeight: "bold",
            }}
          >
            {dict.admin.sent_to_whatsapp}
          </p>
        )}
        {extraction?.status === "failed" && (
          <p style={{ fontSize: 11, color: "#800000", marginTop: 4 }}>
            Error: {extraction.error_message ?? "Unknown error"}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
          <a
            href={`/api/admin/emails/${emailId}/attachment/${attachment.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            {attachment.filename}
          </a>
          <span className="text-xs text-slate-400">
            ({formatBytes(attachment.size_bytes)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {extraction && (
            <ExtractionBadge status={extraction.status} dict={dict} />
          )}

          {(!extraction || extraction.status === "failed") && (
            <button
              onClick={() => void handleExtract()}
              disabled={extracting}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {extracting && <Loader2 className="w-3 h-3 animate-spin" />}
              {dict.admin.extract_with_ai}
            </button>
          )}

          {(extraction?.status === "extracted" ||
            extraction?.status === "sent") && (
            <button
              onClick={() => void handleExtract()}
              disabled={extracting}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-60"
            >
              {extracting && <Loader2 className="w-3 h-3 animate-spin" />}
              {dict.admin.re_extract}
            </button>
          )}

          {extraction?.status === "extracting" && (
            <span className="text-xs text-blue-500 animate-pulse">
              {dict.admin.processing}
            </span>
          )}
        </div>
      </div>

      {/* Extracted data */}
      {(extraction?.status === "extracted" || extraction?.status === "sent") &&
        extraction.extracted_json && (
          <ExtractionGrid data={extraction.extracted_json} dict={dict} />
        )}

      {extraction?.status === "extracted" && (
        <button
          onClick={() => void handleSendWA()}
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: sending ? "#6b7280" : "#25D366" }}
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {sending ? dict.admin.sending : dict.admin.send_to_whatsapp}
        </button>
      )}

      {sendError && <p className="text-xs text-red-600">{sendError}</p>}

      {extraction?.status === "sent" && (
        <p className="text-xs text-emerald-600 font-medium">
          {dict.admin.sent_to_whatsapp}
        </p>
      )}

      {extraction?.status === "failed" && (
        <p className="text-xs text-red-600">
          Error: {extraction.error_message ?? "Unknown error"}
        </p>
      )}
    </div>
  );
}

// ── Email detail panel ────────────────────────────────────────────────────────

function EmailDetailPanel({
  emailId,
  onBack,
  dict,
  win98,
}: {
  emailId: number;
  onBack: () => void;
  dict: Dictionary;
  win98?: boolean;
}) {
  const [detail, setDetail] = useState<EmailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [extractions, setExtractions] = useState<Extraction[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        // Mark as read (fire-and-forget)
        void fetchWithAuth(`/api/admin/emails/${emailId}/read`, {
          method: "PATCH",
        });
        const res = await fetchWithAuth(`/api/admin/emails/${emailId}`);
        if (!res.ok) throw new Error("Failed");
        const data = (await res.json()) as EmailDetail;
        setDetail(data);
        setExtractions(data.extractions);
      } finally {
        setLoading(false);
      }
    })();
  }, [emailId]);

  const handleExtractionUpdate = useCallback((updated: Extraction) => {
    setExtractions((prev) => {
      const idx = prev.findIndex((e) => e.id === updated.id);
      return idx >= 0
        ? prev.map((e) => (e.id === updated.id ? updated : e))
        : [updated, ...prev];
    });
  }, []);

  if (win98) {
    return (
      <div
        style={{
          fontFamily: "MS Sans Serif, Arial, sans-serif",
          fontSize: 11,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "#fff",
        }}
      >
        {/* Back button on mobile */}
        <div
          style={{
            borderBottom: "1px solid #808080",
            padding: "2px 4px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <button onClick={onBack} style={W98_BTN}>
            {"<"} {dict.admin.back}
          </button>
        </div>
        {loading && (
          <div style={{ padding: 16, textAlign: "center", color: "#808080" }}>
            Loading...
          </div>
        )}
        {detail && (
          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {/* Header */}
            <div
              style={{
                borderBottom: "1px solid #808080",
                paddingBottom: 6,
                marginBottom: 8,
              }}
            >
              <div
                style={{ fontWeight: "bold", fontSize: 12, marginBottom: 3 }}
              >
                {detail.email.subject || dict.admin.no_subject}
              </div>
              <div style={{ fontSize: 11, marginBottom: 2 }}>
                <strong>From:</strong>{" "}
                {detail.email.from_name || detail.email.from_address}
                {detail.email.from_name && (
                  <span style={{ color: "#808080" }}>
                    {" "}
                    &lt;{detail.email.from_address}&gt;
                  </span>
                )}
              </div>
              <div style={{ fontSize: 10, color: "#808080" }}>
                {new Date(detail.email.received_at).toLocaleString()}
              </div>
            </div>
            {/* Body */}
            <div
              style={{
                ...W98_INSET,
                padding: 6,
                marginBottom: 8,
                minHeight: 60,
              }}
            >
              {detail.email.body_text ? (
                <pre
                  style={{
                    fontSize: 11,
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {detail.email.body_text}
                </pre>
              ) : (
                <span style={{ color: "#808080", fontStyle: "italic" }}>
                  {dict.admin.no_message_body}
                </span>
              )}
            </div>
            {/* Attachments */}
            {detail.attachments.length > 0 && (
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 10,
                    color: "#000080",
                    marginBottom: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {dict.admin.pdf_attachments} ({detail.attachments.length})
                </div>
                {detail.attachments.map((att) => (
                  <AttachmentRow
                    key={att.id}
                    emailId={emailId}
                    attachment={att}
                    existingExtraction={extractions.find(
                      (e) => e.attachment_id === att.id,
                    )}
                    onExtractionUpdate={handleExtractionUpdate}
                    dict={dict}
                    win98
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Back button (visible on mobile) */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 md:hidden border-b border-slate-100"
      >
        <ChevronLeft className="w-4 h-4" /> {dict.admin.back}
      </button>

      {loading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      )}

      {detail && (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Email header */}
          <div className="border-b border-slate-100 pb-3 space-y-0.5">
            <h2 className="text-lg font-semibold text-slate-800">
              {detail.email.subject || dict.admin.no_subject}
            </h2>
            <p className="text-sm text-slate-600">
              <span className="font-medium">
                {detail.email.from_name || detail.email.from_address}
              </span>
              {detail.email.from_name && (
                <span className="text-slate-400">
                  {" "}
                  &lt;{detail.email.from_address}&gt;
                </span>
              )}
            </p>
            <p className="text-xs text-slate-400">
              {new Date(detail.email.received_at).toLocaleString()}
            </p>
          </div>

          {/* Email body */}
          <div className="rounded-lg border border-slate-100 bg-white p-4 min-h-20">
            {detail.email.body_text ? (
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {detail.email.body_text}
              </pre>
            ) : (
              <p className="text-sm text-slate-400 italic">
                {dict.admin.no_message_body}
              </p>
            )}
          </div>

          {/* PDF attachments */}
          {detail.attachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {dict.admin.pdf_attachments} ({detail.attachments.length})
              </h3>
              {detail.attachments.map((att) => (
                <AttachmentRow
                  key={att.id}
                  emailId={emailId}
                  attachment={att}
                  existingExtraction={extractions.find(
                    (e) => e.attachment_id === att.id,
                  )}
                  onExtractionUpdate={handleExtractionUpdate}
                  dict={dict}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── AdminEmailsTab (root) ─────────────────────────────────────────────────────

export default function AdminEmailsTab({
  dict,
  win98,
}: {
  dict: Dictionary;
  win98?: boolean;
}) {
  const [folder, setFolder] = useState<Folder>("INBOX");
  const [counts, setCounts] = useState<FolderCounts>({});
  const [emails, setEmails] = useState<EmailSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [selectAllFolder, setSelectAllFolder] = useState(false);

  // Load folder counts
  useEffect(() => {
    void (async () => {
      try {
        const res = await fetchWithAuth("/api/admin/emails/counts");
        if (res.ok) setCounts((await res.json()) as FolderCounts);
      } catch {
        /* non-critical */
      }
    })();
  }, [refreshKey]);

  // Load email list
  useEffect(() => {
    void (async () => {
      try {
        const res = await fetchWithAuth(
          `/api/admin/emails?folder=${folder}&page=${page}`,
        );
        if (!res.ok) throw new Error("Failed");
        const data = (await res.json()) as {
          emails: EmailSummary[];
          total: number;
        };
        setEmails(data.emails);
        setTotal(data.total);
      } finally {
        setLoading(false);
      }
    })();
  }, [folder, page, refreshKey]);

  const handleFolderChange = (f: Folder) => {
    setFolder(f);
    setPage(1);
    setSelectedId(null);
    setCheckedIds(new Set());
    setSelectAllFolder(false);
  };

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allChecked =
    emails.length > 0 && emails.every((e) => checkedIds.has(e.id));

  const toggleSelectAll = () => {
    if (selectAllFolder) {
      setSelectAllFolder(false);
      setCheckedIds(new Set());
    } else if (allChecked) {
      setSelectAllFolder(false);
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(emails.map((e) => e.id)));
    }
  };

  const executeDelete = async (deleteAll: boolean, idsSnapshot: number[]) => {
    setDeleting(true);
    try {
      const body = deleteAll ? { all: true, folder } : { ids: idsSnapshot };
      const res = await fetchWithAuth("/api/admin/emails", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Delete failed");
      setCheckedIds(new Set());
      setSelectAllFolder(false);
      if (selectedId && (deleteAll || idsSnapshot.includes(selectedId)))
        setSelectedId(null);
      setPage(1);
      setRefreshKey((k) => k + 1);
      // Refresh sidebar counts immediately after delete
      fetchWithAuth("/api/admin/emails/counts")
        .then(async (r) => {
          if (r.ok) setCounts((await r.json()) as FolderCounts);
        })
        .catch(() => {
          /* non-critical */
        });
    } catch (err) {
      setModal({
        type: "error",
        message: err instanceof Error ? err.message : "Delete failed.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSelected = (deleteAll = false) => {
    const isFolder = deleteAll || selectAllFolder;
    const idsSnapshot = Array.from(checkedIds);
    const count = selectAllFolder ? total : idsSnapshot.length;
    const folderLabel = folder.charAt(0) + folder.slice(1).toLowerCase();
    const message = isFolder
      ? dict.admin.delete_confirm_all.replace("{folder}", folderLabel)
      : dict.admin.delete_confirm_selected.replace("{count}", String(count));
    setModal({
      type: "confirm",
      message,
      onConfirm: () => void executeDelete(isFolder, idsSnapshot),
    });
  };

  const handleSelectEmail = (email: EmailSummary) => {
    setSelectedId(email.id);
    // Optimistically mark as read
    if (!email.is_read) {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, is_read: true } : e)),
      );
      setCounts((prev) => {
        const c = prev[folder];
        if (!c) return prev;
        return {
          ...prev,
          [folder]: { ...c, unread: Math.max(0, c.unread - 1) },
        };
      });
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetchWithAuth("/api/admin/emails/sync", {
        method: "POST",
      });
      const data = (await res.json()) as { newEmails?: number; error?: string };
      if (data.error) throw new Error(data.error);
      setSyncMsg(
        dict.admin.sync_complete.replace(
          "{count}",
          String(data.newEmails ?? 0),
        ),
      );
      setPage(1);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setSyncMsg(err instanceof Error ? err.message : dict.admin.sync_failed);
    } finally {
      setSyncing(false);
    }
  };

  // Auto-sync on first mount
  const didAutoSync = useRef(false);
  useEffect(() => {
    if (didAutoSync.current) return;
    didAutoSync.current = true;
    void handleSync();
  }, []);

  const pageSize = 25;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Win98 resizable column widths: [fromW, dateW]  — subject takes the rest
  const [colFrom, setColFrom] = useState(170);
  const [colDate, setColDate] = useState(68);
  const colCheckbox = 22;

  const startResizeFrom = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = colFrom;
    const onMove = (ev: MouseEvent) =>
      setColFrom(Math.max(60, startW + ev.clientX - startX));
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const startResizeDate = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = colDate;
    const onMove = (ev: MouseEvent) =>
      setColDate(Math.max(50, startW - (ev.clientX - startX)));
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const thStyle: React.CSSProperties = {
    padding: "2px 6px",
    borderRight: "1px solid #808080",
    borderBottom: "2px solid #808080",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 11,
    overflow: "hidden",
    userSelect: "none",
    background: "#c0c0c0",
    position: "relative",
    whiteSpace: "nowrap",
  };

  const resizeHandle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 5,
    cursor: "col-resize",
    zIndex: 2,
  };

  if (win98) {
    return (
      <>
        <AppModal
          modal={modal}
          onClose={() => setModal(null)}
          dict={dict}
          win98
        />
        <style>{`
          @media (max-width: 640px) {
            .w98em-main { height: auto !important; overflow-y: auto !important; }
            .w98em-panes { flex-direction: column !important; overflow-y: visible !important; }
            .w98em-sidebar { width: 100% !important; border-right: none !important; border-bottom: 2px solid #808080 !important; flex-shrink: 0 !important; }
            .w98em-content { flex-direction: column !important; overflow: visible !important; }
            .w98em-list { border-right: none !important; border-bottom: 2px solid #808080 !important; max-height: 220px !important; flex: none !important; }
            .w98em-detail { flex: none !important; min-height: 200px !important; overflow: auto !important; }
          }
        `}</style>
        <div
          className="w98em-main"
          style={{
            fontFamily: "MS Sans Serif, Arial, sans-serif",
            fontSize: 11,
            color: "#000",
            background: "#c0c0c0",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            height: "calc(100vh - 180px)",
            minHeight: 384,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Sync overlay */}
          {syncing && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "rgba(192,192,192,0.88)",
                fontFamily: "inherit",
                fontSize: 11,
              }}
            >
              <span>Syncing...</span>
            </div>
          )}

          {/* Toolbar */}
          <div
            style={{
              padding: "3px 4px",
              borderBottom: "2px solid #808080",
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => void handleSync()}
              disabled={syncing}
              style={{ ...W98_BTN, opacity: syncing ? 0.6 : 1 }}
            >
              {syncing ? dict.admin.syncing : dict.admin.sync_inbox}
            </button>
            {checkedIds.size > 0 && (
              <button
                onClick={() => void handleDeleteSelected(false)}
                disabled={deleting}
                style={{ ...W98_BTN, opacity: deleting ? 0.6 : 1 }}
              >
                Delete ({selectAllFolder ? total : checkedIds.size})
              </button>
            )}
            {checkedIds.size === 0 && total > 0 && (
              <button
                onClick={() => void handleDeleteSelected(true)}
                disabled={deleting}
                style={{ ...W98_BTN, opacity: deleting ? 0.6 : 1 }}
              >
                Delete All
              </button>
            )}
            {syncMsg && (
              <span style={{ fontSize: 10, color: "#000080", marginLeft: 4 }}>
                {syncMsg}
              </span>
            )}
          </div>

          {/* Three-pane content */}
          <div
            className="w98em-panes"
            style={{ flex: 1, display: "flex", overflow: "hidden" }}
          >
            {/* Folder sidebar */}
            <div
              className="w98em-sidebar"
              style={{
                width: 130,
                flexShrink: 0,
                borderRight: "2px solid #808080",
                overflow: "auto",
                background: "#c0c0c0",
              }}
            >
              <div
                style={{
                  padding: "2px 4px",
                  borderBottom: "1px solid #808080",
                  fontWeight: "bold",
                  fontSize: 10,
                  color: "#fff",
                  background: "#000080",
                }}
              >
                Folders
              </div>
              <FolderSidebar
                active={folder}
                counts={counts}
                onSelect={handleFolderChange}
                dict={dict}
                win98
              />
            </div>

            {/* Email list + detail — side by side, 50/50 */}
            <div
              className="w98em-content"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
              }}
            >
              {/* LEFT: Email list pane */}
              <div
                className="w98em-list"
                style={{
                  flex: 1,
                  borderRight: "2px solid #808080",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                }}
              >
                {/* Single table — header + rows share the same column context */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      tableLayout: "fixed",
                      borderCollapse: "collapse",
                      fontSize: 11,
                    }}
                  >
                    <colgroup>
                      <col style={{ width: colCheckbox }} />
                      <col style={{ width: colFrom }} />
                      <col />
                      {/* Subject: takes remaining space */}
                      <col style={{ width: colDate }} />
                    </colgroup>
                    <thead>
                      <tr
                        style={{
                          background: "#c0c0c0",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        <th
                          style={{
                            ...thStyle,
                            width: colCheckbox,
                            borderRight: "1px solid #808080",
                            fontWeight: "normal",
                            padding: "2px 4px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={toggleSelectAll}
                            disabled={emails.length === 0}
                            title={allChecked ? "Deselect all" : "Select all"}
                          />
                        </th>
                        <th style={{ ...thStyle, width: colFrom }}>
                          From
                          <span
                            style={resizeHandle}
                            onMouseDown={startResizeFrom}
                          />
                        </th>
                        <th style={{ ...thStyle }}>Subject</th>
                        <th
                          style={{
                            ...thStyle,
                            width: colDate,
                            borderRight: "none",
                            position: "relative",
                          }}
                        >
                          Date
                          <span
                            style={{ ...resizeHandle, right: "auto", left: 0 }}
                            onMouseDown={startResizeDate}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              padding: 16,
                              textAlign: "center",
                              color: "#808080",
                            }}
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : emails.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              padding: 16,
                              textAlign: "center",
                              color: "#808080",
                            }}
                          >
                            {dict.admin.no_emails}
                          </td>
                        </tr>
                      ) : (
                        emails.map((email) => {
                          const sender = email.from_name || email.from_address;
                          const isSelected = selectedId === email.id;
                          const isChecked = checkedIds.has(email.id);
                          return (
                            <tr
                              key={email.id}
                              style={{
                                background: isSelected
                                  ? "#000080"
                                  : "transparent",
                                color: isSelected ? "#fff" : "#000",
                                cursor: "default",
                              }}
                              onClick={() => handleSelectEmail(email)}
                            >
                              <td
                                style={{
                                  padding: "1px 4px",
                                  borderBottom: "1px solid #e8e8e8",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCheck(email.id);
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleCheck(email.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td
                                style={{
                                  padding: "1px 6px",
                                  borderBottom: "1px solid #e8e8e8",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  maxWidth: 0,
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                  }}
                                >
                                  {!email.is_read && (
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        background: isSelected
                                          ? "#7fa8ff"
                                          : "#000080",
                                        flexShrink: 0,
                                      }}
                                    />
                                  )}
                                  <span
                                    style={{
                                      fontWeight: email.is_read
                                        ? "normal"
                                        : "bold",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {sender}
                                  </span>
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: "1px 6px",
                                  borderBottom: "1px solid #e8e8e8",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  maxWidth: 0,
                                }}
                              >
                                {email.subject || dict.admin.no_subject}
                                {email.attachment_count > 0 && (
                                  <span
                                    style={{
                                      marginLeft: 4,
                                      color: isSelected ? "#ccc" : "#808080",
                                      fontSize: 10,
                                    }}
                                  >
                                    [A]
                                  </span>
                                )}
                              </td>
                              <td
                                style={{
                                  padding: "1px 6px",
                                  borderBottom: "1px solid #e8e8e8",
                                  fontSize: 10,
                                  color: isSelected ? "#ccc" : "#808080",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {formatDate(email.received_at)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "3px 8px",
                      borderTop: "1px solid #808080",
                      background: "#c0c0c0",
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{ ...W98_BTN, opacity: page === 1 ? 0.5 : 1 }}
                    >
                      {dict.admin.prev}
                    </button>
                    <span style={{ fontSize: 10 }}>
                      {page}/{totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      style={{
                        ...W98_BTN,
                        opacity: page === totalPages ? 0.5 : 1,
                      }}
                    >
                      {dict.admin.next}
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT: Email detail pane */}
              <div
                className="w98em-detail"
                style={{ flex: 1, overflow: "hidden", background: "#fff" }}
              >
                {selectedId ? (
                  <EmailDetailPanel
                    key={selectedId}
                    emailId={selectedId}
                    onBack={() => setSelectedId(null)}
                    dict={dict}
                    win98
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#808080",
                      fontSize: 11,
                    }}
                  >
                    {dict.admin.select_email}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div
            style={{
              padding: "2px 6px",
              borderTop: "1px solid #808080",
              fontSize: 10,
              color: "#000",
              display: "flex",
              gap: 12,
              background: "#c0c0c0",
              flexShrink: 0,
            }}
          >
            <span>
              {folder.charAt(0) + folder.slice(1).toLowerCase()}: {total}{" "}
              message{total !== 1 ? "s" : ""}
            </span>
            {checkedIds.size > 0 && <span>{checkedIds.size} selected</span>}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppModal modal={modal} onClose={() => setModal(null)} dict={dict} />
      <div className="relative flex flex-col md:flex-row h-[calc(100vh-180px)] min-h-96 rounded-xl border border-slate-200 overflow-hidden bg-white">
        {/* ── Sync overlay ── */}
        {syncing && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl pointer-events-all">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-600">
              {dict.admin.syncing_emails}
            </p>
          </div>
        )}
        {/* ── Folder sidebar ── */}
        <div className="shrink-0 w-full md:w-44 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col">
          <div className="p-2 md:p-3 border-b border-slate-100 shrink-0">
            <button
              onClick={() => void handleSync()}
              disabled={syncing}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`}
              />
              {syncing ? dict.admin.syncing : dict.admin.sync_inbox}
            </button>
            {syncMsg && (
              <p className="mt-1.5 text-xs text-center text-blue-600">
                {syncMsg}
              </p>
            )}
          </div>
          <FolderSidebar
            active={folder}
            counts={counts}
            onSelect={handleFolderChange}
            dict={dict}
          />
        </div>

        {/* ── Email list ── */}
        <div
          className={`flex-1 md:flex-none md:w-72 md:shrink-0 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col ${
            selectedId ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleSelectAll}
              disabled={emails.length === 0}
              className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer shrink-0"
              title={allChecked ? "Deselect all" : "Select all"}
            />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex-1 truncate">
              {
                dict.admin[
                  `folder_${folder.toLowerCase()}` as keyof typeof dict.admin
                ] as string
              }{" "}
              · {total}
            </p>
            {checkedIds.size > 0 ? (
              <button
                onClick={() => void handleDeleteSelected(false)}
                disabled={deleting}
                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 shrink-0"
                title={`Delete ${selectAllFolder ? total : checkedIds.size} selected`}
              >
                <Trash2 className="w-3 h-3" />
                {selectAllFolder ? total : checkedIds.size}
              </button>
            ) : (
              total > 0 && (
                <button
                  onClick={() => void handleDeleteSelected(true)}
                  disabled={deleting}
                  className="text-red-400 hover:text-red-600 disabled:opacity-60 shrink-0"
                  title={dict.admin.delete_all_in_folder}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>

          {/* Select-all-pages banner */}
          {allChecked && totalPages > 1 && (
            <div className="px-3 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-700 flex items-center gap-2">
              {selectAllFolder ? (
                <>
                  <span className="flex-1">
                    {dict.admin.all_emails_selected.replace(
                      "{count}",
                      String(total),
                    )}
                  </span>
                  <button
                    onClick={() => {
                      setSelectAllFolder(false);
                      setCheckedIds(new Set());
                    }}
                    className="font-semibold underline hover:text-blue-900 shrink-0"
                  >
                    {dict.admin.clear}
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1">
                    {dict.admin.this_page_selected}
                  </span>
                  <button
                    onClick={() => setSelectAllFolder(true)}
                    className="font-semibold underline hover:text-blue-900 shrink-0 whitespace-nowrap"
                  >
                    {dict.admin.select_all.replace("{count}", String(total))}
                  </button>
                </>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-1">
                <p className="text-xs text-slate-400">{dict.admin.no_emails}</p>
                <p className="text-xs text-slate-400">
                  {dict.admin.click_sync}
                </p>
              </div>
            ) : (
              emails.map((email) => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  selected={selectedId === email.id}
                  checked={checkedIds.has(email.id)}
                  onToggle={toggleCheck}
                  onClick={() => handleSelectEmail(email)}
                  dict={dict}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                }}
                disabled={page === 1}
                className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-40"
              >
                {dict.admin.prev}
              </button>
              <span className="text-xs text-slate-400">
                {page}/{totalPages}
              </span>
              <button
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                disabled={page === totalPages}
                className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-40"
              >
                {dict.admin.next}
              </button>
            </div>
          )}
        </div>

        {/* ── Email detail ── */}
        <div
          className={`flex-1 min-w-0 flex-col ${
            selectedId ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedId ? (
            <EmailDetailPanel
              key={selectedId}
              emailId={selectedId}
              onBack={() => setSelectedId(null)}
              dict={dict}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
              <Inbox className="w-10 h-10 opacity-20" />
              <p className="text-sm">{dict.admin.select_email}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
