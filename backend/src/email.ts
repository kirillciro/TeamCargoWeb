import nodemailer from "nodemailer";

// Use Resend's SMTP endpoint — bypasses the Node 24 + Cloudflare TLS 1.3
// ECONNRESET issue that affects Resend's HTTPS API in tsx processes.
// smtp.resend.com:465 uses plain SSL (not Cloudflare CDN), so no TLS 1.3 conflict.
function getTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER ?? "",
      pass: process.env.GMAIL_APP_PASSWORD ?? "",
    },
  });
}

async function resendSend(payload: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const transport = getTransport();
  await transport.sendMail(payload);
}

const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const SITE_NAME = "Team Cargo";
const YEAR = new Date().getFullYear();

// ── Shared layout ──────────────────────────────────────────────────────────

function emailWrapper(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${SITE_NAME}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0d1a12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <!-- Preview text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}&nbsp;‌​‍‎‏﻿ ​‍‎‏﻿ ​‍‎‏﻿</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1a12;padding:40px 16px 48px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- ── Logo ── -->
        <tr><td align="center" style="padding-bottom:32px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1a7f45;border-radius:12px;padding:11px 20px;">
                <span style="font-size:17px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  Team&nbsp;Cargo
                </span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- ── Card ── -->
        <tr><td style="background:#111f16;border-radius:20px;border:1px solid #1e3a26;overflow:hidden;">

          <!-- Green accent bar -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:linear-gradient(90deg,#1a7f45 0%,#0d3d1e 100%);height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>

          <!-- Card content -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:44px 44px 40px;">
              ${content}
            </td></tr>
          </table>

        </td></tr>

        <!-- ── Footer ── -->
        <tr><td align="center" style="padding-top:28px;">
          <p style="margin:0 0 6px;font-size:12px;color:#2d5c3d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            © ${YEAR} Team Cargo · Driver Recruitment · Amsterdam, NL
          </p>
          <p style="margin:0;font-size:11px;color:#1e3a26;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            You received this because you signed up at teamcargo.eu. If you didn't, ignore this email.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// ── Email: Verify ──────────────────────────────────────────────────────────

export async function sendVerificationEmail(
  to: string,
  firstName: string,
  verifyUrl: string,
): Promise<void> {
  const content = `
    <!-- Icon ring -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
      <tr>
        <td align="center" style="width:64px;height:64px;border-radius:50%;background:#0d3d1e;border:2px solid #1a7f45;">
          <img src="https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/svg/2709.svg"
               width="28" height="28" alt="✉" style="display:block;margin:18px auto 0;" />
        </td>
      </tr>
    </table>

    <!-- Heading -->
    <h1 style="margin:0 0 12px;font-size:26px;font-weight:800;color:#e8f5ed;line-height:1.25;text-align:center;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Confirm your email
    </h1>

    <!-- Body text -->
    <p style="margin:0 0 8px;font-size:15px;line-height:1.75;color:#7ab894;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Hey <strong style="color:#c8e6d4;">${firstName}</strong>, welcome to <strong style="color:#c8e6d4;">${SITE_NAME}</strong>!
    </p>
    <p style="margin:0 0 32px;font-size:15px;line-height:1.75;color:#5a8c70;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Click the button below to verify your email address and activate your account.<br/>
      <span style="font-size:13px;color:#2d5c3d;">This link is valid for <strong style="color:#4dc95e;">24 hours</strong>.</span>
    </p>

    <!-- CTA button -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 36px;">
      <tr>
        <td style="border-radius:12px;background:#1a7f45;box-shadow:0 4px 24px rgba(26,127,69,0.35);">
          <a href="${verifyUrl}"
             style="display:inline-block;padding:15px 44px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.1px;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            Verify email address &rarr;
          </a>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr><td style="border-top:1px solid #1e3a26;font-size:0;line-height:0;">&nbsp;</td></tr>
    </table>

    <!-- Fallback link -->
    <p style="margin:0 0 6px;font-size:12px;color:#2d5c3d;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Button not working? Copy this link into your browser:
    </p>
    <p style="margin:0 0 20px;font-size:11px;color:#1e3a26;word-break:break-all;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      ${verifyUrl}
    </p>

    <!-- Didn't sign up note -->
    <p style="margin:0;font-size:12px;color:#2d5c3d;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Didn't create an account? You can safely ignore this email.
    </p>
  `;

  await resendSend({
    from: FROM,
    to,
    subject: `Confirm your email – ${SITE_NAME}`,
    html: emailWrapper(
      content,
      `Welcome to Team Cargo, ${firstName}! Please verify your email address.`,
    ),
  });
}

// ── Email: Password Reset ──────────────────────────────────────────────────

export async function sendPasswordResetEmail(
  to: string,
  firstName: string,
  resetUrl: string,
): Promise<void> {
  const content = `
    <!-- Icon ring -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
      <tr>
        <td align="center" style="width:64px;height:64px;border-radius:50%;background:#1a0808;border:2px solid #7f1a1a;">
          <img src="https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/svg/1f510.svg"
               width="28" height="28" alt="🔐" style="display:block;margin:18px auto 0;" />
        </td>
      </tr>
    </table>

    <!-- Heading -->
    <h1 style="margin:0 0 12px;font-size:26px;font-weight:800;color:#e8f5ed;line-height:1.25;text-align:center;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Reset your password
    </h1>

    <!-- Body text -->
    <p style="margin:0 0 8px;font-size:15px;line-height:1.75;color:#7ab894;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Hey <strong style="color:#c8e6d4;">${firstName}</strong>, we received a password reset request for your account.
    </p>
    <p style="margin:0 0 32px;font-size:15px;line-height:1.75;color:#5a8c70;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Click the button below to set a new password.<br/>
      <span style="font-size:13px;color:#2d5c3d;">This link expires in <strong style="color:#e05252;">15 minutes</strong>.</span>
    </p>

    <!-- CTA button -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 36px;">
      <tr>
        <td style="border-radius:12px;background:#0d3d1e;border:1px solid #1a7f45;box-shadow:0 4px 24px rgba(0,0,0,0.4);">
          <a href="${resetUrl}"
             style="display:inline-block;padding:15px 44px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.1px;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            Reset password &rarr;
          </a>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr><td style="border-top:1px solid #1e3a26;font-size:0;line-height:0;">&nbsp;</td></tr>
    </table>

    <!-- Fallback link -->
    <p style="margin:0 0 6px;font-size:12px;color:#2d5c3d;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Button not working? Copy this link into your browser:
    </p>
    <p style="margin:0 0 20px;font-size:11px;color:#1e3a26;word-break:break-all;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      ${resetUrl}
    </p>

    <!-- Didn't request note -->
    <p style="margin:0;font-size:12px;color:#2d5c3d;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      Didn't request this? Your account is safe — you can ignore this email.
    </p>
  `;

  await resendSend({
    from: FROM,
    to,
    subject: `Reset your password – ${SITE_NAME}`,
    html: emailWrapper(
      content,
      `Password reset requested for your ${SITE_NAME} account.`,
    ),
  });
}
