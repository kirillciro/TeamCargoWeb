# Team Cargo Web — Project Status

> Last updated: 21 April 2026

---

## Stack

| Layer       | Tech                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------- |
| Frontend    | Next.js 16 (App Router), TypeScript, Tailwind CSS v4                                          |
| Backend     | Express + TypeScript, PostgreSQL, JWT                                                         |
| i18n        | 18 JSON dictionaries (en, nl, de, fr, es, it, pt, pl, ro, cs, hu, el, lv, et, fi, sv, da, no) |
| Auth tokens | Access token → localStorage (`tc_access_token`), Refresh token → httpOnly cookie              |

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
| `POST /auth/register`            | ✅ bcrypt hash, JWT pair, refresh cookie                                               |
| `POST /auth/login`               | ✅ password verify, JWT pair, refresh cookie                                           |
| `POST /auth/refresh`             | ✅ rotation, reuse detection                                                           |
| `POST /auth/logout`              | ✅ clears token hash + cookie                                                          |
| `GET /auth/me`                   | ✅ requires `requireAuth` middleware                                                   |
| `POST /auth/google`              | ✅ verifies Google ID token via `google-auth-library`, upserts user                    |
| `POST /auth/apple`               | ⚠️ MVP only — decodes JWT payload but **does NOT verify Apple's public key signature** |
| `POST /auth/forgot-password`     | ❌ **endpoint does not exist yet**                                                     |
| `POST /auth/resend-verification` | ❌ **endpoint does not exist yet**                                                     |

### Backend — Auth helpers (`backend/src/auth.ts`)

- `generateTokens` — access + refresh JWT pair ✅
- `verifyToken` / `verifyRefreshToken` ✅
- `hashToken` — SHA-256 for DB storage ✅

---

## ❌ Not Done — Auth (must finish before Admin dash)

### 1. Email service (`backend/src/email.ts` — missing file)

- [ ] Choose provider: **Resend** (recommended) or Nodemailer/SES
- [ ] `sendPasswordResetEmail(to, resetLink)` helper
- [ ] `sendVerificationEmail(to, verificationLink)` helper

### 2. `POST /auth/forgot-password`

- [ ] Accept `{ email }`, look up user
- [ ] Generate a short-lived signed token (e.g. 1-hour JWT or random + DB expiry)
- [ ] Store `password_reset_token_hash` + `password_reset_expires_at` on user row
- [ ] Call `sendPasswordResetEmail`
- [ ] Always return 200 (avoid email enumeration)

### 3. `POST /auth/reset-password`

- [ ] Accept `{ token, newPassword }`
- [ ] Verify token hash + expiry
- [ ] bcrypt hash + update `password_hash`, clear reset token fields
- [ ] Invalidate existing refresh tokens (`refresh_token_hash = NULL`)

### 4. `POST /auth/resend-verification`

- [ ] Accept `{ email }`
- [ ] Generate + store verification token
- [ ] Call `sendVerificationEmail`
- [ ] Rate-limit (e.g. max 3 per hour per email)

### 5. `GET /auth/verify-email?token=…`

- [ ] Verify token, set `is_verified = TRUE`, clear token
- [ ] Redirect to frontend with `?verified=1`

### 6. Database migrations needed

- [ ] Add columns to `users`: `password_reset_token_hash`, `password_reset_expires_at`, `email_verification_token_hash`, `email_verification_expires_at`
- [ ] Register currently sets `is_verified = TRUE` — **fix to `FALSE`** once verification email flow is wired

### 7. Apple OAuth — production hardening

- [ ] Replace base64 decode with proper Apple public-key JWT verification (use `apple-signin-auth` or manual JWKS fetch)
- [ ] Frontend: integrate Apple Sign-In JS SDK and wire `apiAppleAuth` call in AuthModal

### 8. Google OAuth — frontend wiring

- [ ] Add `@react-oauth/google` or load `accounts.google.com/gsi/client` script
- [ ] Wire `apiGoogleAuth(credential)` to the Google button `onClick` in AuthModal (currently a comment placeholder)
- [ ] Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` env var

### 9. AuthContext / session persistence

- [ ] On app load, call `apiMe` (or `refreshAccessToken`) to restore session from cookie
- [ ] Handle `auth:session-expired` event globally (show login modal or redirect)
- [ ] `isLoading` state during initial session check to avoid flash of unauthenticated UI

---

## 🔲 Next — Admin Dashboard (after auth is complete)

### Pages / routing

- [ ] `/[lang]/admin` — protected route, `requireAdmin` on all API calls
- [ ] Redirect non-admins to homepage
- [ ] Sidebar nav: Users, Inquiries, Content, Settings

### Features (rough priority order)

1. **Users table** — list, search, promote/demote role, toggle `is_verified`, delete
2. **Inquiry / contact submissions** — view + respond to contact form entries (need `contacts` DB table)
3. **Content management** — edit marketing copy stored in DB (already have `content_translations` table from `002_content.sql`?)
4. **Email log** — view sent emails (if using Resend, use their `list-emails` API)
5. **Settings** — site-wide config (maintenance mode, feature flags)

### Backend

- [ ] `GET /admin/users` — paginated user list
- [ ] `PATCH /admin/users/:id` — update role / verified status
- [ ] `DELETE /admin/users/:id` — soft delete or hard delete
- [ ] `GET /admin/contacts` — list contact submissions
- [ ] Admin middleware already exists (`requireAdmin` in `middleware.ts`) ✅

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
APPLE_TEAM_ID=          # needed for Apple prod verification
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=
EMAIL_FROM=             # e.g. noreply@teamcargo.eu
RESEND_API_KEY=         # if using Resend
FRONTEND_URL=
NODE_ENV=
PORT=4000
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

---

## Suggested Immediate Next Steps

1. **Create `backend/src/email.ts`** with Resend (simplest setup, great DX)
2. **Add DB migration** for reset/verification token columns
3. **Wire `POST /auth/forgot-password` + `POST /auth/verify-email` + `POST /auth/reset-password`**
4. **Fix Register endpoint** → set `is_verified = FALSE` + send verification email
5. **Wire Google button** in AuthModal with `@react-oauth/google`
6. **Apple OAuth** — production key verification
7. → Then start Admin Dashboard
