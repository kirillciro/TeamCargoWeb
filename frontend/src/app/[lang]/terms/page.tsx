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
    title: `${dict.terms_page.title} | Team Cargo`,
    alternates: { canonical: `${SITE_URL}/${resolvedLang}/terms` },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const resolvedLang = isSupportedLanguage(lang) ? lang : defaultLang;
  const dict = await getDictionary(resolvedLang);
  const t = dict.terms_page;

  return (
    <AuthProvider>
      <Header lang={resolvedLang} dict={dict} forceOpaque />
      <main className="flex-1 bg-white pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-[#36B347] text-xs font-bold uppercase tracking-[0.25em]">
            {t.label}
          </span>
          <h1
            className="text-gray-900 font-extrabold mt-3 mb-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
          >
            {t.title}
          </h1>
          <p className="text-gray-400 text-sm mb-10">{t.last_updated}</p>

          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-8">
            <section>
              <p>{t.intro}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s1_title}
              </h2>
              <p>{t.s1_p}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s2_title}
              </h2>
              <p>{t.s2_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {t.s2_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-gray-500 italic">{t.s2_note}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s3_title}
              </h2>
              <p>{t.s3_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {t.s3_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s4_title}
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {t.s4_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s6_title}
              </h2>
              <p>{t.s6_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {t.s6_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="mt-2">{t.s6_note}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s7_title}
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {t.s7_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s8_title}
              </h2>
              <p>{t.s8_p}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s9_title}
              </h2>
              <p>{t.s9_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {t.s9_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s10_title}
              </h2>
              <p>
                {t.s10_p}{" "}
                <a
                  href={`/${resolvedLang}/privacy`}
                  className="text-[#36B347] hover:underline"
                >
                  {t.s10_link}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s11_title}
              </h2>
              <p>{t.s11_p}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s12_title}
              </h2>
              <p>{t.s12_intro}</p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href="mailto:info@teamcargo.nl"
                  className="text-[#36B347] hover:underline"
                >
                  info@teamcargo.nl
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {t.s13_title}
              </h2>
              <p>{t.s13_p}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer lang={resolvedLang} dict={dict} />
      <AuthModal dict={dict} />
    </AuthProvider>
  );
}
