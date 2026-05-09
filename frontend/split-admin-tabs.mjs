#!/usr/bin/env node
// Migration script: splits AdminCustomizationTab.tsx into per-tab components.
// Run: node split-admin-tabs.mjs (from the frontend directory)

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC = join(__dirname, "src/components/AdminCustomizationTab.tsx");
const DEST_DIR = join(__dirname, "src/components/admin-customization");

mkdirSync(DEST_DIR, { recursive: true });

const lines = readFileSync(SRC, "utf8").split("\n");
console.log(`Read ${lines.length} lines from AdminCustomizationTab.tsx`);

// ── Tab section boundaries (1-indexed, inclusive) ──────────────────────────
// These match the documented line boundaries from our analysis:
const SECTIONS = [
  {
    name: "HeaderTab",
    subtab: "header",
    modernStart: 1978,
    modernEnd: 2051,
    win98Start: 2051,
    win98End: 2209,
    imports: `import React from "react";
import { LS_HEADER } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";`,
    extraState: `const {
    win98,
    headerTransparent, setHeaderTransparent,
    headerSaved, setHeaderSaved,
  } = useAdminCustomization();`,
  },
  {
    name: "ColorsTab",
    subtab: "colors",
    modernStart: 2209,
    modernEnd: 2357,
    win98Start: 2357,
    win98End: 2689,
    imports: `import React from "react";
import { Check, Save, RotateCcw } from "lucide-react";
import { useAdminCustomization } from "./AdminCustomizationContext";`,
    extraState: `const {
    win98, dict,
    colors, colorSaved, colorFields,
    applyColor, saveColors, resetColors,
  } = useAdminCustomization();`,
  },
  {
    name: "FontsTab",
    subtab: "fonts",
    modernStart: 2689,
    modernEnd: 2908,
    win98Start: 2908,
    win98End: 3350,
    imports: `import React from "react";
import { FONT_OPTIONS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";`,
    extraState: `const {
    win98,
    selectedFont, letterSpacing, lineHeight, fontWeight, fontSaved,
    applyFont, saveFont, resetFont,
    applyLetterSpacing, applyLineHeight, applyFontWeight,
  } = useAdminCustomization();`,
  },
  {
    name: "HeroTab",
    subtab: "hero",
    modernStart: 3350,
    modernEnd: 4128,
    win98Start: 4128,
    win98End: 5167,
    imports: `import React from "react";
import { Loader2, Check, Save, RotateCcw, Shield } from "lucide-react";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { DEFAULT_PARTNERS, TRUST_ICON_OPTS, COLOR_DEFAULTS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";`,
    extraState: `const {
    win98, dict,
    slogan, setSlogan,
    badge, setBadge,
    trustLine, setTrustLine,
    heroTrustIcon, setHeroTrustIcon,
    heroTrustIconPicker, setHeroTrustIconPicker,
    heroTrustIconPage, setHeroTrustIconPage,
    sectionSaved,
    savingKey,
    savingAll, allSaved,
    translating, translateError,
    stat1Value, setStat1Value, stat1Label, setStat1Label,
    stat2Value, setStat2Value, stat2Label, setStat2Label,
    stat3Value, setStat3Value, stat3Label, setStat3Label,
    stat4Value, setStat4Value, stat4Label, setStat4Label,
    trustBg, setTrustBg,
    partnersBg, setPartnersBg,
    heroImgDesktop, setHeroImgDesktop,
    heroImgMobile, setHeroImgMobile,
    partners, setPartners,
    heroTranslationPending,
    buildSource, persist, saveAll, resetAll, removePartner,
  } = useAdminCustomization();`,
  },
  {
    name: "ServicesTab",
    subtab: "services",
    modernStart: 5545,
    modernEnd: 5681,
    win98Start: 5167,
    win98End: 5545,
    imports: `import React from "react";
import { Loader2, Check, Save } from "lucide-react";
import Image from "next/image";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { DEFAULT_SVC_IMGS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";`,
    extraState: `const {
    win98,
    svcTitle, setSvcTitle,
    svcLabel, setSvcLabel,
    svcCards, setSvcCards,
    svcSectionSaved,
    svcTranslating, svcTranslateError,
    svcSavingAll, svcAllSaved,
    svcTranslationPending,
    buildServicesSource, persistServices, saveAllServices, resetAllServices,
  } = useAdminCustomization();`,
  },
  {
    name: "AboutTab",
    subtab: "about",
    modernStart: 6456,
    modernEnd: 6695,
    win98Start: 5681,
    win98End: 6456,
    imports: `import React from "react";
import { Loader2, Check, Save, RotateCcw, Users, MapPin } from "lucide-react";
import Image from "next/image";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { BADGE_ICON_OPTS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";`,
    extraState: `const {
    win98,
    aboutLabel, setAboutLabel,
    aboutTitle, setAboutTitle,
    aboutDesc, setAboutDesc,
    aboutDesc2, setAboutDesc2,
    aboutValuesTitle, setAboutValuesTitle,
    aboutValues, setAboutValues,
    aboutDriversPlaced, setAboutDriversPlaced,
    aboutYearsActive, setAboutYearsActive,
    aboutLocation, setAboutLocation,
    aboutYearsActiveNum, setAboutYearsActiveNum,
    aboutDriversIcon, setAboutDriversIcon,
    aboutLocationIcon, setAboutLocationIcon,
    aboutIconPicker, setAboutIconPicker,
    aboutDriversIconPage, setAboutDriversIconPage,
    aboutLocationIconPage, setAboutLocationIconPage,
    aboutImgLeft, setAboutImgLeft,
    aboutImgTopRight, setAboutImgTopRight,
    aboutImgBottomRight, setAboutImgBottomRight,
    aboutSectionSaved,
    aboutTranslating, aboutTranslateError,
    aboutSavingAll, aboutAllSaved,
    aboutTranslationPending,
    buildAboutSource, persistAbout, saveAllAbout, resetAllAbout,
  } = useAdminCustomization();`,
  },
  {
    name: "HousingTab",
    subtab: "housing",
    modernStart: 7463,
    modernEnd: 7656,
    win98Start: 6695,
    win98End: 7463,
    imports: `import React from "react";
import { Loader2, Check, Save, RotateCcw } from "lucide-react";
import Image from "next/image";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { HOUSING_ICON_OPTS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";`,
    extraState: `const {
    win98,
    housingLabel, setHousingLabel,
    housingTitle, setHousingTitle,
    housingDesc, setHousingDesc,
    housingPerks, setHousingPerks,
    housingCta, setHousingCta,
    housingPerkIcons, setHousingPerkIcons,
    housingImg1, setHousingImg1,
    housingImg2, setHousingImg2,
    housingBg, setHousingBg,
    housingIconPicker, setHousingIconPicker,
    housingIconPages, setHousingIconPages,
    housingTranslating, housingTranslateError,
    housingSavingAll, housingAllSaved,
    housingTranslationPending,
    buildHousingSource, persistHousing, saveAllHousing, resetAllHousing,
  } = useAdminCustomization();`,
  },
  {
    name: "ContactTab",
    subtab: "contact",
    modernStart: 7656,
    modernEnd: 7833,
    win98Start: 7833,
    win98End: 8499,
    imports: `import React from "react";
import { Loader2, Check, Save, RotateCcw } from "lucide-react";
import Image from "next/image";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { CONTACT_ICON_OPTS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";`,
    extraState: `const {
    win98,
    contactTitle, setContactTitle,
    contactSubtitle, setContactSubtitle,
    contactPhoneLabel, setContactPhoneLabel,
    contactEmailLabel, setContactEmailLabel,
    contactAddressLabel, setContactAddressLabel,
    contactMapPin, setContactMapPin,
    contactWhatsapp, setContactWhatsapp,
    contactEmailAddress, setContactEmailAddress,
    contactMapAddress, setContactMapAddress,
    contactImg, setContactImg,
    contactSectionSaved,
    contactTranslating, contactTranslateError,
    contactSavingAll, contactAllSaved,
    contactTranslationPending,
    contactRowIcons, setContactRowIcons,
    contactIconPicker, setContactIconPicker,
    contactIconPages, setContactIconPages,
    buildContactSource, persistContact, saveAllContact, resetAllContact,
  } = useAdminCustomization();`,
  },
  {
    name: "FooterTab",
    subtab: "footer",
    modernStart: 8499,
    modernEnd: 8655,
    win98Start: 8655,
    win98End: lines.length,
    imports: `import React from "react";
import { Loader2, Check, Save } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth-client";
import { LS_FOOTER } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";`,
    extraState: `const {
    win98,
    footerTaglineSub, setFooterTaglineSub,
    footerAddressLine1, setFooterAddressLine1,
    footerAddressLine2, setFooterAddressLine2,
    footerPhone, setFooterPhone,
    footerEmail, setFooterEmail,
    footerSectionSaved, setFooterSectionSaved,
    footerSaving, setFooterSaving,
    footerSaveError, setFooterSaveError,
  } = useAdminCustomization();`,
  },
];

// Helper: extract lines (1-indexed, exclusive end)
function extractLines(start, end) {
  return lines.slice(start - 1, end - 1).join("\n");
}

// For each section, build the tab component file
for (const section of SECTIONS) {
  const { name, subtab, modernStart, modernEnd, win98Start, win98End, imports, extraState } = section;

  // Extract JSX blocks — strip the outer conditional wrapper
  // Modern block: {subTab === "xxx" && !win98 && (...)}
  // Win98 block: {subTab === "xxx" && win98 && (() => { ... })()}
  let modernJsx = extractLines(modernStart, modernEnd);
  let win98Jsx = extractLines(win98Start, win98End);

  // Remove the outer condition from modern JSX
  // Pattern: "{subTab === "xxx" && !win98 && (" ... ")}"
  modernJsx = modernJsx
    .replace(new RegExp(`\\{subTab === "${subtab}" && !win98 && \\(`), "")
    .replace(/\)\}$/, "")
    .trim();

  // Remove the outer condition from Win98 JSX
  // Pattern: "{subTab === "xxx" && win98 && (() => { ... })()}"
  win98Jsx = win98Jsx
    .replace(new RegExp(`\\{subTab === "${subtab}" && win98 && \\(`), "")
    .replace(/\)\(\)\}$/, "")
    .replace(/^\(\)[ \t]*=>[ \t]*\{/, "")
    .trim();

  // For services, the win98 section comes before modern in the file
  // We need to handle it differently — keep the JSX as-is and just wrap it

  const fileContent = `"use client";

${imports}

export default function ${name}() {
  ${extraState}

  return (
    <>
      ${modernJsx.split('\n').join('\n      ')}

      {win98 && (() => {
        ${win98Jsx.split('\n').join('\n        ')}
      })()}
    </>
  );
}
`;

  const outPath = join(DEST_DIR, `${name}.tsx`);
  writeFileSync(outPath, fileContent, "utf8");
  console.log(`✓ Created ${name}.tsx`);
}

console.log("\nAll tab files created. Now update AdminCustomizationTab.tsx.");
