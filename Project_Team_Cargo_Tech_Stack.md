# Team Cargo Web — Technical Specification & Cost Estimate

> **Prepared for:** Client  
> **Prepared by:** Development Team  
> **Date:** May 14, 2026  
> **Location / Pricing Region:** Netherlands 🇳🇱  
> **Hourly Rate:** €80–€100 / hour (mid-senior full-stack developer, Netherlands market)

---

## 1. Project Overview

Team Cargo Web is a full-stack logistics platform consisting of:

- A **public marketing website** with multi-language support (18 languages)
- A **secure authentication system** (email/password, Google OAuth, Apple Sign-In)
- An **admin dashboard** for email inbox management, AI-powered cargo extraction, and WhatsApp notifications
- A **user profile dashboard**
- A **PostgreSQL relational database** with structured migrations
- **Google Analytics 4** integration for traffic and engagement insights

---

## 2. Architecture Overview

```
┌─────────────────────────────────────┐     ┌──────────────────────────────────────┐
│         FRONTEND (Next.js 16)       │────▶│         BACKEND (Express + TS)        │
│         Vercel (Deployment)         │     │         Railway (Deployment)          │
└─────────────────────────────────────┘     └──────────────────────────────────────┘
                                                            │
                                                   ┌────────▼────────┐
                                                   │   PostgreSQL DB  │
                                                   │   (Neon / RDS)   │
                                                   └─────────────────┘
```

---

## 3. Tech Stack

### 3.1 Frontend

| Technology              | Version             | Purpose                                      |
| ----------------------- | ------------------- | -------------------------------------------- |
| **Next.js**             | 16.2.4 (App Router) | React framework, SSR, routing, i18n segments |
| **React**               | 19.2.4              | UI component library                         |
| **TypeScript**          | ^5                  | Type-safe development                        |
| **Tailwind CSS**        | v4                  | Utility-first CSS framework                  |
| **Framer Motion**       | ^12                 | Animations (scroll reveal, transitions)      |
| **Lucide React**        | ^1.8                | Icon library                                 |
| **Recharts**            | ^3                  | Admin analytics chart components             |
| **@react-oauth/google** | ^0.13.5             | Google OAuth one-tap / credential flow       |
| **ESLint**              | ^9                  | Code linting                                 |

**Frontend Deployment Target:** Vercel

---

### 3.2 Backend

| Technology              | Version  | Purpose                                                     |
| ----------------------- | -------- | ----------------------------------------------------------- |
| **Node.js**             | LTS      | JavaScript runtime                                          |
| **Express**             | ^5.2.1   | HTTP server & REST API framework                            |
| **TypeScript**          | ^5.8.3   | Type-safe server code                                       |
| **PostgreSQL**          | —        | Relational database                                         |
| **pg**                  | ^8.14.1  | PostgreSQL Node.js driver                                   |
| **jsonwebtoken (JWT)**  | ^9.0.3   | Access token & refresh token generation/verification        |
| **bcryptjs**            | ^3.0.3   | Secure password hashing                                     |
| **cookie-parser**       | ^1.4.7   | httpOnly refresh token cookie handling                      |
| **helmet**              | ^8.1.0   | HTTP security headers (OWASP)                               |
| **cors**                | ^2.8.6   | Cross-Origin Resource Sharing policy                        |
| **express-rate-limit**  | ^8.5.1   | API rate limiting (brute-force protection)                  |
| **zod**                 | ^4.3.6   | Runtime request validation & schema enforcement             |
| **google-auth-library** | ^10.6.2  | Google ID token verification                                |
| **googleapis**          | ^171.4.0 | Google Analytics Data API v1beta (GA4)                      |
| **resend**              | ^6.10.0  | Transactional email delivery (verification, password reset) |
| **imapflow**            | ^1.3.2   | IMAP email sync (Gmail folder synchronisation)              |
| **mailparser**          | ^3.9.8   | Parse raw MIME email messages                               |
| **openai**              | ^6.34.0  | GPT-based AI cargo data extraction from PDFs                |
| **pdf-parse**           | ^1.1.4   | Extract raw text from PDF attachments                       |
| **twilio**              | ^6.0.0   | WhatsApp Business API (send cargo notifications)            |
| **cloudinary**          | ^2.10.0  | Cloud media storage (logo / avatar uploads)                 |
| **multer**              | ^2.1.1   | Multipart file upload middleware                            |
| **dotenv**              | ^17.4.2  | Environment variable management                             |
| **tsx**                 | ^4.19.4  | TypeScript execution for development                        |

**Backend Deployment Target:** Railway

---

### 3.3 Database

| Technology         | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| **PostgreSQL**     | Primary relational database                      |
| **SQL Migrations** | Versioned schema management (10 migration files) |

**Database tables:**

| Migration File            | Tables Created / Modified                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| `001_users.sql`           | `users` — OAuth columns, email verification, password reset tokens        |
| `002_shipments.sql`       | `shipments`                                                               |
| `003_emails.sql`          | `emails`, `email_attachments`, `cargo_extractions`                        |
| `004_emails_folders.sql`  | Adds `folder`, `is_read`, `body_html`, `raw_text`, `whatsapp_message_sid` |
| `005_email_deletions.sql` | `email_deletions` — IMAP re-sync blocklist                                |
| `006_app_settings.sql`    | `app_settings`                                                            |
| `007_driver_profiles.sql` | `driver_profiles`                                                         |
| `008_avatar.sql`          | Avatar column/table                                                       |
| `009_documents.sql`       | `documents`                                                               |
| `010_dob.sql`             | Date of birth column                                                      |

---

### 3.4 Third-Party Integrations

| Service                      | Purpose                                                     |
| ---------------------------- | ----------------------------------------------------------- |
| **Google OAuth 2.0**         | Sign-in with Google (ID token verification)                 |
| **Apple Sign-In**            | Sign-in with Apple (JWKS RS256 JWT verification)            |
| **Google Analytics 4 (GA4)** | Website traffic analytics via Data API v1beta               |
| **Resend**                   | Transactional email (verification + password reset emails)  |
| **Twilio WhatsApp**          | Send cargo data notifications via WhatsApp Business         |
| **OpenAI GPT**               | AI extraction of structured cargo data from PDF attachments |
| **Cloudinary**               | Media/image cloud storage for logo and avatar uploads       |
| **Gmail IMAP**               | Sync incoming emails and attachments into the database      |

---

## 4. Security Measures

| Measure                        | Implementation                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| **JWT Access + Refresh Token** | Access token stored in-memory (short-lived, 15 min); refresh token in httpOnly cookie (7 days) |
| **Refresh Token Rotation**     | New refresh token issued on every use; reuse detection invalidates all sessions                |
| **Password Hashing**           | bcrypt with salt rounds                                                                        |
| **HTTP Security Headers**      | Helmet middleware (XSS, MIME sniffing, clickjacking protection)                                |
| **CORS Policy**                | Restricted to allowed origins                                                                  |
| **Rate Limiting**              | express-rate-limit on auth endpoints (brute-force protection)                                  |
| **Input Validation**           | Zod schema validation on all API inputs                                                        |
| **Admin Role Guard**           | `requireAdmin` middleware; role cannot be self-modified                                        |
| **Email Verification**         | Time-limited token; verified flag required for full access                                     |
| **OWASP Compliance**           | Addresses Top 10 (injection, auth, exposure, access control, security misconfiguration)        |

---

## 5. Internationalisation (i18n)

- **18 language dictionaries** (JSON) for full UI translation
- **Languages:** English, Dutch, German, French, Spanish, Italian, Portuguese, Polish, Romanian, Czech, Hungarian, Greek, Latvian, Estonian, Finnish, Swedish, Danish, Norwegian
- **Next.js `[lang]` dynamic segment routing** for SEO-friendly language URLs

---

## 6. Features, Hours & Cost Estimate

> **Hourly rate:** €90/hour (Netherlands mid-senior, blended rate)  
> All estimates reflect actual development time including design, coding, testing, and integration.

---

### 6.1 Project Setup & Architecture

| Task                                               | Hours   | Cost (€90/hr) |
| -------------------------------------------------- | ------- | ------------- |
| Monorepo structure (frontend + backend + database) | 4h      | €360          |
| TypeScript config (frontend + backend)             | 2h      | €180          |
| ESLint + code quality tooling                      | 2h      | €180          |
| Environment variable setup & `.env` structure      | 2h      | €180          |
| Git repository setup                               | 1h      | €90           |
| **Subtotal**                                       | **11h** | **€990**      |

---

### 6.2 Frontend — Marketing Website

| Feature                                                    | Hours   | Cost (€90/hr) |
| ---------------------------------------------------------- | ------- | ------------- |
| Next.js App Router setup + `[lang]` routing                | 4h      | €360          |
| HeroSection (animated stats, partner marquee, mobile bg)   | 8h      | €720          |
| Trust line bar (between hero and partners)                 | 2h      | €180          |
| Header + navigation (desktop + mobile)                     | 6h      | €540          |
| Language Switcher dropdown (dark style, scrollbar styling) | 4h      | €360          |
| AboutSection                                               | 4h      | €360          |
| ServicesSection                                            | 5h      | €450          |
| HousingSection                                             | 5h      | €450          |
| ContactSection                                             | 5h      | €450          |
| Footer                                                     | 4h      | €360          |
| CookieBanner (GDPR compliant)                              | 5h      | €450          |
| Cookie Policy page                                         | 3h      | €270          |
| Privacy Policy page                                        | 3h      | €270          |
| Terms of Service page                                      | 3h      | €270          |
| Framer Motion scroll-reveal animations                     | 4h      | €360          |
| WebVitals integration                                      | 2h      | €180          |
| Sitemap (`sitemap.ts`)                                     | 2h      | €180          |
| Responsive design (mobile + tablet + desktop)              | 8h      | €720          |
| **Subtotal**                                               | **77h** | **€6,930**    |

---

### 6.3 Frontend — Internationalisation (i18n)

| Feature                                        | Hours   | Cost (€90/hr) |
| ---------------------------------------------- | ------- | ------------- |
| Dictionary loader + type system                | 4h      | €360          |
| 18-language JSON dictionary setup              | 12h     | €1,080        |
| i18n wiring across all sections and components | 8h      | €720          |
| Auth modal i18n (29 keys × 18 languages)       | 5h      | €450          |
| **Subtotal**                                   | **29h** | **€2,610**    |

---

### 6.4 Frontend — Authentication UI

| Feature                                                               | Hours   | Cost (€90/hr) |
| --------------------------------------------------------------------- | ------- | ------------- |
| AuthModal (login + register tabs, Escape key, backdrop close)         | 8h      | €720          |
| Login form (email + password)                                         | 3h      | €270          |
| Register form (full name, email, password, confirm)                   | 4h      | €360          |
| Google Sign-In button (dark theme, real SVG logo)                     | 4h      | €360          |
| Forgot password inline flow (send → confirmation → back)              | 6h      | €540          |
| Email verification pending banner + resend button                     | 4h      | €360          |
| AuthContext (login, register, Google, Apple, logout, session restore) | 8h      | €720          |
| auth-client.ts (fetchWithAuth, silent refresh, session-expired event) | 8h      | €720          |
| VerifiedBanner component                                              | 2h      | €180          |
| **Subtotal**                                                          | **47h** | **€4,230**    |

---

### 6.5 Frontend — Admin Dashboard

| Feature                                                   | Hours   | Cost (€90/hr) |
| --------------------------------------------------------- | ------- | ------------- |
| AdminDashboard layout (tabs, navigation)                  | 6h      | €540          |
| AdminEmailsTab (folder sidebar, email list, detail panel) | 12h     | €1,080        |
| AI extraction trigger + polling UI                        | 6h      | €540          |
| WhatsApp send button + status feedback                    | 4h      | €360          |
| User management table (search, pagination)                | 8h      | €720          |
| Role change + user delete actions                         | 4h      | €360          |
| Stats cards (total/verified/unverified users)             | 3h      | €270          |
| AdminCustomizationTab                                     | 4h      | €360          |
| Cloudinary logo upload UI                                 | 4h      | €360          |
| Recharts analytics charts                                 | 6h      | €540          |
| **Subtotal**                                              | **57h** | **€5,130**    |

---

### 6.6 Frontend — User Profile Dashboard

| Feature                 | Hours   | Cost (€90/hr) |
| ----------------------- | ------- | ------------- |
| ProfileDashboard layout | 4h      | €360          |
| View profile info       | 3h      | €270          |
| Change password form    | 4h      | €360          |
| **Subtotal**            | **11h** | **€990**      |

---

### 6.7 Backend — Authentication API

| Feature                                                         | Hours   | Cost (€90/hr) |
| --------------------------------------------------------------- | ------- | ------------- |
| Express server setup + middleware stack                         | 4h      | €360          |
| `POST /auth/register` (bcrypt, JWT pair, verification email)    | 5h      | €450          |
| `POST /auth/login` (password verify, JWT pair, httpOnly cookie) | 4h      | €360          |
| `POST /auth/refresh` (token rotation + reuse detection)         | 5h      | €450          |
| `POST /auth/logout` (cookie clear, token invalidation)          | 3h      | €270          |
| `GET /auth/me` (requireAuth middleware)                         | 2h      | €180          |
| `GET /auth/verify-email` (token verify, redirect)               | 4h      | €360          |
| `POST /auth/resend-verification` (rate-limited)                 | 3h      | €270          |
| `POST /auth/forgot-password` (time-limited token, always 200)   | 4h      | €360          |
| `POST /auth/reset-password` (token verify, bcrypt, invalidate)  | 5h      | €450          |
| `POST /auth/change-password` (requireAuth, blocks social-only)  | 4h      | €360          |
| `POST /auth/google` (google-auth-library, upsert user)          | 5h      | €450          |
| `POST /auth/apple` (JWKS fetch, RS256 verify)                   | 6h      | €540          |
| JWT helpers (generateTokens, verifyToken, hashToken)            | 4h      | €360          |
| requireAuth + requireAdmin middleware                           | 3h      | €270          |
| **Subtotal**                                                    | **61h** | **€5,490**    |

---

### 6.8 Backend — Email System (Transactional)

| Feature                           | Hours  | Cost (€90/hr) |
| --------------------------------- | ------ | ------------- |
| Resend integration setup          | 2h     | €180          |
| `sendVerificationEmail` template  | 3h     | €270          |
| `sendPasswordResetEmail` template | 3h     | €270          |
| **Subtotal**                      | **8h** | **€720**      |

---

### 6.9 Backend — IMAP Email Sync

| Feature                                         | Hours   | Cost (€90/hr) |
| ----------------------------------------------- | ------- | ------------- |
| imapflow integration + folder sync              | 6h      | €540          |
| Attachment parsing (mailparser + PDF storage)   | 6h      | €540          |
| Email deletions blocklist (re-sync prevention)  | 4h      | €360          |
| Admin sync endpoint (`POST /admin/emails/sync`) | 3h      | €270          |
| Paginated email list + folder counts API        | 5h      | €450          |
| Email detail + attachment serve endpoint        | 4h      | €360          |
| Mark as read / bulk delete API                  | 4h      | €360          |
| **Subtotal**                                    | **32h** | **€2,880**    |

---

### 6.10 Backend — AI Cargo Extraction (OpenAI)

| Feature                                            | Hours   | Cost (€90/hr) |
| -------------------------------------------------- | ------- | ------------- |
| pdf-parse integration (extract text from PDF)      | 3h      | €270          |
| OpenAI GPT prompt design for cargo data extraction | 6h      | €540          |
| Async extraction job + status polling endpoint     | 5h      | €450          |
| Store extraction result JSON in DB                 | 3h      | €270          |
| `POST /admin/emails/:id/extract/:aid`              | 3h      | €270          |
| `GET /admin/extractions/:id` (poll status)         | 2h      | €180          |
| **Subtotal**                                       | **22h** | **€1,980**    |

---

### 6.11 Backend — WhatsApp Notifications (Twilio)

| Feature                                              | Hours   | Cost (€90/hr) |
| ---------------------------------------------------- | ------- | ------------- |
| Twilio SDK integration                               | 3h      | €270          |
| `sendCargoWhatsApp(cargoData, subject)` helper       | 4h      | €360          |
| `POST /admin/extractions/:id/send-whatsapp` endpoint | 3h      | €270          |
| WhatsApp message SID storage in DB                   | 2h      | €180          |
| **Subtotal**                                         | **12h** | **€1,080**    |

---

### 6.12 Backend — Google Analytics 4 Integration

| Feature                                                  | Hours   | Cost (€90/hr) |
| -------------------------------------------------------- | ------- | ------------- |
| GA4 OAuth 2.0 setup + token helper                       | 4h      | €360          |
| Analytics Data API v1beta integration                    | 5h      | €450          |
| Sessions (today / week / month)                          | 2h      | €180          |
| Realtime active users                                    | 2h      | €180          |
| Top pages, device categories, traffic sources, countries | 4h      | €360          |
| Engagement rate, avg session duration, bounce rate       | 3h      | €270          |
| `get-ga4-token.mjs` OAuth helper script                  | 2h      | €180          |
| **Subtotal**                                             | **22h** | **€1,980**    |

---

### 6.13 Backend — Admin User Management

| Feature                                                 | Hours   | Cost (€90/hr) |
| ------------------------------------------------------- | ------- | ------------- |
| `GET /admin/users` (paginated, searchable)              | 4h      | €360          |
| `PATCH /admin/users/:id/role` (role change, self-guard) | 3h      | €270          |
| `DELETE /admin/users/:id` (self-delete guard)           | 3h      | €270          |
| `GET /admin/stats` (total/verified/unverified counts)   | 2h      | €180          |
| **Subtotal**                                            | **12h** | **€1,080**    |

---

### 6.14 Backend — Cloudinary Media Uploads

| Feature                       | Hours  | Cost (€90/hr) |
| ----------------------------- | ------ | ------------- |
| Cloudinary SDK integration    | 2h     | €180          |
| Multer file upload middleware | 2h     | €180          |
| Logo/avatar upload endpoint   | 4h     | €360          |
| **Subtotal**                  | **8h** | **€720**      |

---

### 6.15 Database Design & Migrations

| Feature                                                     | Hours   | Cost (€90/hr) |
| ----------------------------------------------------------- | ------- | ------------- |
| Schema design (users, shipments, emails, extractions)       | 6h      | €540          |
| `001_users.sql` — users table with all auth columns         | 3h      | €270          |
| `002_shipments.sql`                                         | 2h      | €180          |
| `003_emails.sql` — emails, attachments, extractions         | 4h      | €360          |
| `004_emails_folders.sql` — folder, read, html, WhatsApp SID | 3h      | €270          |
| `005_email_deletions.sql` — blocklist table                 | 2h      | €180          |
| `006_app_settings.sql` through `010_dob.sql`                | 6h      | €540          |
| `db.ts` PostgreSQL connection pool                          | 2h      | €180          |
| **Subtotal**                                                | **28h** | **€2,520**    |

---

## 7. Full Cost Summary

| #   | Module                                         | Hours    | Cost (€)    |
| --- | ---------------------------------------------- | -------- | ----------- |
| 1   | Project Setup & Architecture                   | 11h      | €990        |
| 2   | Frontend — Marketing Website                   | 77h      | €6,930      |
| 3   | Frontend — Internationalisation (18 languages) | 29h      | €2,610      |
| 4   | Frontend — Authentication UI                   | 47h      | €4,230      |
| 5   | Frontend — Admin Dashboard                     | 57h      | €5,130      |
| 6   | Frontend — User Profile Dashboard              | 11h      | €990        |
| 7   | Backend — Authentication API (JWT, OAuth)      | 61h      | €5,490      |
| 8   | Backend — Transactional Email (Resend)         | 8h       | €720        |
| 9   | Backend — IMAP Email Sync (Gmail)              | 32h      | €2,880      |
| 10  | Backend — AI Cargo Extraction (OpenAI)         | 22h      | €1,980      |
| 11  | Backend — WhatsApp Notifications (Twilio)      | 12h      | €1,080      |
| 12  | Backend — Google Analytics 4                   | 22h      | €1,980      |
| 13  | Backend — Admin User Management                | 12h      | €1,080      |
| 14  | Backend — Cloudinary Media Uploads             | 8h       | €720        |
| 15  | Database Design & Migrations                   | 28h      | €2,520      |
|     | **TOTAL**                                      | **437h** | **€39,330** |

---

## 8. Monthly Recurring Costs (Infrastructure)

> These are third-party service costs the client will pay on an ongoing basis, separate from development.

| Service                          | Plan                   | Est. Monthly Cost |
| -------------------------------- | ---------------------- | ----------------- |
| **Vercel** (Frontend hosting)    | Pro                    | ~€20/month        |
| **Railway** (Backend hosting)    | Starter / Pro          | ~€10–€25/month    |
| **PostgreSQL** (Neon or Railway) | Free–Starter           | €0–€20/month      |
| **Resend** (Email delivery)      | Free up to 3,000/month | €0–€20/month      |
| **Twilio WhatsApp**              | Pay-per-message        | ~€0.05–€0.10/msg  |
| **OpenAI API**                   | Pay-per-use (GPT-4o)   | ~€20–€80/month    |
| **Cloudinary**                   | Free tier / Plus       | €0–€45/month      |
| **Google Analytics 4**           | Free                   | €0                |
| **Twilio** (WhatsApp setup fee)  | One-time or sandbox    | €0–€15            |
| **Domain + SSL**                 | e.g. Namecheap         | ~€15/year         |

**Estimated monthly infrastructure:** ~€65–€225/month depending on usage volume.

---

## 9. Notes

- All prices are **excl. VAT (BTW)**. Dutch VAT is 21% and applies if applicable.
- The hourly rate used is **€90/hour** — representative of a mid-senior full-stack developer in the Netherlands (Amsterdam / remote NL market, 2025–2026).
- Estimates cover **design, development, integration, and basic testing**. QA, deployment, CI/CD pipeline setup, and post-launch support are **not included** and would be quoted separately.
- **Facebook OAuth** — not included; was out of scope per project spec.
- **Apple Sign-In frontend SDK** — partially implemented (backend fully ready, frontend UI trigger pending).
- **Shipments REST API** — database schema exists but API endpoints are pending (out of current scope).
- **Deployment (Vercel + Railway)** — not yet executed; estimated at **~8–12 hours (€720–€1,080)** additional if required.

---

_Document version 1.0 — Team Cargo Web, May 2026_
