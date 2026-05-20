/**
 * Express router — WhatsApp admin endpoints.
 *
 * All routes require a valid JWT (requireAuth) and admin role (requireAdmin).
 * Mounted in index.ts: app.use(waRouter)
 *
 * Routes
 * ──────
 *   GET    /admin/whatsapp/status              → connection state + sender phone
 *   GET    /admin/whatsapp/qr                  → QR code as base64 data URL
 *   POST   /admin/whatsapp/disconnect          → wipe session + force fresh QR
 *   GET    /admin/whatsapp/recipients          → list recipient phone numbers
 *   POST   /admin/whatsapp/recipients          → add a recipient (E.164)
 *   DELETE /admin/whatsapp/recipients/:number  → remove a recipient
 *   GET    /admin/whatsapp/messages            → filtered message log
 *   DELETE /admin/whatsapp/messages/:id        → delete single log entry
 *   DELETE /admin/whatsapp/messages            → delete selected or all entries
 *
 * DB tables used
 * ──────────────
 *   app_settings        — stores recipient list under key='whatsapp_recipients'
 *   whatsapp_session    — Baileys auth state (managed by wa-session.ts)
 *   whatsapp_messages   — sent-message log (INSERT handled in the send route)
 */

import { Router } from "express";
import { pool } from "./db.js";
import { requireAuth, requireAdmin, type AuthedRequest } from "./middleware.js";
import {
  getWhatsAppStatus,
  getQrCode,
  resetConnection,
} from "./whatsapp.js";

// ── Validation ────────────────────────────────────────────────────────────

/** E.164 phone number regex — must start with +, 7–15 digits total. */
const PHONE_RE = /^\+[1-9]\d{6,14}$/;

// ── Router ────────────────────────────────────────────────────────────────

export const waRouter = Router();

// ── Connection management ─────────────────────────────────────────────────

/**
 * GET /admin/whatsapp/status
 * Returns the current connection state, whether a QR is ready, and the
 * sender phone number (if connected).
 */
waRouter.get(
  "/admin/whatsapp/status",
  requireAuth,
  requireAdmin,
  (_req: AuthedRequest, res) => {
    res.json(getWhatsAppStatus());
  },
);

/**
 * GET /admin/whatsapp/qr
 * Returns the QR code as a base64 data URL so the frontend can render it as
 * an <img>. 404 when already connected or still initialising.
 */
waRouter.get(
  "/admin/whatsapp/qr",
  requireAuth,
  requireAdmin,
  (_req: AuthedRequest, res) => {
    const qr = getQrCode();
    if (!qr) {
      res.status(404).json({
        message: "No QR available — already connected or still initialising.",
      });
      return;
    }
    res.json({ qr });
  },
);

/**
 * POST /admin/whatsapp/disconnect
 * Wipes the stored Baileys session from the DB and triggers a fresh
 * initialisation so a new QR code is generated.
 */
waRouter.post(
  "/admin/whatsapp/disconnect",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    try {
      await pool.query("DELETE FROM whatsapp_session");
      await resetConnection();
      res.json({ success: true });
    } catch (err) {
      console.error("[WhatsApp] disconnect failed:", err);
      res.status(500).json({ message: "Failed to disconnect." });
    }
  },
);

// ── Recipient management ──────────────────────────────────────────────────

/**
 * GET /admin/whatsapp/recipients
 * Returns the list of E.164 phone numbers that receive cargo notifications.
 */
waRouter.get(
  "/admin/whatsapp/recipients",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'whatsapp_recipients'",
    );
    const numbers: string[] = result.rows[0]?.value?.numbers ?? [];
    res.json({ numbers });
  },
);

/**
 * POST /admin/whatsapp/recipients
 * Adds a new E.164 phone number to the recipient list.
 * Body: { number: string }
 */
waRouter.post(
  "/admin/whatsapp/recipients",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const { number } = req.body as { number?: string };

    if (!number || !PHONE_RE.test(number)) {
      res.status(400).json({
        message: "Invalid number. Use E.164 format, e.g. +393497080551",
      });
      return;
    }

    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'whatsapp_recipients'",
    );
    const current: string[] = result.rows[0]?.value?.numbers ?? [];

    if (current.includes(number)) {
      res.status(409).json({ message: "Number already in the list." });
      return;
    }

    const updated = [...current, number];
    await pool.query(
      `INSERT INTO app_settings (key, value, updated_at)
       VALUES ('whatsapp_recipients', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify({ numbers: updated })],
    );
    res.json({ numbers: updated });
  },
);

/**
 * DELETE /admin/whatsapp/recipients/:number
 * Removes a phone number from the recipient list.
 * The number must be URL-encoded (e.g. %2B393497080551 for +393497080551).
 */
waRouter.delete(
  "/admin/whatsapp/recipients/:number",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const number = decodeURIComponent(req.params.number as string);

    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'whatsapp_recipients'",
    );
    const current: string[] = result.rows[0]?.value?.numbers ?? [];
    const updated = current.filter((n) => n !== number);

    await pool.query(
      `INSERT INTO app_settings (key, value, updated_at)
       VALUES ('whatsapp_recipients', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      [JSON.stringify({ numbers: updated })],
    );
    res.json({ numbers: updated });
  },
);

// ── Message log ───────────────────────────────────────────────────────────

/**
 * GET /admin/whatsapp/messages
 * Returns the sent-message log, newest first, capped at 500 rows.
 * Query params: year, month, day (all optional; integers; UTC-based EXTRACT).
 */
waRouter.get(
  "/admin/whatsapp/messages",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const { year, month, day } = req.query as Record<string, string | undefined>;

    const conditions: string[] = [];
    const params: number[] = [];

    if (year)  { params.push(parseInt(year,  10)); conditions.push(`EXTRACT(YEAR  FROM sent_at) = $${params.length}`); }
    if (month) { params.push(parseInt(month, 10)); conditions.push(`EXTRACT(MONTH FROM sent_at) = $${params.length}`); }
    if (day)   { params.push(parseInt(day,   10)); conditions.push(`EXTRACT(DAY   FROM sent_at) = $${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT id, extraction_id, subject, message_text, recipients, sent_by, sent_at
       FROM whatsapp_messages
       ${where}
       ORDER BY sent_at DESC
       LIMIT 500`,
      params,
    );
    res.json({ messages: result.rows });
  },
);

/**
 * DELETE /admin/whatsapp/messages/:id
 * Deletes a single message log entry by primary key.
 */
waRouter.delete(
  "/admin/whatsapp/messages/:id",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = parseInt(String(req.params.id), 10);
    await pool.query("DELETE FROM whatsapp_messages WHERE id = $1", [id]);
    res.json({ success: true });
  },
);

/**
 * DELETE /admin/whatsapp/messages
 * Deletes message log entries.
 * Body: { ids: number[] } → delete only those rows.
 * Body: {}               → delete ALL rows (destructive, confirmation required on client).
 */
waRouter.delete(
  "/admin/whatsapp/messages",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const ids = (req.body as { ids?: number[] } | undefined)?.ids;

    if (Array.isArray(ids) && ids.length > 0) {
      await pool.query(
        "DELETE FROM whatsapp_messages WHERE id = ANY($1::int[])",
        [ids],
      );
    } else {
      await pool.query("DELETE FROM whatsapp_messages");
    }
    res.json({ success: true });
  },
);
