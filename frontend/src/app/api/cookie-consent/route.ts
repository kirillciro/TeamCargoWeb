import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { value } = (await req.json()) as { value: string };

  if (value !== "accepted" && value !== "rejected") {
    return NextResponse.json({ error: "Invalid value" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  // Set via HTTP header — bypasses Safari ITP 7-day cap on JS-written cookies
  res.cookies.set("cookie_consent", value, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
    httpOnly: false, // needs to be readable by client JS for the check
  });

  return res;
}
