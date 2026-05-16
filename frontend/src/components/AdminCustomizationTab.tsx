// THIS FILE IS THE THIN ROUTER — all tab content lives in ./admin-customization/
"use client";

import React, { Suspense, lazy } from "react";
import { Palette, Type, LayoutGrid, Users, Mail } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";
import {
  AdminCustomizationProvider,
  useAdminCustomization,
} from "./admin-customization/AdminCustomizationContext";
import type { SubTab } from "./admin-customization/types";

const HeaderTab = lazy(() => import("./admin-customization/HeaderTab"));
const ColorsTab = lazy(() => import("./admin-customization/ColorsTab"));
const FontsTab = lazy(() => import("./admin-customization/FontsTab"));
const HeroTab = lazy(() => import("./admin-customization/HeroTab"));
const ServicesTab = lazy(() => import("./admin-customization/ServicesTab"));
const AboutTab = lazy(() => import("./admin-customization/AboutTab"));
const ContactTab = lazy(() => import("./admin-customization/ContactTab"));
const FooterTab = lazy(() => import("./admin-customization/FooterTab"));

function AdminTabSwitcher() {
  const { subTab, setSubTab, win98 } = useAdminCustomization();

  if (win98) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap" as const,
          gap: 4,
          borderBottom: "2px solid #808080",
          paddingBottom: 6,
          marginBottom: 8,
        }}
      >
        {(
          [
            ["colors", "Colors"],
            ["fonts", "Fonts"],
            ["header", "Header"],
            ["hero", "Hero"],
            ["services", "Services"],
            ["about", "About"],
            ["contact", "Contact"],
            ["footer", "Footer"],
          ] as [SubTab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            style={{
              padding: "3px 12px",
              background: subTab === key ? "#fff" : "#c0c0c0",
              border: "2px solid",
              borderColor:
                subTab === key
                  ? "#808080 #fff #fff #808080"
                  : "#fff #808080 #808080 #fff",
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: "12px",
              cursor: "pointer",
              color: "#000",
              fontWeight: subTab === key ? "bold" : "normal",
              whiteSpace: "nowrap" as const,
              boxShadow: subTab === key ? "inset 1px 1px 0 #000" : undefined,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  const labels: Record<SubTab, string> = {
    colors: "Colors",
    fonts: "Fonts",
    header: "Header",
    hero: "Hero",
    services: "Services",
    about: "About",
    contact: "Contact",
    footer: "Footer",
  };
  const Icons: Record<SubTab, typeof Palette> = {
    colors: Palette,
    fonts: Type,
    header: LayoutGrid,
    hero: Type,
    services: LayoutGrid,
    about: Users,
    contact: Mail,
    footer: LayoutGrid,
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-1 bg-slate-800/60 rounded-xl p-1 w-full overflow-x-auto">
      {(Object.keys(labels) as SubTab[]).map((key) => {
        const Icon = Icons[key];
        return (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex-1 justify-center whitespace-nowrap ${
              subTab === key
                ? "bg-amber-400 text-amber-900"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {labels[key]}
          </button>
        );
      })}
    </div>
  );
}

function AdminTabContent() {
  const { subTab } = useAdminCustomization();
  return (
    <Suspense fallback={null}>
      {subTab === "header" && <HeaderTab />}
      {subTab === "colors" && <ColorsTab />}
      {subTab === "fonts" && <FontsTab />}
      {subTab === "hero" && <HeroTab />}
      {subTab === "services" && <ServicesTab />}
      {subTab === "about" && <AboutTab />}
      {subTab === "contact" && <ContactTab />}
      {subTab === "footer" && <FooterTab />}
    </Suspense>
  );
}

export default function AdminCustomizationTab({
  dict,
  win98 = false,
}: {
  dict: Dictionary;
  win98?: boolean;
}) {
  return (
    <AdminCustomizationProvider dict={dict} win98={win98}>
      <div
        className={win98 ? "" : "max-w-[83.6352rem] mx-auto space-y-6"}
        style={win98 ? { padding: 0 } : undefined}
      >
        {!win98 && (
          <h2 className="text-lg font-bold text-white">
            {dict.admin.tab_customization}
          </h2>
        )}
        <AdminTabSwitcher />
        <AdminTabContent />
      </div>
    </AdminCustomizationProvider>
  );
}
