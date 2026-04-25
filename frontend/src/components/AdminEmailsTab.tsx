"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/auth-client";
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

// ── Modal ────────────────────────────────────────────────────────────────────

type ModalState =
  | { type: "confirm"; message: string; onConfirm: () => void }
  | { type: "error"; message: string }
  | null;

function AppModal({
  modal,
  onClose,
}: {
  modal: ModalState;
  onClose: () => void;
}) {
  if (!modal) return null;
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
                  Are you sure?
                </p>
                <p className="mt-1 text-sm text-slate-500">{modal.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  modal.onConfirm();
                  onClose();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Delete
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
                  Something went wrong
                </p>
                <p className="mt-1 text-sm text-slate-500">{modal.message}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                OK
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
  label: string;
  Icon: React.ElementType;
  color: string;
}[] = [
  { key: "INBOX", label: "Inbox", Icon: Inbox, color: "text-blue-600" },
  { key: "SPAM", label: "Spam", Icon: ShieldAlert, color: "text-orange-500" },
  { key: "TRASH", label: "Trash", Icon: Trash2, color: "text-slate-500" },
];

function FolderSidebar({
  active,
  counts,
  onSelect,
}: {
  active: Folder;
  counts: FolderCounts;
  onSelect: (f: Folder) => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5 p-2">
      {FOLDER_META.map(({ key, label, Icon, color }) => {
        const unread = counts[key]?.unread ?? 0;
        const total = counts[key]?.total ?? 0;
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left ${
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
}: {
  email: EmailSummary;
  selected: boolean;
  checked: boolean;
  onToggle: (id: number) => void;
  onClick: () => void;
}) {
  const sender = email.from_name || email.from_address;
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
            {email.subject || "(no subject)"}
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
}: {
  status: Extraction["status"] | "none";
}) {
  const map: Record<
    string,
    { label: string; cls: string; Icon: React.ElementType }
  > = {
    none: { label: "Not extracted", cls: "text-slate-400", Icon: Clock },
    pending: { label: "Pending", cls: "text-yellow-500", Icon: Clock },
    extracting: { label: "Extracting…", cls: "text-blue-500", Icon: Loader2 },
    extracted: { label: "Extracted", cls: "text-green-600", Icon: CheckCircle },
    failed: { label: "Failed", cls: "text-red-500", Icon: XCircle },
    sent: { label: "Sent ✓", cls: "text-emerald-600", Icon: CheckCircle },
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
      {m.label}
    </span>
  );
}

// ── Extraction data grid ──────────────────────────────────────────────────────

function ExtractionGrid({ data }: { data: CargoData }) {
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
    return (
      <p className="text-xs text-slate-400 italic">
        No data could be extracted from this document.
      </p>
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
}: {
  emailId: number;
  attachment: Attachment;
  existingExtraction: Extraction | undefined;
  onExtractionUpdate: (e: Extraction) => void;
}) {
  const [extraction, setExtraction] = useState<Extraction | undefined>(
    existingExtraction,
  );
  const [extracting, setExtracting] = useState(false);
  const [sending, setSending] = useState(false);
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
    try {
      const res = await fetchWithAuth(
        `/api/admin/extractions/${extraction.id}/send-whatsapp`,
        { method: "POST" },
      );
      if (!res.ok) throw new Error("Failed");
      const updated: Extraction = { ...extraction, status: "sent" };
      setExtraction(updated);
      onExtractionUpdate(updated);
    } finally {
      setSending(false);
    }
  };

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
          {extraction && <ExtractionBadge status={extraction.status} />}

          {(!extraction || extraction.status === "failed") && (
            <button
              onClick={() => void handleExtract()}
              disabled={extracting}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {extracting && <Loader2 className="w-3 h-3 animate-spin" />}
              Extract with AI
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
              Re-extract
            </button>
          )}

          {extraction?.status === "extracting" && (
            <span className="text-xs text-blue-500 animate-pulse">
              Processing…
            </span>
          )}
        </div>
      </div>

      {/* Extracted data */}
      {(extraction?.status === "extracted" || extraction?.status === "sent") &&
        extraction.extracted_json && (
          <ExtractionGrid data={extraction.extracted_json} />
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
          {sending ? "Sending…" : "Send to WhatsApp"}
        </button>
      )}

      {extraction?.status === "sent" && (
        <p className="text-xs text-emerald-600 font-medium">
          ✓ Sent to WhatsApp
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
}: {
  emailId: number;
  onBack: () => void;
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

  return (
    <div className="flex flex-col h-full">
      {/* Back button (visible on mobile) */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 px-4 py-3 text-sm text-slate-500 hover:text-slate-700 md:hidden border-b border-slate-100"
      >
        <ChevronLeft className="w-4 h-4" /> Back
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
              {detail.email.subject || "(no subject)"}
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
              <p className="text-sm text-slate-400 italic">No message body.</p>
            )}
          </div>

          {/* PDF attachments */}
          {detail.attachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                PDF Attachments ({detail.attachments.length})
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

export default function AdminEmailsTab() {
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
    const message = isFolder
      ? `All emails in ${folder.charAt(0) + folder.slice(1).toLowerCase()} will be permanently deleted. This cannot be undone.`
      : `${count} selected email${count === 1 ? "" : "s"} will be permanently deleted. This cannot be undone.`;
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
      setSyncMsg(`Sync complete — ${data.newEmails ?? 0} new email(s).`);
      setPage(1);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setSyncMsg(err instanceof Error ? err.message : "Sync failed.");
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

  return (
    <>
      <AppModal modal={modal} onClose={() => setModal(null)} />
      <div className="relative flex h-[calc(100vh-180px)] min-h-96 rounded-xl border border-slate-200 overflow-hidden bg-white">
        {/* ── Sync overlay ── */}
        {syncing && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl pointer-events-all">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-600">
              Syncing emails…
            </p>
          </div>
        )}
        {/* ── Folder sidebar ── */}
        <div className="w-44 shrink-0 border-r border-slate-100 flex flex-col">
          <div className="p-3 border-b border-slate-100">
            <button
              onClick={() => void handleSync()}
              disabled={syncing}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`}
              />
              {syncing ? "Syncing…" : "Sync inbox"}
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
          />
        </div>

        {/* ── Email list ── */}
        <div
          className={`w-72 shrink-0 border-r border-slate-100 flex flex-col ${
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
              {folder.charAt(0) + folder.slice(1).toLowerCase()} · {total}
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
                  title="Delete all in folder"
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
                    All <strong>{total}</strong> emails selected.
                  </span>
                  <button
                    onClick={() => {
                      setSelectAllFolder(false);
                      setCheckedIds(new Set());
                    }}
                    className="font-semibold underline hover:text-blue-900 shrink-0"
                  >
                    Clear
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1">This page selected.</span>
                  <button
                    onClick={() => setSelectAllFolder(true)}
                    className="font-semibold underline hover:text-blue-900 shrink-0 whitespace-nowrap"
                  >
                    Select all {total}
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
                <p className="text-xs text-slate-400">No emails here.</p>
                <p className="text-xs text-slate-400">Click Sync inbox.</p>
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
                ← Prev
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
                Next →
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
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
              <Inbox className="w-10 h-10 opacity-20" />
              <p className="text-sm">Select an email to read</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
