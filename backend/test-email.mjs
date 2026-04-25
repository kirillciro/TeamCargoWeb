import https from "https";
import { readFileSync } from "fs";

// Manually read .env
const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const apiKey = env.RESEND_API_KEY;
const from = env.EMAIL_FROM;
console.log("FROM:", from);
console.log("KEY prefix:", apiKey?.slice(0, 10));

const tlsAgent = new https.Agent({ maxVersion: "TLSv1.2" });
const body = JSON.stringify({
  from,
  to: "ciro.me@icloud.com",
  subject: "Email test from script",
  html: "<p>TLS fix test — direct from test-email.mjs</p>",
});

const req = https.request(
  {
    hostname: "api.resend.com",
    path: "/emails",
    method: "POST",
    agent: tlsAgent,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
  },
  (res) => {
    let d = "";
    res.on("data", (c) => (d += c));
    res.on("end", () => console.log("STATUS:", res.statusCode, "BODY:", d));
  },
);
req.on("error", (e) => console.error("ERROR:", e.message));
req.write(body);
req.end();
