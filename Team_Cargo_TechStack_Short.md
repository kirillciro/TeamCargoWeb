_Team Cargo Web — Tech Stack Overview_

---

_Frontend_
• Next.js 16 (App Router) + React 19
• TypeScript
• Tailwind CSS v4
• Framer Motion (animations)
• Recharts (admin charts)
• Deployed on Vercel

_Backend_
• Node.js + Express + TypeScript
• JWT authentication (access token in-memory + refresh token in httpOnly cookie)
• bcrypt password hashing
• PostgreSQL database
• Zod input validation
• Helmet + CORS + Rate Limiting (security)
• Deployed on Railway

_Authentication_
• Email / Password (with email verification)
• Google OAuth 2.0
• Apple Sign-In (RS256 JWKS verification)
• Forgot password / reset password flow

_Third-Party Integrations_
• Resend — transactional emails (verification, password reset)
• Twilio WhatsApp — cargo notifications via WhatsApp Business
• OpenAI GPT — AI extraction of cargo data from PDF attachments
• Gmail IMAP — email inbox sync into admin dashboard
• Cloudinary — image/logo cloud storage
• Google Analytics 4 — traffic & engagement data via GA4 Data API

_Database_
• PostgreSQL with 10 versioned SQL migrations
• Tables: users, shipments, emails, email_attachments, cargo_extractions, driver_profiles, documents, app_settings, and more

_Internationalisation_
• 18 languages: EN, NL, DE, FR, ES, IT, PT, PL, RO, CS, HU, EL, LV, ET, FI, SV, DA, NO

_Admin Dashboard_
• Email inbox (IMAP sync, folder management)
• AI cargo extraction from PDF attachments
• WhatsApp send integration
• User management (roles, search, pagination)
• Google Analytics live stats

_Security_
• JWT token rotation with reuse detection
• httpOnly cookies (XSS-safe refresh tokens)
• Rate limiting on all auth endpoints
• OWASP Top 10 compliant
