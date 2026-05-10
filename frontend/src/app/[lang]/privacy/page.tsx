import type { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { isSupportedLanguage, defaultLang } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://teamcargo.be";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = isSupportedLanguage(lang) ? lang : defaultLang;
  const dict = await getDictionary(resolvedLang);
  return {
    title: `${dict.privacy.title} | Team Cargo`,
    alternates: { canonical: `${SITE_URL}/${resolvedLang}/privacy` },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const resolvedLang = isSupportedLanguage(lang) ? lang : defaultLang;
  const dict = await getDictionary(resolvedLang);
  const p = dict.privacy;

  return (
    <AuthProvider>
      <Header lang={resolvedLang} dict={dict} forceOpaque />
      <main className="flex-1 bg-white pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-[#36B347] text-xs font-bold uppercase tracking-[0.25em]">
            {p.label}
          </span>
          <h1
            className="text-gray-900 font-extrabold mt-3 mb-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
          >
            {p.title}
          </h1>
          <p className="text-gray-400 text-sm mb-10">{p.last_updated}</p>

          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-8">
            {/* 1. Who We Are */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s1_title}
              </h2>
              <p>{p.s1_p}</p>
              <p className="mt-2">
                {p.s1_email}{" "}
                <a
                  href="mailto:info@teamcargo.nl"
                  className="text-[#36B347] hover:underline"
                >
                  info@teamcargo.nl
                </a>
              </p>
            </section>

            {/* 2. What Data We Collect */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s2_title}
              </h2>
              <p>{p.s2_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {p.s2_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* 3. How We Use Your Data */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s3_title}
              </h2>
              <p>{p.s3_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {p.s3_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* 4. Legal Basis */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s4_title}
              </h2>
              <p>{p.s4_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {p.s4_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* 5. Data Sharing */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s5_title}
              </h2>
              <p>{p.s5_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {p.s5_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="mt-2 font-semibold text-gray-800">{p.s5_no_sell}</p>
            </section>

            {/* 6. Data Retention */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s6_title}
              </h2>
              <p>{p.s6_p}</p>
            </section>

            {/* 7. Your Rights */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s7_title}
              </h2>
              <p>{p.s7_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {p.s7_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* 8. Data Security */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s8_title}
              </h2>
              <p>{p.s8_p}</p>
            </section>

            {/* 9. Contact */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s9_title}
              </h2>
              <p>{p.s9_intro}</p>
              <p className="mt-2">
                {p.s1_email}{" "}
                <a
                  href="mailto:info@teamcargo.nl"
                  className="text-[#36B347] hover:underline"
                >
                  info@teamcargo.nl
                </a>
              </p>
            </section>

            {/* 10. Updates */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {p.s10_title}
              </h2>
              <p>{p.s10_p}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer lang={resolvedLang} dict={dict} />
      <AuthModal dict={dict} />
    </AuthProvider>
  );
}
