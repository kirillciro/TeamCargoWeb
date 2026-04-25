import { Suspense } from "react";
import { getDictionary } from "@/lib/getDictionary";
import { isSupportedLanguage, defaultLang } from "@/lib/i18n";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage({
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
      <main className="flex-1">
        <Suspense>
          <AdminDashboard lang={resolvedLang} dict={dict} />
        </Suspense>
      </main>
      <AuthModal dict={dict} />
    </AuthProvider>
  );
}
