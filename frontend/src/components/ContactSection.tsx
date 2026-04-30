"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

export default function ContactSection({ dict }: { dict: Dictionary }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Placeholder — wire to email API in a later step
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  }

  return (
    <section
      id="contact"
      className="bg-gray-50 py-20 sm:py-28 min-h-screen flex flex-col justify-center"
    >
      <div className="w-[90%] mx-auto max-w-7xl lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
          {/* Left — image background panel */}
          <div className="relative px-8 py-12 sm:px-12 sm:py-16 flex flex-col justify-between overflow-hidden">
            {/* Background photo */}
            <Image
              src="/images/office_webP.webp"
              alt="Team Cargo office"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Dark overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(2,20,10,0.95) 0%, rgba(2,20,10,0.90) 17%, rgba(2,20,10,0.80) 33%, rgba(2,20,10,0.70) 50%, rgba(2,20,10,0.10) 100%)",
              }}
            />
            <div className="relative z-10">
              <span className="inline-block text-[#4dc95e] text-xs font-bold uppercase tracking-[0.25em] mb-3">
                Contact
              </span>
              <h2
                className="text-white font-extrabold tracking-tight mb-4 drop-shadow-lg"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
              >
                {dict.contact.title}
              </h2>
              <p className="text-white/80 mb-10 text-base leading-relaxed drop-shadow">
                {dict.contact.subtitle}
              </p>

              <div className="space-y-5">
                {[
                  {
                    Icon: Phone,
                    label: "WhatsApp",
                    value: "+31 6 85352412",
                    href: "https://wa.me/31685352412",
                  },
                  {
                    Icon: Mail,
                    label: "E-mail",
                    value: "info@teamcargo.nl",
                    href: "mailto:info@teamcargo.nl",
                  },
                  {
                    Icon: MapPin,
                    label: "Address",
                    value: "Poortland 146, 1046 BD Amsterdam",
                    href: "https://maps.google.com/?q=Poortland+146+Amsterdam",
                  },
                ].map(({ Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--brand-green)]/80 group-hover:bg-[var(--brand-green)] flex items-center justify-center shrink-0 transition-colors mt-0.5">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/40 uppercase tracking-wider">
                        {label}
                      </p>
                      <p className="text-white group-hover:text-[#4dc95e] font-semibold text-[0.92rem] transition-colors">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Bottom accent */}
            <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                Team Cargo &copy; 2026
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white px-8 py-12 sm:px-12 sm:py-16">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--brand-green)]/10 flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-[var(--brand-green)]" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {dict.contact.success}
                </h3>
                <p className="text-gray-500 text-sm">
                  {dict.contact.success_subtitle}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => void handleSubmit(e)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {dict.contact.name}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jan de Vries"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.92rem] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {dict.contact.email}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jan@bedrijf.nl"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.92rem] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {dict.contact.message}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Uw bericht..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.92rem] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-[var(--brand-btn-text)] font-bold rounded-xl transition-colors disabled:opacity-60 text-[0.92rem] tracking-widest"
                >
                  {loading ? (
                    "Verzenden..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {dict.contact.send}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
