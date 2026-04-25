import { getDictionary } from "@/lib/getDictionary";
import { isSupportedLanguage, defaultLang } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { ShieldCheck, BarChart2, Settings } from "lucide-react";

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const resolvedLang = isSupportedLanguage(lang) ? lang : defaultLang;
  const dict = await getDictionary(resolvedLang);
  const c = dict.cookies_page;

  return (
    <AuthProvider>
      <Header lang={resolvedLang} dict={dict} />
      <main className="flex-1 bg-white pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-[#36B347] text-xs font-bold uppercase tracking-[0.25em]">
            {c.label}
          </span>
          <h1
            className="text-gray-900 font-extrabold mt-3 mb-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
          >
            {c.title}
          </h1>
          <p className="text-gray-400 text-sm mb-10">{c.last_updated}</p>

          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-8">
            {/* 1. What Are Cookies */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {c.s1_title}
              </h2>
              <p>{c.s1_p}</p>
            </section>

            {/* 2. Types of Cookies */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {c.s2_title}
              </h2>
              <div className="mt-3 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #36B347 0%, #1a7f45 100%)",
                    }}
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">
                      {c.s2_essential_title}
                    </p>
                    <p className="text-sm">{c.s2_essential_p}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #36B347 0%, #1a7f45 100%)",
                    }}
                  >
                    <BarChart2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">
                      {c.s2_analytics_title}
                    </p>
                    <p className="text-sm">{c.s2_analytics_p}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, #36B347 0%, #1a7f45 100%)",
                    }}
                  >
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">
                      {c.s2_functional_title}
                    </p>
                    <p className="text-sm">{c.s2_functional_p}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. How We Use Cookies */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {c.s3_title}
              </h2>
              <p>{c.s3_intro}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {c.s3_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* 4. Managing Cookies */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {c.s4_title}
              </h2>
              <p>{c.s4_p1}</p>
              <p className="mt-2">{c.s4_p2}</p>
            </section>

            {/* 5. Third-Party Cookies */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {c.s5_title}
              </h2>
              <p>{c.s5_p}</p>
            </section>

            {/* 6. Your Consent */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {c.s6_title}
              </h2>
              <p>{c.s6_p}</p>
            </section>

            {/* 7. Contact */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {c.s7_title}
              </h2>
              <p>{c.s7_intro}</p>
              <p className="mt-2">
                <a
                  href="mailto:info@teamcargo.nl"
                  className="text-[#36B347] hover:underline"
                >
                  info@teamcargo.nl
                </a>
              </p>
            </section>

            {/* 8. Updates */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {c.s8_title}
              </h2>
              <p>{c.s8_p}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer lang={resolvedLang} dict={dict} />
      <AuthModal dict={dict} />
    </AuthProvider>
  );
}
