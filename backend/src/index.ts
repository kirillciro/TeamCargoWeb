import "dotenv/config";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import crypto from "crypto";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { pool } from "./db.js";
import {
  generateTokens,
  generateSecureToken,
  hashToken,
  verifyRefreshToken,
} from "./auth.js";
import { requireAuth, requireAdmin, type AuthedRequest } from "./middleware.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email.js";
import type { SafeUser } from "./types.js";
import { syncAllFolders, imapDeleteEmails } from "./email-sync.js";
import { extractFromPdfBuffer, type CargoData } from "./ai-extract.js";
import { sendCargoWhatsApp } from "./whatsapp.js";
import {
  translateHeroTexts,
  type HeroTexts,
  type HeroTranslations,
} from "./hero-translate.js";
import {
  translateServicesTexts,
  type ServicesTexts,
  type ServicesTranslations,
} from "./services-translate.js";
import {
  translateAboutTexts,
  type AboutTexts,
  type AboutTranslations,
} from "./about-translate.js";
import {
  translateHousingTexts,
  type HousingTexts,
  type HousingTranslations,
} from "./housing-translate.js";
import {
  translateContactTexts,
  type ContactTexts,
  type ContactTranslations,
} from "./contact-translate.js";
import { getAnalyticsSummary } from "./analytics.js";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL ?? "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://localhost:3000",
  "https://localhost:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// ── Helpers ────────────────────────────────────────────────────────────────

const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function setRefreshCookie(res: express.Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_COOKIE_MAX_AGE,
    path: "/",
  });
}

function clearRefreshCookie(res: express.Response) {
  res.clearCookie("refreshToken", { path: "/" });
}

type UserRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_verified: boolean;
  provider: string;
  created_at: Date;
  avatar_url: string | null;
  license_front_url: string | null;
  license_back_url: string | null;
  passport_front_url: string | null;
  passport_back_url: string | null;
};

function mapUser(row: UserRow): SafeUser {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role,
    isVerified: row.is_verified,
    provider: row.provider,
    createdAt: row.created_at.toISOString(),
    avatarUrl: row.avatar_url ?? null,
    licenseFrontUrl: row.license_front_url ?? null,
    licenseBackUrl: row.license_back_url ?? null,
    passportFrontUrl: row.passport_front_url ?? null,
    passportBackUrl: row.passport_back_url ?? null,
  };
}

function frontendUrl(): string {
  return process.env.FRONTEND_URL ?? "http://localhost:3000";
}

function backendUrl(): string {
  return (
    process.env.BACKEND_URL ?? `http://localhost:${process.env.PORT ?? 4000}`
  );
}

// ── Validation ─────────────────────────────────────────────────────────────

const registerSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(200),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(6).max(100),
});

// ── Health ─────────────────────────────────────────────────────────────────

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch {
    res.status(500).json({ status: "db_error" });
  }
});

// ── Auth: Register ─────────────────────────────────────────────────────────

app.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Invalid input", issues: parsed.error.issues });
    return;
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase()],
    );
    if (existing.rowCount && existing.rowCount > 0) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = generateSecureToken();
    const verifyTokenHash = hashToken(verifyToken);
    const verifyExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const inserted = await pool.query(
      `INSERT INTO users
         (first_name, last_name, email, password_hash, is_verified, provider,
          email_verification_token_hash, email_verification_expires_at)
       VALUES ($1, $2, $3, $4, FALSE, 'email', $5, $6)
       RETURNING id`,
      [
        firstName,
        lastName,
        email.toLowerCase(),
        passwordHash,
        verifyTokenHash,
        verifyExpiresAt,
      ],
    );

    const userId = (inserted.rows[0] as { id: number }).id;
    const verifyUrl = `${backendUrl()}/auth/verify-email?token=${verifyToken}&id=${userId}`;

    sendVerificationEmail(email.toLowerCase(), firstName, verifyUrl)
      .then(() =>
        console.log(
          `[register] verification email sent → ${email.toLowerCase()}`,
        ),
      )
      .catch((err) =>
        console.error(
          `[register] email send failed (non-blocking) → ${email.toLowerCase()}:`,
          err.message,
        ),
      );

    res.status(201).json({
      message:
        "Account created. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("[register]", err);
    res.status(500).json({ message: "Could not create account" });
  }
});

// ── Auth: Login ────────────────────────────────────────────────────────────

app.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Invalid input", issues: parsed.error.issues });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, password_hash, role,
              is_verified, provider, created_at, avatar_url
       FROM users WHERE email = $1 AND provider = 'email' LIMIT 1`,
      [email.toLowerCase()],
    );

    if (!result.rowCount || result.rowCount === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const row = result.rows[0] as UserRow & { password_hash: string };

    const validPassword = await bcrypt.compare(password, row.password_hash);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (!row.is_verified) {
      res.status(403).json({
        message:
          "Please verify your email address before signing in. Check your inbox.",
      });
      return;
    }

    const user = mapUser(row);
    const tokens = generateTokens({
      sub: String(user.id),
      email: user.email,
      role: user.role,
    });

    await pool.query("UPDATE users SET refresh_token_hash = $1 WHERE id = $2", [
      hashToken(tokens.refreshToken),
      user.id,
    ]);

    setRefreshCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken, user });
  } catch (err) {
    console.error("[login]", err);
    res.status(500).json({ message: "Could not log in" });
  }
});

// ── Auth: Verify email ─────────────────────────────────────────────────────

app.get("/auth/verify-email", async (req, res) => {
  const { token, id } = req.query as { token?: string; id?: string };
  const userId = Number(id);

  if (!token || !id || isNaN(userId)) {
    res.redirect(`${frontendUrl()}/en?verified=invalid`);
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, email_verification_token_hash, email_verification_expires_at, is_verified
       FROM users WHERE id = $1 LIMIT 1`,
      [userId],
    );

    if (!result.rowCount || result.rowCount === 0) {
      res.redirect(`${frontendUrl()}/en?verified=invalid`);
      return;
    }

    const row = result.rows[0] as {
      id: number;
      email_verification_token_hash: string | null;
      email_verification_expires_at: Date | null;
      is_verified: boolean;
    };

    if (row.is_verified) {
      res.redirect(`${frontendUrl()}/en?verified=already`);
      return;
    }

    const incoming = hashToken(token);
    if (
      !row.email_verification_token_hash ||
      row.email_verification_token_hash !== incoming
    ) {
      res.redirect(`${frontendUrl()}/en?verified=invalid`);
      return;
    }

    if (
      !row.email_verification_expires_at ||
      new Date() > row.email_verification_expires_at
    ) {
      res.redirect(`${frontendUrl()}/en?verified=expired`);
      return;
    }

    await pool.query(
      `UPDATE users
       SET is_verified = TRUE,
           email_verification_token_hash = NULL,
           email_verification_expires_at = NULL
       WHERE id = $1`,
      [userId],
    );

    // Fetch full user to issue tokens so the frontend can auto-login
    const userResult = await pool.query(
      `SELECT id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url
       FROM users WHERE id = $1 LIMIT 1`,
      [userId],
    );
    const verifiedUser = mapUser(userResult.rows[0] as UserRow);
    const tokens = generateTokens({
      sub: String(verifiedUser.id),
      email: verifiedUser.email,
      role: verifiedUser.role,
    });

    // Set refresh token as httpOnly cookie
    res.cookie("tc_refresh", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Pass accessToken in the redirect so frontend can store it and auto-login
    res.redirect(
      `${frontendUrl()}/en?verified=success&token=${encodeURIComponent(tokens.accessToken)}`,
    );
  } catch (err) {
    console.error("[verify-email]", err);
    res.redirect(`${frontendUrl()}/en?verified=error`);
  }
});

// ── Auth: Resend verification email ───────────────────────────────────────

app.post("/auth/resend-verification", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, first_name, email, is_verified FROM users
       WHERE email = $1 AND provider = 'email' LIMIT 1`,
      [(email as string).toLowerCase()],
    );

    if (!result.rowCount || result.rowCount === 0) {
      res.json({ message: "If that email exists, a new link has been sent." });
      return;
    }

    const row = result.rows[0] as {
      id: number;
      first_name: string;
      email: string;
      is_verified: boolean;
    };

    if (row.is_verified) {
      res.json({ message: "Account is already verified." });
      return;
    }

    const verifyToken = generateSecureToken();
    const verifyTokenHash = hashToken(verifyToken);
    const verifyExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      `UPDATE users
       SET email_verification_token_hash = $1,
           email_verification_expires_at = $2
       WHERE id = $3`,
      [verifyTokenHash, verifyExpiresAt, row.id],
    );

    const verifyUrl = `${backendUrl()}/auth/verify-email?token=${verifyToken}&id=${row.id}`;

    sendVerificationEmail(row.email, row.first_name, verifyUrl)
      .then(() =>
        console.log(`[resend-verification] email sent → ${row.email}`),
      )
      .catch((err) =>
        console.error(
          `[resend-verification] email failed → ${row.email}:`,
          err.message,
        ),
      );

    res.json({ message: "If that email exists, a new link has been sent." });
  } catch (err) {
    console.error("[resend-verification]", err);
    res.status(500).json({ message: "Could not resend verification email" });
  }
});

// ── Auth: Forgot password ──────────────────────────────────────────────────

app.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, first_name, email FROM users
       WHERE email = $1 AND provider = 'email' LIMIT 1`,
      [(email as string).toLowerCase()],
    );

    if (!result.rowCount || result.rowCount === 0) {
      res.json({
        message: "If that email is registered, a reset link has been sent.",
      });
      return;
    }

    const row = result.rows[0] as {
      id: number;
      first_name: string;
      email: string;
    };

    const resetToken = generateSecureToken();
    const resetTokenHash = hashToken(resetToken);
    const resetExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await pool.query(
      `UPDATE users
       SET password_reset_token_hash = $1,
           password_reset_expires_at = $2
       WHERE id = $3`,
      [resetTokenHash, resetExpiresAt, row.id],
    );

    const resetUrl = `${frontendUrl()}/en/reset-password?token=${resetToken}&id=${row.id}`;

    sendPasswordResetEmail(row.email, row.first_name, resetUrl).catch((err) =>
      console.error("[forgot-password] email failed:", err),
    );

    res.json({
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (err) {
    console.error("[forgot-password]", err);
    res.status(500).json({ message: "Could not process request" });
  }
});

// ── Auth: Reset password ───────────────────────────────────────────────────

app.post("/auth/reset-password", async (req, res) => {
  const { token, id, newPassword } = req.body as {
    token?: string;
    id?: number;
    newPassword?: string;
  };

  if (!token || !id || !newPassword || (newPassword as string).length < 8) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, password_reset_token_hash, password_reset_expires_at
       FROM users WHERE id = $1 LIMIT 1`,
      [id],
    );

    if (!result.rowCount || result.rowCount === 0) {
      res.status(400).json({ message: "Invalid or expired reset link" });
      return;
    }

    const row = result.rows[0] as {
      id: number;
      password_reset_token_hash: string | null;
      password_reset_expires_at: Date | null;
    };

    const incoming = hashToken(token);
    if (
      !row.password_reset_token_hash ||
      row.password_reset_token_hash !== incoming
    ) {
      res.status(400).json({ message: "Invalid or expired reset link" });
      return;
    }

    if (
      !row.password_reset_expires_at ||
      new Date() > row.password_reset_expires_at
    ) {
      res.status(400).json({ message: "Reset link has expired" });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password_hash = $1,
           password_reset_token_hash = NULL,
           password_reset_expires_at = NULL,
           refresh_token_hash = NULL
       WHERE id = $2`,
      [passwordHash, row.id],
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("[reset-password]", err);
    res.status(500).json({ message: "Could not reset password" });
  }
});

// ── Auth: Refresh token rotation ───────────────────────────────────────────

app.post("/auth/refresh", async (req, res) => {
  const rawToken = req.cookies?.refreshToken as string | undefined;
  if (!rawToken) {
    res.status(401).json({ message: "Refresh token missing" });
    return;
  }

  try {
    const decoded = verifyRefreshToken(rawToken);

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, role, is_verified, provider,
              created_at, avatar_url, refresh_token_hash
       FROM users WHERE id = $1 LIMIT 1`,
      [decoded.sub],
    );

    if (!result.rowCount || result.rowCount === 0) {
      clearRefreshCookie(res);
      res.status(401).json({ message: "User not found" });
      return;
    }

    const row = result.rows[0] as UserRow & {
      refresh_token_hash: string | null;
    };

    const incomingHash = hashToken(rawToken);
    if (!row.refresh_token_hash || row.refresh_token_hash !== incomingHash) {
      await pool.query(
        "UPDATE users SET refresh_token_hash = NULL WHERE id = $1",
        [row.id],
      );
      clearRefreshCookie(res);
      res.status(401).json({ message: "Refresh token reuse detected" });
      return;
    }

    const user = mapUser(row);
    const tokens = generateTokens({
      sub: String(user.id),
      email: user.email,
      role: user.role,
    });

    await pool.query("UPDATE users SET refresh_token_hash = $1 WHERE id = $2", [
      hashToken(tokens.refreshToken),
      user.id,
    ]);

    setRefreshCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken, user });
  } catch {
    clearRefreshCookie(res);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

// ── Auth: Logout ───────────────────────────────────────────────────────────

app.post("/auth/logout", async (req, res) => {
  const rawToken = req.cookies?.refreshToken as string | undefined;
  if (rawToken) {
    try {
      const decoded = verifyRefreshToken(rawToken);
      await pool.query(
        "UPDATE users SET refresh_token_hash = NULL WHERE id = $1",
        [decoded.sub],
      );
    } catch {
      // expired/invalid — clear anyway
    }
  }
  clearRefreshCookie(res);
  res.json({ success: true });
});

// ── Auth: Me ───────────────────────────────────────────────────────────────

app.get("/auth/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url,
              license_front_url, license_back_url, passport_front_url, passport_back_url
       FROM users WHERE id = $1 LIMIT 1`,
      [req.userId],
    );
    if (!result.rowCount || result.rowCount === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user: mapUser(result.rows[0] as UserRow) });
  } catch {
    res.status(500).json({ message: "Could not fetch user" });
  }
});

// ── Auth: Change password ──────────────────────────────────────────────────

app.post(
  "/auth/change-password",
  requireAuth,
  async (req: AuthedRequest, res) => {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }
    if (newPassword.length < 8) {
      res
        .status(400)
        .json({ message: "New password must be at least 8 characters." });
      return;
    }

    try {
      const result = await pool.query(
        "SELECT id, password_hash, provider FROM users WHERE id = $1 LIMIT 1",
        [req.userId],
      );
      if (!result.rowCount) {
        res.status(404).json({ message: "User not found." });
        return;
      }
      const row = result.rows[0] as {
        id: number;
        password_hash: string | null;
        provider: string;
      };
      if (row.provider !== "local" || !row.password_hash) {
        res.status(400).json({
          message:
            "Password change is not available for social sign-in accounts.",
        });
        return;
      }

      const valid = await bcrypt.compare(currentPassword, row.password_hash);
      if (!valid) {
        res.status(400).json({ message: "Current password is incorrect." });
        return;
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
        newHash,
        row.id,
      ]);
      res.json({ message: "Password updated successfully." });
    } catch {
      res.status(500).json({ message: "Could not update password." });
    }
  },
);

// ── Auth: Google OAuth ─────────────────────────────────────────────────────

app.post("/auth/google", async (req, res) => {
  const { credential } = req.body as { credential?: string };
  if (!credential) {
    res.status(400).json({ message: "Missing credential" });
    return;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    res.status(500).json({ message: "Google OAuth not configured" });
    return;
  }

  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const googlePayload = ticket.getPayload();
    if (!googlePayload?.email) {
      res.status(400).json({ message: "Invalid Google token" });
      return;
    }

    const { email, given_name, family_name, sub: googleSub } = googlePayload;
    const firstName = given_name ?? email.split("@")[0];
    const lastName = family_name ?? "";

    let result = await pool.query(
      `SELECT id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url
       FROM users WHERE email = $1 LIMIT 1`,
      [email.toLowerCase()],
    );

    if (!result.rowCount || result.rowCount === 0) {
      result = await pool.query(
        `INSERT INTO users (first_name, last_name, email, provider, provider_id, is_verified)
         VALUES ($1, $2, $3, 'google', $4, TRUE)
         RETURNING id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url`,
        [firstName, lastName, email.toLowerCase(), googleSub],
      );
    }

    const user = mapUser(result.rows[0] as UserRow);
    const tokens = generateTokens({
      sub: String(user.id),
      email: user.email,
      role: user.role,
    });

    await pool.query("UPDATE users SET refresh_token_hash = $1 WHERE id = $2", [
      hashToken(tokens.refreshToken),
      user.id,
    ]);

    setRefreshCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken, user });
  } catch (err) {
    console.error("[google-auth]", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
});

// ── Auth: Apple OAuth ──────────────────────────────────────────────────────

app.post("/auth/apple", async (req, res) => {
  const {
    idToken,
    firstName: appleFirst,
    lastName: appleLast,
  } = req.body as {
    idToken?: string;
    firstName?: string;
    lastName?: string;
  };

  if (!idToken) {
    res.status(400).json({ message: "Missing id token" });
    return;
  }

  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT format");
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as { email?: string; sub?: string };

    if (!payload.email) {
      res.status(400).json({ message: "Apple token missing email" });
      return;
    }

    const email = payload.email.toLowerCase();
    const firstName = appleFirst ?? email.split("@")[0];
    const lastName = appleLast ?? "";

    let result = await pool.query(
      `SELECT id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url
       FROM users WHERE email = $1 LIMIT 1`,
      [email],
    );

    if (!result.rowCount || result.rowCount === 0) {
      result = await pool.query(
        `INSERT INTO users (first_name, last_name, email, provider, provider_id, is_verified)
         VALUES ($1, $2, $3, 'apple', $4, TRUE)
         RETURNING id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url`,
        [firstName, lastName, email, payload.sub ?? ""],
      );
    }

    const user = mapUser(result.rows[0] as UserRow);
    const tokens = generateTokens({
      sub: String(user.id),
      email: user.email,
      role: user.role,
    });

    await pool.query("UPDATE users SET refresh_token_hash = $1 WHERE id = $2", [
      hashToken(tokens.refreshToken),
      user.id,
    ]);

    setRefreshCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken, user });
  } catch (err) {
    console.error("[apple-auth]", err);
    res.status(401).json({ message: "Apple authentication failed" });
  }
});

// ── Admin routes ───────────────────────────────────────────────────────────

// List emails filtered by folder
app.get(
  "/admin/emails",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const folder = (req.query.folder as string) || "INBOX";
    const page = Math.max(1, parseInt((req.query.page as string) ?? "1", 10));
    const limit = 25;
    const offset = (page - 1) * limit;

    const [countResult, emailsResult] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM emails WHERE folder = $1", [folder]),
      pool.query(
        `SELECT e.id, e.from_address, e.from_name, e.subject,
                e.received_at, e.is_read, e.folder,
                COUNT(DISTINCT ea.id)::int AS attachment_count,
                COALESCE(MAX(ce.status), 'none') AS extraction_status
         FROM emails e
         LEFT JOIN email_attachments ea ON ea.email_id = e.id
         LEFT JOIN cargo_extractions  ce ON ce.email_id = e.id
         WHERE e.folder = $1
         GROUP BY e.id
         ORDER BY e.received_at DESC
         LIMIT $2 OFFSET $3`,
        [folder, limit, offset],
      ),
    ]);

    res.json({
      emails: emailsResult.rows,
      total: parseInt(countResult.rows[0].count as string, 10),
      folder,
      page,
      pageSize: limit,
    });
  },
);

// Unread + total counts per folder for sidebar badges
app.get(
  "/admin/emails/counts",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    const result = await pool.query(
      `SELECT folder,
              COUNT(*)                            AS total,
              COUNT(*) FILTER (WHERE NOT is_read) AS unread
       FROM emails
       GROUP BY folder`,
    );
    const counts: Record<string, { total: number; unread: number }> = {};
    for (const row of result.rows as {
      folder: string;
      total: string;
      unread: string;
    }[]) {
      counts[row.folder] = {
        total: parseInt(row.total, 10),
        unread: parseInt(row.unread, 10),
      };
    }
    res.json(counts);
  },
);

// Sync all Gmail folders via IMAP
app.post(
  "/admin/emails/sync",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    const result = await syncAllFolders();
    res.json(result);
  },
);

// Get single email detail + attachments + extractions
app.get(
  "/admin/emails/:id",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const emailId = parseInt(String(req.params.id), 10);
    const [emailResult, attachmentsResult, extractionsResult] =
      await Promise.all([
        pool.query(
          "SELECT id, from_address, from_name, subject, received_at, body_text, body_html, folder, is_read FROM emails WHERE id = $1",
          [emailId],
        ),
        pool.query(
          "SELECT id, filename, content_type, size_bytes FROM email_attachments WHERE email_id = $1 ORDER BY id",
          [emailId],
        ),
        pool.query(
          `SELECT id, attachment_id, status, extracted_json, whatsapp_sent_at, error_message
       FROM cargo_extractions WHERE email_id = $1 ORDER BY id DESC`,
          [emailId],
        ),
      ]);

    if (!emailResult.rowCount) {
      res.status(404).json({ message: "Email not found." });
      return;
    }
    res.json({
      email: emailResult.rows[0],
      attachments: attachmentsResult.rows,
      extractions: extractionsResult.rows,
    });
  },
);

// Mark email as read
app.patch(
  "/admin/emails/:id/read",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    await pool.query("UPDATE emails SET is_read = true WHERE id = $1", [
      parseInt(String(req.params.id), 10),
    ]);
    res.json({ ok: true });
  },
);

// Delete emails — body: { ids: number[] } OR { folder: string, all: true }
app.delete(
  "/admin/emails",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    try {
      const { ids, folder, all } = req.body as {
        ids?: unknown;
        folder?: unknown;
        all?: unknown;
      };
      if (all === true && typeof folder === "string" && folder.length > 0) {
        // Save message_ids to blocklist, then delete from DB and Gmail
        const rows = await pool.query(
          "SELECT message_id FROM emails WHERE folder = $1",
          [folder],
        );
        if (rows.rowCount && rows.rowCount > 0) {
          const msgIds = (rows.rows as { message_id: string }[]).map(
            (r) => r.message_id,
          );
          await pool.query(
            `INSERT INTO email_deletions (message_id)
             SELECT unnest($1::text[])
             ON CONFLICT (message_id) DO NOTHING`,
            [msgIds],
          );
        }
        await pool.query("DELETE FROM emails WHERE folder = $1", [folder]);
        // Mirror to Gmail (fire-and-forget, non-blocking)
        imapDeleteEmails({ all: true, folder }).catch((err) =>
          console.error("[imap-delete]", err),
        );
        res.json({ ok: true });
        return;
      }
      if (Array.isArray(ids) && ids.length > 0) {
        const safeIds = (ids as unknown[])
          .map(Number)
          .filter((n) => Number.isInteger(n) && n > 0);
        if (safeIds.length === 0) {
          res.status(400).json({ message: "Invalid ids." });
          return;
        }
        // Save message_ids to blocklist, then delete from DB and Gmail
        const rows = await pool.query(
          "SELECT message_id FROM emails WHERE id = ANY($1::int[])",
          [safeIds],
        );
        const msgIds = (rows.rows as { message_id: string }[]).map(
          (r) => r.message_id,
        );
        if (msgIds.length > 0) {
          await pool.query(
            `INSERT INTO email_deletions (message_id)
             SELECT unnest($1::text[])
             ON CONFLICT (message_id) DO NOTHING`,
            [msgIds],
          );
        }
        await pool.query("DELETE FROM emails WHERE id = ANY($1::int[])", [
          safeIds,
        ]);
        // Mirror to Gmail (fire-and-forget, non-blocking)
        if (msgIds.length > 0) {
          imapDeleteEmails({ all: false, messageIds: msgIds }).catch((err) =>
            console.error("[imap-delete]", err),
          );
        }
        res.json({ ok: true });
        return;
      }
      res.status(400).json({ message: "Provide ids[] or folder + all:true." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Delete failed." });
    }
  },
);

// Serve attachment PDF bytes
app.get(
  "/admin/emails/:id/attachment/:attachmentId",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const result = await pool.query(
      "SELECT filename, content_type, file_data FROM email_attachments WHERE id = $1 AND email_id = $2",
      [req.params.attachmentId, req.params.id],
    );
    if (!result.rowCount) {
      res.status(404).json({ message: "Attachment not found." });
      return;
    }
    const att = result.rows[0] as {
      filename: string;
      content_type: string;
      file_data: Buffer;
    };
    res.setHeader("Content-Type", att.content_type);
    res.setHeader("Content-Disposition", `inline; filename="${att.filename}"`);
    res.send(att.file_data);
  },
);

// Trigger AI extraction (fires async, client polls)
app.post(
  "/admin/emails/:id/extract/:attachmentId",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const { id, attachmentId } = req.params;

    const attResult = await pool.query(
      "SELECT file_data FROM email_attachments WHERE id = $1 AND email_id = $2",
      [attachmentId, id],
    );
    if (!attResult.rowCount) {
      res.status(404).json({ message: "Attachment not found." });
      return;
    }

    const extractResult = await pool.query(
      `INSERT INTO cargo_extractions (email_id, attachment_id, status)
       VALUES ($1, $2, 'extracting') RETURNING id`,
      [id, attachmentId],
    );
    const extractionId = extractResult.rows[0].id as number;

    // Fire-and-forget — returns immediately, client polls /admin/extractions/:id
    extractFromPdfBuffer(attResult.rows[0].file_data as Buffer)
      .then(async ({ data, rawText }) => {
        await pool.query(
          `UPDATE cargo_extractions
           SET status = 'extracted', extracted_json = $1, raw_text = $2, updated_at = NOW()
           WHERE id = $3`,
          [JSON.stringify(data), rawText, extractionId],
        );
      })
      .catch(async (err: unknown) => {
        await pool.query(
          `UPDATE cargo_extractions SET status = 'failed', error_message = $1, updated_at = NOW() WHERE id = $2`,
          [
            err instanceof Error ? err.message : "Extraction failed",
            extractionId,
          ],
        );
      });

    res.json({ extractionId, status: "extracting" });
  },
);

// Poll extraction status
app.get(
  "/admin/extractions/:id",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const result = await pool.query(
      "SELECT id, email_id, attachment_id, status, extracted_json, whatsapp_sent_at, error_message FROM cargo_extractions WHERE id = $1",
      [req.params.id],
    );
    if (!result.rowCount) {
      res.status(404).json({ message: "Not found." });
      return;
    }
    res.json(result.rows[0]);
  },
);

// Send extracted data to WhatsApp via Twilio
app.post(
  "/admin/extractions/:id/send-whatsapp",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const extractionId = parseInt(String(req.params.id), 10);

    const result = await pool.query(
      `SELECT ce.id, ce.extracted_json, e.subject
       FROM cargo_extractions ce
       JOIN emails e ON e.id = ce.email_id
       WHERE ce.id = $1`,
      [extractionId],
    );
    if (!result.rowCount) {
      res.status(404).json({ message: "Extraction not found." });
      return;
    }

    const row = result.rows[0] as {
      extracted_json: CargoData | null;
      subject: string;
    };
    if (!row.extracted_json) {
      res.status(400).json({ message: "No extracted data to send." });
      return;
    }

    try {
      const sid = await sendCargoWhatsApp(row.extracted_json, row.subject);
      await pool.query(
        `UPDATE cargo_extractions
         SET status = 'sent', whatsapp_message_sid = $1, whatsapp_sent_at = NOW(), updated_at = NOW()
         WHERE id = $2`,
        [sid, extractionId],
      );
      res.json({ success: true, messageSid: sid });
    } catch (err) {
      console.error("[send-whatsapp]", err);
      const message =
        err instanceof Error ? err.message : "WhatsApp send failed.";
      res.status(500).json({ message });
    }
  },
);

app.get(
  "/admin/stats",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    const [totalResult, verifiedResult] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query("SELECT COUNT(*) FROM users WHERE is_verified = TRUE"),
    ]);
    const totalUsers = parseInt(totalResult.rows[0].count as string, 10);
    const totalVerified = parseInt(verifiedResult.rows[0].count as string, 10);
    res.json({
      totalUsers,
      totalVerified,
      totalUnverified: totalUsers - totalVerified,
    });
  },
);

app.get(
  "/admin/users",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const result = search
      ? await pool.query(
          `SELECT id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url
           FROM users
           WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
           ORDER BY created_at DESC LIMIT 100`,
          [`%${search}%`],
        )
      : await pool.query(
          `SELECT id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url
           FROM users ORDER BY created_at DESC LIMIT 100`,
        );
    res.json({ users: result.rows.map(mapUser) });
  },
);

app.patch(
  "/admin/users/:id/role",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const userId = parseInt(String(req.params.id), 10);
    const { role } = req.body as { role?: string };
    if (!role || !["user", "admin"].includes(role)) {
      res
        .status(400)
        .json({ message: "Invalid role. Must be 'user' or 'admin'." });
      return;
    }
    if (userId === req.userId) {
      res.status(400).json({ message: "Cannot change your own role." });
      return;
    }
    const result = await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2
       RETURNING id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url`,
      [role, userId],
    );
    if (!result.rowCount) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.json({ user: mapUser(result.rows[0] as UserRow) });
  },
);

app.delete(
  "/admin/users/:id",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const userId = parseInt(String(req.params.id), 10);
    if (userId === req.userId) {
      res.status(400).json({ message: "Cannot delete your own account." });
      return;
    }
    const result = await pool.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);
    if (!result.rowCount) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.json({ message: "User deleted." });
  },
);

app.get(
  "/admin/users/:id/driver-profile",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const userId = parseInt(String(req.params.id), 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }
    try {
      const [userResult, dpResult] = await Promise.all([
        pool.query(
          `SELECT id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url
           FROM users WHERE id = $1 LIMIT 1`,
          [userId],
        ),
        pool.query(
          `SELECT phone, whatsapp, country, availability, license_cats,
                  years_exp, languages, bio
           FROM driver_profiles WHERE user_id = $1`,
          [userId],
        ),
      ]);
      if (!userResult.rowCount) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json({
        user: mapUser(userResult.rows[0] as UserRow),
        driverProfile: dpResult.rows[0] ?? null,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: msg });
    }
  },
);

// ── Meta WhatsApp Webhooks ─────────────────────────────────────────────────

// Verification handshake — Meta sends a GET to confirm the endpoint
app.get("/webhooks/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.META_WA_WEBHOOK_VERIFY_TOKEN
  ) {
    console.log("[webhook] WhatsApp webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Incoming events — message status updates, inbound messages, etc.
app.post("/webhooks/whatsapp", (req, res) => {
  // Always respond 200 immediately so Meta doesn't retry
  res.sendStatus(200);

  const body = req.body as {
    object?: string;
    entry?: {
      changes?: {
        value?: {
          statuses?: { id: string; status: string; timestamp: string }[];
          messages?: {
            from: string;
            id: string;
            type: string;
            text?: { body: string };
          }[];
        };
      }[];
    }[];
  };

  if (body.object !== "whatsapp_business_account") return;

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      // Log message status updates (sent / delivered / read / failed)
      for (const status of value?.statuses ?? []) {
        console.log(`[webhook] message ${status.id} → ${status.status}`);
      }
      // Log inbound messages (optional — useful for future two-way support)
      for (const msg of value?.messages ?? []) {
        console.log(
          `[webhook] inbound from ${msg.from}: ${msg.text?.body ?? `(${msg.type})`}`,
        );
      }
    }
  }
});

// ── Start server ─────────────────────────────────────────────────────

// Ensure app_settings table exists
void pool.query(`
  CREATE TABLE IF NOT EXISTS app_settings (
    key        TEXT PRIMARY KEY,
    value      JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

// ── Hero customisation ──────────────────────────────────────────────────

// Admin saves hero texts → save immediately, translate in background
app.post(
  "/admin/customization/hero",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    try {
      const { source } = req.body as { source: HeroTexts };
      if (!source || typeof source !== "object") {
        res.status(400).json({ message: "source texts required" });
        return;
      }
      // 1. Save source immediately so data is never lost
      await pool.query(
        `INSERT INTO app_settings (key, value, updated_at)
         VALUES ('hero_overrides', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
        [JSON.stringify({ source, translations: {} })],
      );
      // 2. Respond immediately — don't keep client waiting for AI
      res.json({ ok: true, translating: true });
      // 3. Translate in background and update DB
      void (async () => {
        try {
          const translations = await translateHeroTexts(source);
          await pool.query(
            `UPDATE app_settings SET value = $1, updated_at = NOW()
             WHERE key = 'hero_overrides'`,
            [JSON.stringify({ source, translations })],
          );
          console.log("[hero-translate-bg] done");
        } catch (err) {
          console.error("[hero-translate-bg] error:", err);
        }
      })();
    } catch (err) {
      console.error("[hero-customization] error:", err);
      res.status(500).json({ message: "Save failed" });
    }
  },
);

// Public endpoint — returns translated hero overrides for the given lang
app.get("/hero-overrides/:lang", async (req, res) => {
  try {
    const { lang } = req.params;
    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'hero_overrides'",
    );
    if (result.rows.length === 0) {
      res.json({});
      return;
    }
    const data = result.rows[0].value as {
      source: HeroTexts;
      translations: HeroTranslations;
    };
    // Prefer exact lang, fall back to English, then source
    const langTexts =
      data.translations[lang] ?? data.translations["en"] ?? data.source ?? {};
    // Merge non-translatable visual overrides from source so all clients get them
    const src = data.source as Record<string, unknown>;
    const visualOverrides: Record<string, unknown> = {};
    for (const key of [
      "trustBg",
      "partnersBg",
      "partners",
      "heroImgDesktop",
      "heroImgMobile",
    ]) {
      if (src[key] !== undefined) visualOverrides[key] = src[key];
    }
    res.json({
      ...langTexts,
      ...visualOverrides,
      _hasTranslations: Object.keys(data.translations ?? {}).length > 0,
    });
  } catch (err) {
    console.error("[hero-overrides] error:", err);
    res.json({});
  }
});

// Admin: delete hero overrides
app.delete(
  "/admin/customization/hero",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    await pool.query("DELETE FROM app_settings WHERE key = 'hero_overrides'");
    res.json({ ok: true });
  },
);

// ── Services customization ───────────────────────────────────────────────────
// Admin saves services texts → save immediately, translate in background
app.post(
  "/admin/customization/services",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    try {
      const { source } = req.body as { source: ServicesTexts };
      if (!source || typeof source !== "object") {
        res.status(400).json({ message: "source texts required" });
        return;
      }
      // 1. Save source immediately so data is never lost
      await pool.query(
        `INSERT INTO app_settings (key, value, updated_at)
         VALUES ('services_overrides', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
        [JSON.stringify({ source, translations: {} })],
      );
      // 2. Respond immediately — don't keep client waiting for AI
      res.json({ ok: true, translating: true });
      // 3. Translate in background and update DB
      void (async () => {
        try {
          const translations = await translateServicesTexts(source);
          await pool.query(
            `UPDATE app_settings SET value = $1, updated_at = NOW()
             WHERE key = 'services_overrides'`,
            [JSON.stringify({ source, translations })],
          );
          console.log("[services-translate-bg] done");
        } catch (err) {
          console.error("[services-translate-bg] error:", err);
        }
      })();
    } catch (err) {
      console.error("[services-customization] error:", err);
      res.status(500).json({ message: "Save failed" });
    }
  },
);

// Public endpoint — returns translated services overrides for the given lang
app.get("/services-overrides/:lang", async (req, res) => {
  try {
    const { lang } = req.params;
    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'services_overrides'",
    );
    if (result.rows.length === 0) {
      res.json({});
      return;
    }
    const data = result.rows[0].value as {
      source: ServicesTexts;
      translations: ServicesTranslations;
    };
    const langTexts =
      data.translations[lang] ?? data.translations["en"] ?? data.source ?? {};
    // Merge non-translatable image overrides from source
    const src = data.source as Record<string, unknown>;
    const imageOverrides: Record<string, unknown> = {};
    for (const key of ["img0", "img1", "img2", "img3", "img4", "img5"]) {
      if (src[key] !== undefined) imageOverrides[key] = src[key];
    }
    res.json({
      ...langTexts,
      ...imageOverrides,
      _hasTranslations: Object.keys(data.translations ?? {}).length > 0,
    });
  } catch (err) {
    console.error("[services-overrides] error:", err);
    res.json({});
  }
});

// Admin: delete services overrides
app.delete(
  "/admin/customization/services",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    await pool.query(
      "DELETE FROM app_settings WHERE key = 'services_overrides'",
    );
    res.json({ ok: true });
  },
);

// ── Cloudinary partner logo upload ───────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post(
  "/admin/cloudinary/upload",
  requireAuth,
  requireAdmin,
  upload.single("file"),
  async (req: AuthedRequest, res) => {
    const file = (req as express.Request & { file?: Express.Multer.File }).file;
    if (!file) {
      res.status(400).json({ message: "No file provided" });
      return;
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "";
    const apiKey = process.env.CLOUDINARY_API_KEY ?? "";
    const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";

    if (!cloudName || !apiKey || !apiSecret) {
      res.status(500).json({ message: "Cloudinary not configured" });
      return;
    }

    // Build signed upload params
    const timestamp = String(Math.floor(Date.now() / 1000));
    const folder =
      ((req.body as Record<string, unknown>).folder as string | undefined) ??
      "tc-partners";
    // Params sorted alphabetically (must match exactly what we send)
    const signingStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(signingStr)
      .digest("hex");

    // Forward to Cloudinary via multipart upload
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
      file.originalname,
    );
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const cldRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!cldRes.ok) {
      const err = (await cldRes.json().catch(() => ({}))) as {
        error?: { message?: string };
      };
      const errMsg = err?.error?.message ?? "Cloudinary upload failed";
      console.error("[cloudinary] upload error:", errMsg, "cloud:", cloudName);
      res.status(502).json({ message: errMsg });
      return;
    }

    const data = (await cldRes.json()) as { secure_url: string };
    res.json({ url: data.secure_url });
  },
);

// ── Cloudinary delete ─────────────────────────────────────────────────────────
app.delete(
  "/admin/cloudinary/delete",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const { publicId } = req.body as { publicId?: string };
    if (!publicId) {
      res.status(400).json({ message: "publicId required" });
      return;
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "";
    const apiKey = process.env.CLOUDINARY_API_KEY ?? "";
    const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";

    if (!cloudName || !apiKey || !apiSecret) {
      res.status(500).json({ message: "Cloudinary not configured" });
      return;
    }

    const timestamp = String(Math.floor(Date.now() / 1000));
    const signingStr = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(signingStr)
      .digest("hex");

    const form = new FormData();
    form.append("public_id", publicId);
    form.append("api_key", apiKey);
    form.append("timestamp", timestamp);
    form.append("signature", signature);

    const cldRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: "POST", body: form },
    );

    const result = (await cldRes.json().catch(() => ({}))) as {
      result?: string;
      error?: { message?: string };
    };
    if (!cldRes.ok || result.result === "not found") {
      console.warn("[cloudinary] delete warning:", result);
    }
    res.json({ ok: true });
  },
);

// ── About customization ─────────────────────────────────────────────────────
// Admin saves about texts → save immediately, translate in background
app.post(
  "/admin/customization/about",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    try {
      const { source } = req.body as { source: AboutTexts };
      if (!source || typeof source !== "object") {
        res.status(400).json({ message: "source texts required" });
        return;
      }
      await pool.query(
        `INSERT INTO app_settings (key, value, updated_at)
         VALUES ('about_overrides', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
        [JSON.stringify({ source, translations: {} })],
      );
      res.json({ ok: true, translating: true });
      void (async () => {
        try {
          const translations = await translateAboutTexts(source);
          await pool.query(
            `UPDATE app_settings SET value = $1, updated_at = NOW()
             WHERE key = 'about_overrides'`,
            [JSON.stringify({ source, translations })],
          );
          console.log("[about-translate-bg] done");
        } catch (err) {
          console.error("[about-translate-bg] error:", err);
        }
      })();
    } catch (err) {
      console.error("[about-customization] error:", err);
      res.status(500).json({ message: "Save failed" });
    }
  },
);

// Public endpoint — returns translated about overrides for the given lang
app.get("/about-overrides/:lang", async (req, res) => {
  try {
    const { lang } = req.params;
    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'about_overrides'",
    );
    if (result.rows.length === 0) {
      res.json({});
      return;
    }
    const data = result.rows[0].value as {
      source: AboutTexts;
      translations: AboutTranslations;
    };
    const langTexts =
      data.translations[lang] ?? data.translations["en"] ?? data.source ?? {};
    const src = data.source as Record<string, unknown>;
    const imageOverrides: Record<string, unknown> = {};
    for (const key of ["imgLeft", "imgTopRight", "imgBottomRight"]) {
      if (src[key] !== undefined) imageOverrides[key] = src[key];
    }
    res.json({
      ...langTexts,
      ...imageOverrides,
      _hasTranslations: Object.keys(data.translations ?? {}).length > 0,
    });
  } catch (err) {
    console.error("[about-overrides] error:", err);
    res.json({});
  }
});

// Admin: delete about overrides
app.delete(
  "/admin/customization/about",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    await pool.query("DELETE FROM app_settings WHERE key = 'about_overrides'");
    res.json({ ok: true });
  },
);

// ── Housing customization ──────────────────────────────────────────────────────────────────────────────
// Admin saves housing texts → save immediately, translate in background
app.post(
  "/admin/customization/housing",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    try {
      const { source } = req.body as { source: HousingTexts };
      if (!source || typeof source !== "object") {
        res.status(400).json({ message: "source texts required" });
        return;
      }
      await pool.query(
        `INSERT INTO app_settings (key, value, updated_at)
         VALUES ('housing_overrides', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
        [JSON.stringify({ source, translations: {} })],
      );
      res.json({ ok: true, translating: true });
      void (async () => {
        try {
          const translations = await translateHousingTexts(source);
          await pool.query(
            `UPDATE app_settings SET value = $1, updated_at = NOW()
             WHERE key = 'housing_overrides'`,
            [JSON.stringify({ source, translations })],
          );
          console.log("[housing-translate-bg] done");
        } catch (err) {
          console.error("[housing-translate-bg] error:", err);
        }
      })();
    } catch (err) {
      console.error("[housing-customization] error:", err);
      res.status(500).json({ message: "Save failed" });
    }
  },
);

// Public endpoint — returns translated housing overrides for the given lang
app.get("/housing-overrides/:lang", async (req, res) => {
  try {
    const { lang } = req.params;
    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'housing_overrides'",
    );
    if (result.rows.length === 0) {
      res.json({});
      return;
    }
    const data = result.rows[0].value as {
      source: HousingTexts;
      translations: HousingTranslations;
    };
    const langTexts =
      data.translations[lang] ?? data.translations["en"] ?? data.source ?? {};
    // Merge non-translatable overrides from source
    const src = data.source as Record<string, unknown>;
    const nonTranslatable: Record<string, unknown> = {};
    for (const key of [
      "perk0Icon",
      "perk1Icon",
      "perk2Icon",
      "perk3Icon",
      "img1",
      "img2",
      "bg",
    ]) {
      if (src[key] !== undefined) nonTranslatable[key] = src[key];
    }
    res.json({
      ...langTexts,
      ...nonTranslatable,
      _hasTranslations: Object.keys(data.translations ?? {}).length > 0,
    });
  } catch (err) {
    console.error("[housing-overrides] error:", err);
    res.json({});
  }
});

// Admin: delete housing overrides
app.delete(
  "/admin/customization/housing",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    await pool.query(
      "DELETE FROM app_settings WHERE key = 'housing_overrides'",
    );
    res.json({ ok: true });
  },
);

// ── Contact customization ──────────────────────────────────────────────────────────────────────────────
app.post(
  "/admin/customization/contact",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    try {
      const { source } = req.body as { source: ContactTexts };
      if (!source || typeof source !== "object") {
        res.status(400).json({ message: "source texts required" });
        return;
      }
      await pool.query(
        `INSERT INTO app_settings (key, value, updated_at)
         VALUES ('contact_overrides', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
        [JSON.stringify({ source, translations: {} })],
      );
      res.json({ ok: true, translating: true });
      void (async () => {
        try {
          const translations = await translateContactTexts(source);
          await pool.query(
            `UPDATE app_settings SET value = $1, updated_at = NOW()
             WHERE key = 'contact_overrides'`,
            [JSON.stringify({ source, translations })],
          );
          console.log("[contact-translate-bg] done");
        } catch (err) {
          console.error("[contact-translate-bg] error:", err);
        }
      })();
    } catch (err) {
      console.error("[contact-customization] error:", err);
      res.status(500).json({ message: "Save failed" });
    }
  },
);

app.get("/contact-overrides/:lang", async (req, res) => {
  try {
    const { lang } = req.params;
    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'contact_overrides'",
    );
    if (result.rows.length === 0) {
      res.json({});
      return;
    }
    const data = result.rows[0].value as {
      source: ContactTexts;
      translations: ContactTranslations;
    };
    const langTexts =
      data.translations[lang] ?? data.translations["en"] ?? data.source ?? {};
    const src = data.source as Record<string, unknown>;
    const nonTranslatable: Record<string, unknown> = {};
    for (const key of [
      "img",
      "whatsapp_number",
      "email_address",
      "map_address",
      "map_pin",
    ]) {
      if (src[key] !== undefined) nonTranslatable[key] = src[key];
    }
    res.json({
      ...langTexts,
      ...nonTranslatable,
      _hasTranslations: Object.keys(data.translations ?? {}).length > 0,
    });
  } catch (err) {
    console.error("[contact-overrides] error:", err);
    res.json({});
  }
});

app.delete(
  "/admin/customization/contact",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    await pool.query(
      "DELETE FROM app_settings WHERE key = 'contact_overrides'",
    );
    res.json({ ok: true });
  },
);

import {
  translateFooterTexts,
  type FooterTexts,
  type FooterTranslations,
} from "./footer-translate.js";

// ── Footer customization ─────────────────────────────────────────────────────
app.post(
  "/admin/customization/footer",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    try {
      const { source } = req.body as { source: FooterTexts };
      if (!source || typeof source !== "object") {
        res.status(400).json({ message: "source texts required" });
        return;
      }
      await pool.query(
        `INSERT INTO app_settings (key, value, updated_at)
         VALUES ('footer_overrides', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
        [JSON.stringify({ source, translations: {} })],
      );
      res.json({ ok: true, translating: true });
      void (async () => {
        try {
          const translations = await translateFooterTexts(source);
          await pool.query(
            `UPDATE app_settings SET value = $1, updated_at = NOW()
             WHERE key = 'footer_overrides'`,
            [JSON.stringify({ source, translations })],
          );
          console.log("[footer-translate-bg] done");
        } catch (err) {
          console.error("[footer-translate-bg] error:", err);
        }
      })();
    } catch (err) {
      console.error("[footer-customization] error:", err);
      res.status(500).json({ message: "Save failed" });
    }
  },
);

app.get("/footer-overrides/:lang", async (req, res) => {
  try {
    const { lang } = req.params;
    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = 'footer_overrides'",
    );
    if (result.rows.length === 0) {
      res.json({});
      return;
    }
    const data = result.rows[0].value as {
      source: FooterTexts;
      translations: FooterTranslations;
    };
    const langTexts =
      data.translations[lang] ?? data.translations["en"] ?? data.source ?? {};
    const src = data.source as Record<string, unknown>;
    const nonTranslatable: Record<string, unknown> = {};
    for (const key of ["address_line1", "address_line2", "phone", "email"]) {
      if (src[key] !== undefined) nonTranslatable[key] = src[key];
    }
    res.json({
      ...langTexts,
      ...nonTranslatable,
      _hasTranslations: Object.keys(data.translations ?? {}).length > 0,
    });
  } catch (err) {
    console.error("[footer-overrides] error:", err);
    res.json({});
  }
});

app.delete(
  "/admin/customization/footer",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    await pool.query("DELETE FROM app_settings WHERE key = 'footer_overrides'");
    res.json({ ok: true });
  },
);

// ── GA4 Analytics ─────────────────────────────────────────────────────────
app.get(
  "/admin/analytics/summary",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    try {
      const summary = await getAnalyticsSummary();
      res.json(summary);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: msg });
    }
  },
);

// ── Default theme setting ──────────────────────────────────────────────────

app.get(
  "/admin/settings/default-theme",
  requireAuth,
  requireAdmin,
  async (_req: AuthedRequest, res) => {
    try {
      const result = await pool.query(
        "SELECT value FROM app_settings WHERE key = 'default_theme'",
      );
      const theme =
        (result.rows[0]?.value as { theme?: string })?.theme ?? "modern";
      res.json({ theme });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: msg });
    }
  },
);

app.post(
  "/admin/settings/default-theme",
  requireAuth,
  requireAdmin,
  async (req: AuthedRequest, res) => {
    try {
      const { theme } = req.body as { theme?: string };
      if (theme !== "modern" && theme !== "win98") {
        res.status(400).json({ error: "theme must be 'modern' or 'win98'" });
        return;
      }
      const existing = await pool.query(
        "SELECT key FROM app_settings WHERE key = 'default_theme'",
      );
      if (existing.rows.length === 0) {
        await pool.query(
          "INSERT INTO app_settings (key, value, updated_at) VALUES ('default_theme', $1, NOW())",
          [JSON.stringify({ theme })],
        );
      } else {
        await pool.query(
          "UPDATE app_settings SET value = $1, updated_at = NOW() WHERE key = 'default_theme'",
          [JSON.stringify({ theme })],
        );
      }
      res.json({ theme });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: msg });
    }
  },
);

// ── Driver Profile ──────────────────────────────────────────────────────────

app.get("/profile/driver", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT phone, whatsapp, country, availability, license_cats,
                years_exp, languages, bio
         FROM driver_profiles WHERE user_id = $1`,
      [req.userId],
    );
    res.json(result.rows[0] ?? null);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

app.put("/profile/driver", requireAuth, async (req: AuthedRequest, res) => {
  const schema = z.object({
    phone: z.string().max(30).optional().nullable(),
    whatsapp: z.string().max(30).optional().nullable(),
    country: z.string().max(100).optional().nullable(),
    availability: z.enum(["available", "open", "unavailable"]).optional(),
    license_cats: z.array(z.string().max(10)).max(20).optional(),
    years_exp: z.number().int().min(0).max(60).optional().nullable(),
    languages: z.array(z.string().max(50)).max(30).optional(),
    bio: z.string().max(500).optional().nullable(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const d = parsed.data;
  try {
    await pool.query(
      `INSERT INTO driver_profiles
           (user_id, phone, whatsapp, country, availability, license_cats,
            years_exp, languages, bio, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
         ON CONFLICT (user_id) DO UPDATE SET
           phone = EXCLUDED.phone,
           whatsapp = EXCLUDED.whatsapp,
           country = EXCLUDED.country,
           availability = EXCLUDED.availability,
           license_cats = EXCLUDED.license_cats,
           years_exp = EXCLUDED.years_exp,
           languages = EXCLUDED.languages,
           bio = EXCLUDED.bio,
           updated_at = NOW()`,
      [
        req.userId,
        d.phone ?? null,
        d.whatsapp ?? null,
        d.country ?? null,
        d.availability ?? "available",
        d.license_cats ?? [],
        d.years_exp ?? null,
        d.languages ?? [],
        d.bio ?? null,
      ],
    );
    res.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

app.put("/profile/name", requireAuth, async (req: AuthedRequest, res) => {
  const schema = z.object({
    firstName: z.string().min(1).max(100).trim(),
    lastName: z.string().max(100).trim(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { firstName, lastName } = parsed.data;
  try {
    const result = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2
         WHERE id = $3
         RETURNING id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url`,
      [firstName, lastName, req.userId],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(mapUser(result.rows[0] as UserRow));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

// ── Profile Avatar ──────────────────────────────────────────────────────────

cloudinary.config({
  cloud_name: "dhq3nxqt2",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

app.post(
  "/profile/avatar",
  requireAuth,
  avatarUpload.single("avatar"),
  async (req: AuthedRequest, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    try {
      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "Team_Cargo_Web-User_Profile_Images",
                public_id: `user_${req.userId}`,
                overwrite: true,
                transformation: [
                  { width: 400, height: 400, crop: "fill", gravity: "face" },
                ],
              },
              (err, result) => {
                if (err || !result) reject(err ?? new Error("Upload failed"));
                else resolve(result as { secure_url: string });
              },
            )
            .end(req.file!.buffer);
        },
      );

      const { rows } = await pool.query(
        `UPDATE users SET avatar_url = $1 WHERE id = $2
         RETURNING id, first_name, last_name, email, role, is_verified, provider, created_at, avatar_url`,
        [uploadResult.secure_url, req.userId],
      );
      res.json(mapUser(rows[0] as UserRow));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload error";
      res.status(500).json({ error: msg });
    }
  },
);

// ── Document upload (license / passport) ──────────────────────────────────────

const DOC_COLUMNS: Record<string, string> = {
  license_front:  "license_front_url",
  license_back:   "license_back_url",
  passport_front: "passport_front_url",
  passport_back:  "passport_back_url",
};

app.post(
  "/profile/documents/:docType",
  requireAuth,
  avatarUpload.single("document"),
  async (req: AuthedRequest, res) => {
    const { docType } = req.params as { docType: string };
    const column = DOC_COLUMNS[docType];
    if (!column) {
      res.status(400).json({ error: "Invalid document type" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    try {
      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "Team_Cargo_Web-User_Documents",
                public_id: `user_${req.userId}_${docType}`,
                overwrite: true,
              },
              (err, result) => {
                if (err || !result) reject(err ?? new Error("Upload failed"));
                else resolve(result as { secure_url: string });
              },
            )
            .end(req.file!.buffer);
        },
      );

      await pool.query(
        `UPDATE users SET ${column} = $1 WHERE id = $2`,
        [uploadResult.secure_url, req.userId],
      );
      res.json({ url: uploadResult.secure_url });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload error";
      res.status(500).json({ error: msg });
    }
  },
);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`[team-cargo] backend running on port ${PORT}`);
});

// Prevent unhandled DB connection errors from crashing the process
process.on("unhandledRejection", (reason) => {
  console.error("[team-cargo] unhandled rejection:", reason);
});
