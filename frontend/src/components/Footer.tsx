import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/getDictionary";

const SITEMAP = (lang: string, dict: Dictionary) => [
  {
    title: dict.footer.col_company,
    links: [
      { label: dict.nav.services, href: `/${lang}#services` },
      { label: dict.nav.about, href: `/${lang}#about` },
      { label: dict.nav.contact, href: `/${lang}#contact` },
    ],
  },
  {
    title: dict.footer.col_legal,
    links: [
      { label: dict.footer.privacy, href: `/${lang}/privacy` },
      { label: dict.footer.cookies, href: `/${lang}/cookies` },
      { label: dict.footer.terms, href: `/${lang}/terms` },
    ],
  },
];

export default function Footer({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();
  const sitemap = SITEMAP(lang, dict);

  return (
    <footer className="bg-[#040f08] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        {/* Top section: brand left, nav columns right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-20 gap-12 mb-14">
          {/* Brand block — bottom on mobile, left on desktop */}
          <div className="lg:w-72 shrink-0 flex flex-col order-2 lg:order-1">
            <p className="text-white/65 text-sm leading-relaxed mb-4 tracking-wide">
              {dict.footer.tagline_sub}
            </p>
            <p className="text-white/50 text-xs leading-relaxed mb-5">
              Poortland 146, 1046 BD Amsterdam
              <br />
              Netherlands
            </p>
            <div className="flex flex-col gap-2 mb-6">
              <a
                href="https://wa.me/31685352412"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-xs transition-colors"
              >
                +31 6 85352412
              </a>
              <a
                href="mailto:info@teamcargo.nl"
                className="text-white/60 hover:text-white text-xs transition-colors"
              >
                info@teamcargo.nl
              </a>
            </div>
            <Image
              src="/logo.svg"
              alt="Team Cargo"
              width={180}
              height={60}
              className="h-14 w-auto object-contain object-left mt-auto self-start"
            />
          </div>

          {/* Nav columns — top on mobile, right on desktop */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-10 lg:flex lg:gap-24 lg:items-start lg:pt-0 order-1 lg:order-2">
            {sitemap.map((col) => (
              <div key={col.title}>
                <h3 className="text-white/50 font-bold text-[10px] uppercase tracking-[0.22em] mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/70 hover:text-white text-sm font-medium transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {year} Team Cargo. {dict.footer.rights}
          </p>
          <p className="text-white/35 text-xs">Geregistreerd in Nederland</p>
        </div>
      </div>
    </footer>
  );
}
