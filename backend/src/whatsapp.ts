import makeWASocket, {
  DisconnectReason,
  type WASocket,
  type ConnectionState,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import { usePgAuthState } from "./wa-session.js";
import { pool } from "./db.js";
import type { CargoData } from "./ai-extract.js";

// ── Singleton connection ───────────────────────────────────────────────────

let sock: WASocket | null = null;
let qrCodeDataUrl: string | null = null;
let connectionStatus: "connecting" | "open" | "close" = "close";

/** Set to true only during intentional user-initiated disconnect; suppresses auto-reconnect. */
let manualDisconnect = false;

/** Tracks consecutive reconnect attempts for exponential back-off. */
let reconnectAttempts = 0;

/** Handle used to cancel any pending back-off timer. */
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

const MAX_RECONNECT_DELAY_MS = 30_000; // cap at 30 s

export function getWhatsAppStatus() {
  return {
    status: connectionStatus,
    hasQr: qrCodeDataUrl !== null,
    senderPhone: getSenderPhone(),
  };
}

export function getQrCode() {
  return qrCodeDataUrl;
}

/** Returns the phone number of the currently linked WhatsApp account. */
export function getSenderPhone(): string | null {
  if (!sock?.user) return null;
  // user.id format: "31644351451:0@s.whatsapp.net"
  const raw = sock.user.id.split(":")[0].split("@")[0];
  return "+" + raw;
}

/** Cleanly tears down the current socket without triggering auto-reconnect. */
function destroySocket() {
  if (!sock) return;
  try { (sock.ev as unknown as { removeAllListeners(): void }).removeAllListeners(); } catch { /* ignore */ }
  try { sock.end(undefined); } catch { /* ignore */ }
  sock = null;
}

/** Schedules a reconnect with exponential back-off (1 s → 2 s → 4 s … ≤ 30 s). */
function scheduleReconnect() {
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

/**
 * Clears the current connection and reinitialises so a fresh QR is shown.
 * Called when the user clicks "Change sender number".
 * index.ts must DELETE FROM whatsapp_session BEFORE calling this.
 */
export async function resetConnection(): Promise<void> {
  manualDisconnect = true;         // stop any in-flight reconnect
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  connectionStatus = "close";
  qrCodeDataUrl = null;
  destroySocket();
  await new Promise<void>((r) => setTimeout(r, 300));
  reconnectAttempts = 0;
  manualDisconnect = false;        // allow the new QR flow to reconnect
  await initWhatsApp();
}

export async function initWhatsApp(): Promise<void> {
  destroySocket(); // always clean up stale socket before creating a new one
  connectionStatus = "connecting";
  const { state, saveCreds } = await usePgAuthState();

  sock = makeWASocket({ auth: state });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCodeDataUrl = await qrcode.toDataURL(qr);
      const terminalQr = await qrcode.toString(qr, { type: "terminal", small: true });
      console.log("\n[WhatsApp] Scan QR code:\n");
      console.log(terminalQr);
      console.log("[WhatsApp] (also available as image at GET /admin/whatsapp/qr)\n");
    }

    if (connection === "open") {
      connectionStatus = "open";
      qrCodeDataUrl = null;
      reconnectAttempts = 0; // reset back-off counter on successful connect
      console.log("[WhatsApp] Connected ✓");
    }

    if (connection === "close") {
      connectionStatus = "close";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;

      console.log(`[WhatsApp] Disconnected (code ${statusCode ?? "unknown"})`);

      if (loggedOut) {
        // Phone removed this device from Linked Devices — wipe session so fresh QR is shown
        console.log("[WhatsApp] Logged out by phone. Clearing session and requesting new QR…");
        try {
          await pool.query("DELETE FROM whatsapp_session");
        } catch (e) {
          console.warn("[WhatsApp] Could not clear session:", e);
        }
        reconnectAttempts = 0;
        if (!manualDisconnect) void initWhatsApp();
      } else {
        // Any other close reason (network blip, Railway restart, timeout) → reconnect
        scheduleReconnect();
      }
    }
  });
}

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
