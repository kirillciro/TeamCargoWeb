"use client";

import { useEffect, useRef, useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiForgotPassword, apiResendVerification } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/getDictionary";

export default function AuthModal({ dict }: { dict: Dictionary }) {
  const { authOpen, authTab, closeAuth, login, register } = useAuth();
  if (!authOpen) return null;
  return (
    <AuthModalInner
      key={authTab}
      initTab={authTab}
      closeAuth={closeAuth}
      login={login}
      register={register}
      dict={dict}
    />
  );
}

function AuthModalInner({
  initTab,
  closeAuth,
  login,
  register,
  dict,
}: {
  initTab: "login" | "register";
  closeAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  dict: Dictionary;
}) {
  const a = dict.auth;
  const [tab, setTab] = useState<"login" | "register">(initTab);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeAuth]);

  function switchTab(t: "login" | "register") {
    setTab(t);
    setError(null);
    setInfo(null);
    setVerificationPending(false);
    setRegisterSuccess(false);
    setShowForgot(false);
    setForgotSent(false);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await login(fd.get("email") as string, fd.get("password") as string);
    } catch (err) {
      const msg = err instanceof Error ? err.message : a.error_generic;
      if (msg.toLowerCase().includes("verify")) {
        setVerificationPending(true);
        setInfo(a.verify_email_desc);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const firstName = (fd.get("firstName") as string).trim();
    const lastName = (fd.get("lastName") as string).trim();
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const confirm = fd.get("confirm") as string;

    if (password !== confirm) {
      setError(a.passwords_no_match);
      return;
    }
    if (password.length < 8) {
      setError(a.password_too_short);
      return;
    }

    setLoading(true);
    try {
      await register(firstName, lastName, email, password);
      setRegisterEmail(email);
      setRegisterSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : a.error_generic);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiForgotPassword(forgotEmail);
    } catch {
      // Never reveal whether email exists
    } finally {
      setLoading(false);
      setForgotSent(true);
    }
  }

  async function handleResend() {
    const email = registerSuccess
      ? registerEmail
      : (emailRef.current?.value ?? "");
    if (!email) return;
    await apiResendVerification(email);
    setInfo(a.verify_email_desc);
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) closeAuth();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Green top bar */}
        <div className="bg-[#1a7f45] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="auth-modal-title"
                className="text-white font-extrabold text-xl tracking-tight"
              >
                {registerSuccess
                  ? a.verify_email_title
                  : showForgot
                    ? a.forgot_title
                    : tab === "login"
                      ? a.login_title
                      : a.register_title}
              </h2>
              <p className="text-white/80 text-sm mt-0.5">
                {registerSuccess
                  ? a.verify_email_desc_short
                  : showForgot
                    ? a.forgot_desc
                    : tab === "login"
                      ? a.welcome_login
                      : a.welcome_register}
              </p>
            </div>
            <button
              onClick={closeAuth}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Tab switcher — hidden when showing forgot or register success */}
          {!showForgot && !registerSuccess && (
            <div className="flex gap-1 mt-4 bg-white/20 rounded-lg p-1">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className={`flex-1 py-1.5 rounded-md text-sm font-bold transition-colors ${
                    tab === t
                      ? "bg-white text-brand-dark"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {t === "login" ? a.login_title : a.register_title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-6">
          {/* Feedback banners */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
              {info}
              {verificationPending && (
                <button
                  onClick={() => void handleResend()}
                  className="ml-2 underline text-green-800 hover:text-green-900"
                >
                  {a.resend_email}
                </button>
              )}
            </div>
          )}

          {/* ── Register success: verify email screen ── */}
          {registerSuccess ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#1a7f45]" />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {a.verify_email_desc}
              </p>
              <p className="text-xs text-gray-400 mb-5">{registerEmail}</p>
              <button
                onClick={() => void handleResend()}
                className="text-sm text-[#1a7f45] font-semibold hover:underline"
              >
                {a.resend_email}
              </button>
              <div className="mt-4">
                <button
                  onClick={() => switchTab("login")}
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                >
                  {a.back_to_login}
                </button>
              </div>
            </div>
          ) : /* ── Forgot password ── */
          showForgot ? (
            forgotSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-5 h-5 text-[#1a7f45]" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {a.reset_sent_desc}
                </p>
                <button
                  onClick={() => {
                    setShowForgot(false);
                    setForgotSent(false);
                  }}
                  className="text-sm text-[#1a7f45] font-semibold hover:underline"
                >
                  {a.back_to_login}
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => void handleForgot(e)}
                className="space-y-4"
              >
                <label className="block">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {a.email}
                  </span>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder={a.email}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 font-bold rounded-xl disabled:opacity-60 text-sm"
                  style={{
                    background: "var(--brand-dark)",
                    color: "var(--brand-btn-text)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--brand-mid)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--brand-dark)")
                  }
                >
                  {loading ? a.sending : a.send_reset_link}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 text-center"
                >
                  {a.back_to_login}
                </button>
              </form>
            )
          ) : tab === "login" ? (
            <>
              {/* Google — login only */}
              <button
                type="button"
                onClick={() => {
                  /* wire up Google OAuth */
                }}
                className="w-full flex items-center justify-center gap-3 bg-[#131314] hover:bg-[#2a2a2b] border border-[#131314] rounded-xl py-3 text-sm font-semibold text-white transition-colors mb-4"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {a.continue_google}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">
                  {a.or}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Login form */}
              <form onSubmit={(e) => void handleLogin(e)} className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {a.email}
                  </span>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={emailRef}
                      name="email"
                      type="email"
                      required
                      placeholder={a.email}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>
                </label>

                <label className="block">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {a.password}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgot(true);
                        setError(null);
                      }}
                      className="text-xs text-[#1a7f45] hover:underline font-medium"
                    >
                      {a.forgot_password}
                    </button>
                  </div>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 font-bold rounded-xl disabled:opacity-60 text-sm tracking-wide"
                  style={{
                    background: "var(--brand-dark)",
                    color: "var(--brand-btn-text)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--brand-mid)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--brand-dark)")
                  }
                >
                  {loading ? a.loading : a.login_btn}
                </button>
              </form>
            </>
          ) : (
            /* Register form */
            <form
              onSubmit={(e) => void handleRegister(e)}
              className="space-y-4"
            >
              {/* First name + Last name side by side */}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {a.first_name}
                  </span>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="firstName"
                      type="text"
                      required
                      placeholder={a.first_name}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {a.last_name}
                  </span>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="lastName"
                      type="text"
                      required
                      placeholder={a.last_name}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {a.email}
                </span>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={a.email}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {a.password}
                </span>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {a.confirm_password}
                </span>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="confirm"
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 font-bold rounded-xl disabled:opacity-60 text-sm tracking-wide"
                style={{
                  background: "var(--brand-dark)",
                  color: "var(--brand-btn-text)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--brand-mid)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--brand-dark)")
                }
              >
                {loading ? a.loading : a.register_btn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
