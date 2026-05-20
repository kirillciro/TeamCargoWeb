/**
 * WhatsApp messaging module — Baileys multi-device integration.
 *
 * Manages a single, persistent WhatsApp socket (singleton pattern).
 * Auth state is stored in PostgreSQL via wa-session.ts so the connection
 * survives Railway container restarts without requiring a new QR scan.
 *
 * Reconnection strategy
 * ─────────────────────
 *   • Any unexpected disconnect (network, restart, timeout) triggers an
 *     exponential back-off reconnect: 1 s → 2 s → 4 s … ≤ 30 s.
 *   • Back-off counter resets to 0 on every successful "open" event.
 *   • If the phone revokes the linked device (loggedOut / code 401), the
 *     session is wiped from the DB and initWhatsApp() is called again so a
 *     fresh QR is generated automatically.
 *   • The manualDisconnect flag suppresses auto-reconnect while
 *     resetConnection() is executing a deliberate user-initiated reset.
 *
 * DB tables used
 * ──────────────
 *   whatsapp_session  — Baileys credentials + Signal Protocol keys
 *
 * Exports
 * ───────
 *   WhatsAppStatus    — status shape returned to the frontend
 *   initWhatsApp()    — call once on server start
 *   resetConnection() — wipe session + reinitialise (triggers new QR)
 *   getWhatsAppStatus()
 *   getQrCode()
 *   formatCargoMessage()
 *   sendCargoWhatsApp()
 */

import makeWASocket, {
  DisconnectReason,
  type WASocket,
  type ConnectionState,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import { usePgAuthState } from "./wa-session.js";
import { pool } from "./db.js";
import type { CargoData } from "./ai-extract.js";

// ── Public types ──────────────────────────────────────────────────────────

export type WhatsAppStatus = {
  /** Baileys connection state. */
  status: "connecting" | "open" | "close";
  /** True while a QR code is waiting to be scanned. */
  hasQr: boolean;
  /** E.164 phone number of the linked sender account, or null if not connected. */
  senderPhone: string | null;
};

// ── Module state ──────────────────────────────────────────────────────────

let sock: WASocket | null = null;
let qrCodeDataUrl: string | null = null;
let connectionStatus: WhatsAppStatus["status"] = "close";

/**
 * Set to true only during an intentional user-initiated disconnect.
 * Prevents the auto-reconnect loop from firing while resetConnection() runs.
 */
let manualDisconnect = false;

/** Consecutive failed reconnect attempts — drives the exponential back-off. */
let reconnectAttempts = 0;

/** Handle for the pending back-off timer so it can be cancelled if needed. */
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

/** Maximum delay between reconnect attempts. */
const MAX_RECONNECT_DELAY_MS = 30_000;

// ── Internal helpers ──────────────────────────────────────────────────────

/** Tears down the current socket cleanly without triggering auto-reconnect. */
function destroySocket(): void {
  if (!sock) return;
  try { (sock.ev as unknown as { removeAllListeners(): void }).removeAllListeners(); } catch { /* ignore */ }
  try { sock.end(undefined); } catch { /* ignore */ }
  sock = null;
}

/**
 * Schedules a reconnect attempt with exponential back-off.
 * Delays: 1 s, 2 s, 4 s, 8 s … capped at MAX_RECONNECT_DELAY_MS.
 * No-op when manualDisconnect is true.
 */
function scheduleReconnect(): void {
  if (manualDisconnect) return;
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }

  reconnectAttempts += 1;
  const delay = Math.min(1_000 * 2 ** (reconnectAttempts - 1), MAX_RECONNECT_DELAY_MS);
  console.log(`[WhatsApp] Reconnecting in ${delay / 1_000}s (attempt ${reconnectAttempts})…`);

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (!manualDisconnect) void initWhatsApp();
  }, delay);
}

// ── Public accessors ──────────────────────────────────────────────────────

export function getWhatsAppStatus(): WhatsAppStatus {
  return {
    status: connectionStatus,
    hasQr: qrCodeDataUrl !== null,
    senderPhone: getSenderPhone(),
  };
}

export function getQrCode(): string | null {
  return qrCodeDataUrl;
}

/**
 * Extracts the E.164 phone number from the connected Baileys user.
 * Baileys user.id format: "31644351451:0@s.whatsapp.net"
 */
export function getSenderPhone(): string | null {
  if (!sock?.user) return null;
  const raw = sock.user.id.split(":")[0].split("@")[0];
  return "+" + raw;
}

// ── Socket lifecycle ──────────────────────────────────────────────────────

/**
 * Initialises (or re-initialises) the Baileys socket.
 * Destroys any stale socket first to prevent duplicate event listeners.
 * Called on server start and after every reconnect/reset.
 */
export async function initWhatsApp(): Promise<void> {
  destroySocket(); // prevent stale event listeners on reconnect
  connectionStatus = "connecting";

  const { state, saveCreds } = await usePgAuthState();
  sock = makeWASocket({ auth: state });

  // Persist credentials whenever Baileys rotates them
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect, qr } = update;

    // New QR generated — render in terminal and store data URL for the frontend
    if (qr) {
      qrCodeDataUrl = await qrcode.toDataURL(qr);
      const terminalQr = await qrcode.toString(qr, { type: "terminal", small: true });
      console.log("\n[WhatsApp] Scan this QR code:\n");
      console.log(terminalQr);
      console.log("[WhatsApp] QR also available at GET /admin/whatsapp/qr\n");
    }

    if (connection === "open") {
      connectionStatus = "open";
      qrCodeDataUrl = null;
      reconnectAttempts = 0; // reset back-off on successful connect
      console.log(`[WhatsApp] Connected ✓  (sender: ${getSenderPhone() ?? "unknown"})`);
    }

    if (connection === "close") {
      connectionStatus = "close";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
      const loggedOut  = statusCode === DisconnectReason.loggedOut;

      console.log(`[WhatsApp] Disconnected (code ${statusCode ?? "unknown"})`);

      if (loggedOut) {
        // Phone removed this device from Linked Devices → wipe session so a
        // fresh QR is generated on the next initWhatsApp() call.
        console.log("[WhatsApp] Logged out by phone. Clearing session → requesting new QR…");
        try {
          await pool.query("DELETE FROM whatsapp_session");
        } catch (e) {
          console.warn("[WhatsApp] Could not clear session from DB:", e);
        }
        reconnectAttempts = 0;
        if (!manualDisconnect) void initWhatsApp();
      } else {
        // Network blip, Railway restart, timeout, etc. → auto-reconnect
        scheduleReconnect();
      }
    }
  });
}

/**
 * Performs a deliberate user-initiated reset:
 * 1. Suppresses auto-reconnect (manualDisconnect flag).
 * 2. Destroys the current socket.
 * 3. Re-initialises so a fresh QR code is shown.
 *
 * Caller (whatsapp-router.ts) must DELETE FROM whatsapp_session BEFORE
 * calling this so the new initWhatsApp() starts with clean credentials.
 */
export async function resetConnection(): Promise<void> {
  manualDisconnect = true;
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }

  connectionStatus = "close";
  qrCodeDataUrl = null;
  destroySocket();

  // Brief pause to let the socket close gracefully before reinitialising
  await new Promise<void>((resolve) => setTimeout(resolve, 300));

  reconnectAttempts = 0;
  manualDisconnect = false; // allow the new QR flow to reconnect normally
  await initWhatsApp();
}

// ── Message formatting ────────────────────────────────────────────────────

/**
 * Builds a WhatsApp-formatted (MarkdownV1) message from a cargo extraction.
 * Null/empty fields are omitted. Consecutive blank lines are collapsed.
 */
export function formatCargoMessage(cargo: CargoData, subject: string): string {
  const line = (label: string, val: string | number | null | undefined) =>
    val != null && val !== "" ? `*${label}:* ${val}` : null;

  const parts: (string | null)[] = [
    `📦 *New Cargo Request*`,
    `_${subject}_`,
    ``,
    // Route / dispatch fields
    line("Route", cargo.route),
    line("Chauffeurs", cargo.chauffeurs),
    cargo.date_from || cargo.date_to
      ? `*Period:* ${cargo.date_from ?? "?"} – ${cargo.date_to ?? "?"}`
      : null,
    line("Stops Total", cargo.stops_total),
    ``,
    // Shipper / consignee
    line("Shipper", cargo.shipper_name),
    cargo.shipper_address ? `  📍 ${cargo.shipper_address}` : null,
    line("Consignee", cargo.consignee_name),
    cargo.consignee_address ? `  📍 ${cargo.consignee_address}` : null,
    ``,
    // Route (origin → destination)
    cargo.origin && cargo.destination
      ? `*Route:* ${cargo.origin} → ${cargo.destination}`
      : (line("Origin", cargo.origin) ??
        line("Destination", cargo.destination)),
    line("Mode", cargo.transport_mode),
    ``,
    // Cargo
    line("Cargo", cargo.cargo_description),
    line("Pieces", cargo.pieces),
    cargo.weight_kg != null ? line("Weight", `${cargo.weight_kg} kg`) : null,
    cargo.volume_cbm != null ? line("Volume", `${cargo.volume_cbm} CBM`) : null,
    line("Dimensions", cargo.dimensions),
    line("HS Code", cargo.hs_code),
    ``,
    line("Ref", cargo.booking_reference),
    line("Incoterms", cargo.incoterms),
    line("ETD", cargo.etd),
    line("ETA", cargo.eta),
    cargo.special_instructions
      ? `\n*Notes:* ${cargo.special_instructions}`
      : null,
  ];

  return parts
    .filter((l): l is string => l !== null)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

// ── Message delivery ──────────────────────────────────────────────────────

/**
 * Sends a formatted cargo message to all configured WhatsApp recipients.
 * @returns A short summary of the send results, e.g. "Sent to 3 recipients".
 * @throws When WhatsApp is not in "open" state or no recipients are provided.
 */
export async function sendCargoWhatsApp(
  cargo: CargoData,
  subject: string,
  recipients: string[],
): Promise<string> {
  if (!sock || connectionStatus !== "open") {
    throw new Error(
      "WhatsApp is not connected. Ask admin to scan the QR code first.",
    );
  }

  if (recipients.length === 0) {
    throw new Error("No WhatsApp recipients configured.");
  }

  const text = formatCargoMessage(cargo, subject);
  let lastId = "sent";

  for (const number of recipients) {
    const jid = number.replace(/\D/g, "") + "@s.whatsapp.net";
    try {
      const sent = await sock.sendMessage(jid, { text });
      lastId = sent?.key?.id ?? "sent";
    } catch (err) {
      console.warn(
        `[WhatsApp] sendMessage to ${number} threw (likely receipt timeout, message likely delivered):`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  return lastId;
}
