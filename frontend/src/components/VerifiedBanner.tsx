"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, X } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";
import { useAuth } from "@/context/AuthContext";
import { setAccessToken } from "@/lib/auth-client";

export default function VerifiedBanner({ dict }: { dict: Dictionary }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openAuth, refreshUser } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const autoLoggedIn = useRef(false);

  useEffect(() => {
    const v = searchParams.get("verified");
    const token = searchParams.get("token");
    if (!v) return;

    // Clean both params from the URL without reloading
    const url = new URL(window.location.href);
    url.searchParams.delete("verified");
    url.searchParams.delete("token");
    router.replace(url.pathname + (url.search || ""), { scroll: false });

    if (token && (v === "success" || v === "already")) {
      // Auto-login: store token then fetch user profile
      setAccessToken(token);
      autoLoggedIn.current = true;
      refreshUser().catch(() => {});
    }

    queueMicrotask(() => setStatus(v));
  }, [searchParams, router, refreshUser]);

  useEffect(() => {
    // Only open login modal if we didn't auto-login via token
    if (
      (status === "success" || status === "already") &&
      !autoLoggedIn.current
    ) {
      const t = setTimeout(() => openAuth("login"), 600);
      return () => clearTimeout(t);
    }
  }, [status, openAuth]);

  if (!status) return null;

  const isSuccess = status === "success" || status === "already";

  const message = isSuccess
    ? status === "already"
      ? dict.auth.verified_already
      : dict.auth.verified_success
    : status === "expired"
      ? dict.auth.verified_expired
      : dict.auth.verified_invalid;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-200 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl border text-sm font-medium transition-all
        ${
          isSuccess
            ? "bg-[#0d3d1e] border-[#1a7f45] text-[#c8e6d4]"
            : "bg-[#2a0a0a] border-[#7f1a1a] text-[#f5b4b4]"
        }`}
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-[#4dc95e] shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-[#e05252] shrink-0" />
      )}
      <span>{message}</span>
      <button
        onClick={() => setStatus(null)}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
