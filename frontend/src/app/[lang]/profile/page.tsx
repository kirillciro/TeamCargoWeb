import { Suspense } from "react";
import { getDictionary } from "@/lib/getDictionary";
import { isSupportedLanguage, defaultLang } from "@/lib/i18n";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import ProfileDashboard from "@/components/ProfileDashboard";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const resolvedLang = isSupportedLanguage(lang) ? lang : defaultLang;
  const dict = await getDictionary(resolvedLang);

  return (
    <AuthProvider>
      <Header lang={resolvedLang} dict={dict} />
      <main className="flex-1 pt-20 sm:pt-24">
        <Suspense>
          <ProfileDashboard lang={resolvedLang} dict={dict} />
        </Suspense>
      </main>
      <AuthModal dict={dict} />
    </AuthProvider>
  );
}
