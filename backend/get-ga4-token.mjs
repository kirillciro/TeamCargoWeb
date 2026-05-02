/**
 * One-time script to get a GA4 OAuth2 refresh token.
 *
 * Usage:
 *   GA4_CLIENT_ID=xxx GA4_CLIENT_SECRET=yyy node get-ga4-token.mjs
 *
 * It will:
 *  1. Print a Google auth URL — open it in your browser
 *  2. Start a local server on port 3333 to catch the callback
 *  3. Print the refresh token — paste it into .env as GA4_REFRESH_TOKEN
 */

import { createServer } from "http";
import { google } from "googleapis";

const CLIENT_ID = process.env.GA4_CLIENT_ID;
const CLIENT_SECRET = process.env.GA4_CLIENT_SECRET;
const REDIRECT = "http://localhost:3333/callback";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Error: set GA4_CLIENT_ID and GA4_CLIENT_SECRET before running this script.\n" +
      "  GA4_CLIENT_ID=xxx GA4_CLIENT_SECRET=yyy node get-ga4-token.mjs",
  );
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);

const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  prompt: "consent", // force refresh_token to be returned even if already authorized
  scope: ["https://www.googleapis.com/auth/analytics.readonly"],
});

console.log("\n────────────────────────────────────────────────────────────");
console.log("Open this URL in your browser:");
console.log("\n" + authUrl + "\n");
console.log("Waiting for the OAuth callback on http://localhost:3333 ...");
console.log("────────────────────────────────────────────────────────────\n");

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, REDIRECT);
    const code = url.searchParams.get("code");

    if (!code) {
      res.writeHead(400);
      res.end("Missing code parameter.");
      return;
    }

    const { tokens } = await oauth2.getToken(code);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h2>Success! You can close this tab.</h2>");
    server.close();

    console.log("────────────────────────────────────────────────────────────");
    console.log("✅  Add these lines to backend/.env:\n");
    console.log(`GA4_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(
      "\n────────────────────────────────────────────────────────────",
    );
  } catch (err) {
    console.error("Error exchanging code:", err);
    res.writeHead(500);
    res.end("Error. Check your terminal.");
    server.close();
  }
});

server.listen(3333);
