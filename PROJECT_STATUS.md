# Team Cargo Web — Project Status

> Last updated: 26 April 2026

---

## Stack

| Layer       | Tech                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------- |
| Frontend    | Next.js 16 (App Router), TypeScript, Tailwind CSS v4                                          |
| Backend     | Express + TypeScript, PostgreSQL, JWT, Twilio (WhatsApp), OpenAI (AI extract)                 |
| i18n        | 18 JSON dictionaries (en, nl, de, fr, es, it, pt, pl, ro, cs, hu, el, lv, et, fi, sv, da, no) |
| Auth tokens | Access token (in-memory), Refresh token → httpOnly cookie                                     |

---

## ✅ Done

### Frontend — Marketing Site

- **HeroSection**
  - Desktop bg: `couriers_1_webP.webp`, mobile: `uploadingParcels-webP.webp`
  - Animated count-up stats on scroll reveal
  - Partner logo marquee strip (4× loop, 90s CSS animation)
  - Trust line bar — solid dark green `#0d3d1e`, Shield icon `w-5 h-5`, `py-3 text-sm`, between hero and partner strip

- **Header / LanguageSwitcher**
  - Dropdown `bg-[#022b14]` (very dark green)
  - Scrollbar: transparent track, white/30 thumb (webkit + Firefox)

- **Sections**: About, Services, Housing, Contact, Footer, CookieBanner — all built and i18n'd

### Frontend — Auth Modal (`AuthModal.tsx`)

- **Login tab**
  - Google button (dark `#131314`, real SVG logo)
  - Email + Password form
  - "Forgot password?" inline flow → sends email → confirmation state → back to login
- **Register tab**
  - Full name + Email + Password + Confirm password
  - No Google button (login-only per design)
- **Verification pending banner** with "Resend email" button
- Escape key + backdrop click to close
- Fully i18n'd via `dict.auth.*` (29 keys across all 18 dicts)
- Header: `bg-[#1a7f45]`

### Frontend — Auth Client (`src/lib/auth-client.ts`)

| Function                                             | Status                                                |
| ---------------------------------------------------- | ----------------------------------------------------- |
| `getAccessToken / setAccessToken / clearAccessToken` | ✅                                                    |
| `refreshAccessToken`                                 | ✅ auto-called on 401                                 |
| `fetchWithAuth`                                      | ✅ silent refresh + `auth:session-expired` event      |
| `apiMe`                                              | ✅                                                    |
| `apiLogin`                                           | ✅                                                    |
| `apiRegister`                                        | ✅                                                    |
| `apiLogout`                                          | ✅                                                    |
| `apiGoogleAuth(credential)`                          | ✅ function exists, calls `/auth/google`              |
| `apiAppleAuth(idToken, fullName?)`                   | ✅ function exists, calls `/auth/apple`               |
| `apiForgotPassword(email)`                           | ✅ function exists, calls `/auth/forgot-password`     |
| `apiResendVerification(email)`                       | ✅ function exists, calls `/auth/resend-verification` |

### Backend (`backend/src/index.ts`)

| Endpoint                         | Status                                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `POST /auth/register`            | ✅ bcrypt hash, JWT pair, refresh cookie, verification email                           |
| `POST /auth/login`               | ✅ password verify, JWT pair, refresh cookie                                           |
| `POST /auth/refresh`             | ✅ rotation, reuse detection                                                           |
| `POST /auth/logout`              | ✅ clears token hash + cookie                                                          |
| `GET /auth/me`                   | ✅ requires `requireAuth` middleware                                                   |
| `GET /auth/verify-email`         | ✅ verifies token, sets `is_verified = TRUE`, redirects                                |
| `POST /auth/resend-verification` | ✅ generates + stores token, sends email, rate-limited                                 |
| `POST /auth/forgot-password`     | ✅ time-limited token, sends reset email, always 200                                   |
| `POST /auth/reset-password`      | ✅ verifies token + expiry, bcrypt hash new password, invalidates refresh tokens       |
| `POST /auth/change-password`     | ✅ requires `requireAuth`, verifies current password, blocks social-only accounts      |
| `POST /auth/google`              | ✅ verifies Google ID token via `google-auth-library`, upserts user                    |
| `POST /auth/apple`               | ✅ decodes JWT header, fetches Apple JWKS, verifies RS256 signature                    |

### Backend — Support Modules

| File                      | Status | Notes                                                                 |
| ------------------------- | ------ | --------------------------------------------------------------------- |
| `backend/src/auth.ts`     | ✅     | `generateTokens`, `verifyToken`, `verifyRefreshToken`, `hashToken`    |
| `backend/src/email.ts`    | ✅     | Resend integration — `sendVerificationEmail`, `sendPasswordResetEmail` |
| `backend/src/email-sync.ts` | ✅   | IMAP sync via `imapflow` — `syncAllFolders`, `imapDeleteEmails`       |
| `backend/src/ai-extract.ts` | ✅   | OpenAI PDF cargo-data extraction — `extractFromPdfBuffer`             |
| `backend/src/whatsapp.ts` | ✅     | Twilio WhatsApp — `sendCargoWhatsApp(cargoData, subject)`             |
| `backend/src/middleware.ts` | ✅   | `requireAuth`, `requireAdmin`                                         |
| `backend/src/db.ts`       | ✅     | PostgreSQL pool                                                        |
| `backend/src/types.ts`    | ✅     | Shared TypeScript types                                                |

### Backend — Admin Routes

| Endpoint                                     | Status | Notes                                                         |
| -------------------------------------------- | ------ | ------------------------------------------------------------- |
| `GET /admin/emails`                          | ✅     | Paginated, filterable by folder, includes attachment count + extraction status |
| `GET /admin/emails/counts`                   | ✅     | Unread + total per folder (sidebar badges)                    |
| `POST /admin/emails/sync`                    | ✅     | Syncs all Gmail folders via IMAP                              |
| `GET /admin/emails/:id`                      | ✅     | Full email detail + attachments + extractions                 |
| `PATCH /admin/emails/:id/read`               | ✅     | Mark as read                                                   |
| `DELETE /admin/emails`                       | ✅     | Bulk delete by IDs or entire folder; saves blocklist to `email_deletions` |
| `GET /admin/emails/:id/attachment/:aid`      | ✅     | Serve attachment PDF bytes                                    |
| `POST /admin/emails/:id/extract/:aid`        | ✅     | Trigger AI extraction (async, returns extractionId to poll)   |
| `GET /admin/extractions/:id`                 | ✅     | Poll extraction status + result JSON                          |
| `POST /admin/extractions/:id/send-whatsapp`  | ✅     | Send extracted cargo data to WhatsApp via Twilio              |
| `GET /admin/stats`                           | ✅     | Total/verified/unverified user counts                         |
| `GET /admin/users`                           | ✅     | Paginated user list with search (first/last name, email)      |
| `PATCH /admin/users/:id/role`                | ✅     | Change role (user ↔ admin); cannot self-modify                |
| `DELETE /admin/users/:id`                    | ✅     | Hard delete; cannot self-delete                               |

---

## Frontend — Pages & Components

| Route / Component             | Status | Notes                                                                      |
| ----------------------------- | ------ | -------------------------------------------------------------------------- |
| `[lang]/` (marketing home)    | ✅     | Hero, About, Services, Housing, Contact, Footer, CookieBanner              |
| `[lang]/(auth)/login`         | ✅     | Login page                                                                 |
| `[lang]/(auth)/register`      | ✅     | Register page                                                              |
| `[lang]/admin`                | ✅     | Admin dashboard — email inbox, IMAP sync, AI extract, WhatsApp, user mgmt |
| `[lang]/profile`              | ✅     | User profile dashboard                                                     |
| `[lang]/privacy`              | ✅     | Privacy policy page                                                        |
| `[lang]/terms`                | ✅     | Terms of service page                                                      |
| `[lang]/cookies`              | ✅     | Cookie policy page                                                         |
| `AuthModal.tsx`               | ✅     | Login + Register + Forgot password flows, Google button, i18n              |
| `AdminDashboard.tsx`          | ✅     | Emails tab, users tab, stats — 464 lines                                   |
| `AdminEmailsTab.tsx`          | ✅     | Folder sidebar, email list, detail panel, AI extract + WhatsApp send       |
| `ProfileDashboard.tsx`        | ✅     | User profile view + change-password form                                   |
| `VerifiedBanner.tsx`          | ✅     | Email verification status banner                                           |
| `AuthContext`                 | ✅     | `login`, `register`, `loginWithGoogle`, `loginWithApple`, `logout`, session restore on load, `auth:session-expired` event |

---

## Database Migrations

| File                                              | Status | Tables / Columns                                           |
| ------------------------------------------------- | ------ | ---------------------------------------------------------- |
| `001_users.sql`                                   | ✅     | `users` (with OAuth, verification, reset token columns)    |
| `002_shipments.sql`                               | ✅     | `shipments`                                                |
| `003_emails.sql`                                  | ✅     | `emails`, `email_attachments`, `cargo_extractions`         |
| `004_emails_folders.sql`                          | ✅     | Adds `folder`, `is_read`, `body_html` to `emails`; adds `raw_text`, `whatsapp_message_sid` to `cargo_extractions` |
| `005_email_deletions.sql`                         | ✅     | `email_deletions` (blocklist for IMAP re-sync prevention)  |
| `migrations/004_first_last_name_and_tokens.sql`   | ✅     | Splits `full_name` → `first_name` + `last_name`; adds token/expiry columns |

---

## ❌ Not Done

- **Facebook OAuth** — no `/auth/facebook` endpoint; not listed in original spec for this project
- **Shipments API** — DB table exists but no REST endpoints built yet
- **Deployment** — not deployed (Railway/Render for backend, Vercel for frontend)
- **Apple Sign-In JS SDK** — frontend SDK not wired; `loginWithApple` exists in `AuthContext` but no UI trigger beyond AuthModal placeholder
- **CI/CD** — no pipeline

---

## Environment Variables Checklist

### Backend (`.env`)

```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
GOOGLE_CLIENT_ID=
RESEND_API_KEY=
RESEND_FROM=            # e.g. noreply@teamcargo.eu
FRONTEND_URL=
OPENAI_API_KEY=         # AI cargo extraction
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=   # e.g. whatsapp:+14155238886
TWILIO_WHATSAPP_TO=
IMAP_HOST=
IMAP_PORT=
IMAP_USER=
IMAP_PASS=
NODE_ENV=
PORT=4000
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

---

## Next Steps (Suggested Order)

1. **Shipments API** — `GET/POST /shipments`, `GET/PATCH/DELETE /shipments/:id`; wire to admin or user dashboard
2. **Apple Sign-In** — load Apple JS SDK, wire `loginWithApple` in `AuthModal`
3. **Deploy** — Railway (backend) + Vercel (frontend)
4. **CI/CD** — GitHub Actions for lint + build checks
