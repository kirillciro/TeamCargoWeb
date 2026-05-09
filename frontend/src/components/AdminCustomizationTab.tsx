"use client";

import React, { Fragment, useState } from "react";
import {
  Activity,
  Award,
  BadgeCheck,
  Bike,
  Bolt,
  Briefcase,
  BriefcaseBusiness,
  Building,
  Building2,
  Bus,
  Car,
  Check,
  CheckCircle2,
  CircleGauge,
  CircleStar,
  Compass,
  Crown,
  Factory,
  Flag,
  Flame,
  Fuel,
  Globe,
  Goal,
  HandHelping,
  Handshake,
  HardHat,
  HeartHandshake,
  Home,
  Landmark,
  LayoutGrid,
  Loader2,
  LocateFixed,
  MapPin,
  MapPinCheck,
  MapPinHouse,
  MapPinned,
  Medal,
  Milestone,
  Mountain,
  Navigation,
  Navigation2,
  Package,
  Palette,
  PersonStanding,
  Plane,
  Rocket,
  Route,
  RotateCcw,
  Save,
  Shield,
  Ship,
  ShieldCheck,
  Signpost,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  Timer,
  TrafficCone,
  TrendingUp,
  Trophy,
  Truck,
  TruckElectric,
  Type,
  UserCheck,
  UserCog,
  Users,
  UsersRound,
  UserStar,
  Warehouse,
  Waypoints,
  Wrench,
  Zap,
  Wifi,
  Utensils,
  BedDouble,
  Coffee,
  Bath,
  DoorOpen,
  Armchair,
  Sofa,
  Sun,
  Key,
  Lamp,
  Lightbulb,
  Refrigerator,
  WashingMachine,
  CookingPot,
  Wind,
  Tv,
  Bed,
  Heart,
  Mail,
  Phone,
  Smartphone,
  MessageCircle,
  AtSign,
  Inbox,
  MailOpen,
  type LucideIcon,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/getDictionary";
import CloudinaryLogoUpload from "./CloudinaryLogoUpload";

const LS_COLORS = "tc_brand_colors";
const LS_HERO = "tc_hero_overrides";
const LS_HEADER = "tc_header_settings";
const LS_SERVICES = "tc_services_overrides";
const LS_ABOUT = "tc_about_overrides";
const LS_HOUSING = "tc_housing_overrides";

// Lucide icon options for housing perk icon pickers — 3 pages × 15 each
const HOUSING_ICON_OPTS: { id: string; Icon: LucideIcon; label: string }[][] = [
  // page 0
  [
    { id: "home", Icon: Home, label: "Home" },
    { id: "bed-double", Icon: BedDouble, label: "Bedroom" },
    { id: "sofa", Icon: Sofa, label: "Living room" },
    { id: "armchair", Icon: Armchair, label: "Armchair" },
    { id: "door-open", Icon: DoorOpen, label: "Door" },
    { id: "key", Icon: Key, label: "Key" },
    { id: "lightbulb", Icon: Lightbulb, label: "Light" },
    { id: "lamp", Icon: Lamp, label: "Lamp" },
    { id: "wifi", Icon: Wifi, label: "WiFi" },
    { id: "tv", Icon: Tv, label: "TV" },
    { id: "refrigerator", Icon: Refrigerator, label: "Fridge" },
    { id: "washing-machine", Icon: WashingMachine, label: "Washer" },
    { id: "cooking-pot", Icon: CookingPot, label: "Cooking" },
    { id: "utensils", Icon: Utensils, label: "Kitchen" },
    { id: "coffee", Icon: Coffee, label: "Coffee" },
  ],
  // page 1
  [
    { id: "bath", Icon: Bath, label: "Bathroom" },
    { id: "bed", Icon: Bed, label: "Bed" },
    { id: "sun", Icon: Sun, label: "Sunny" },
    { id: "wind", Icon: Wind, label: "Air" },
    { id: "map-pin", Icon: MapPin, label: "Location" },
    { id: "route", Icon: Route, label: "Route" },
    { id: "building", Icon: Building, label: "Building" },
    { id: "building-2", Icon: Building2, label: "Complex" },
    { id: "warehouse", Icon: Warehouse, label: "Warehouse" },
    { id: "truck", Icon: Truck, label: "Truck" },
    { id: "car", Icon: Car, label: "Car" },
    { id: "bus", Icon: Bus, label: "Bus" },
    { id: "bike", Icon: Bike, label: "Bike" },
    { id: "shield", Icon: Shield, label: "Safe" },
    { id: "shield-check", Icon: ShieldCheck, label: "Secure" },
  ],
  // page 2
  [
    { id: "star", Icon: Star, label: "Star" },
    { id: "award", Icon: Award, label: "Award" },
    { id: "sparkles", Icon: Sparkles, label: "Premium" },
    { id: "heart", Icon: Heart, label: "Heart" },
    { id: "users", Icon: Users, label: "Community" },
    { id: "check-circle-2", Icon: CheckCircle2, label: "Checked" },
    { id: "package", Icon: Package, label: "Package" },
    { id: "briefcase", Icon: Briefcase, label: "Work" },
    { id: "handshake", Icon: Handshake, label: "Deal" },
    { id: "thumbs-up", Icon: ThumbsUp, label: "Good" },
    { id: "zap", Icon: Zap, label: "Fast" },
    { id: "target", Icon: Target, label: "Target" },
    { id: "flag", Icon: Flag, label: "Flag" },
    { id: "mountain", Icon: Mountain, label: "Mountain" },
    { id: "globe", Icon: Globe, label: "Global" },
  ],
];

// Lucide icon options for contact row icon pickers — 2 pages × 15 each
const CONTACT_ICON_OPTS: { id: string; Icon: LucideIcon; label: string }[][] = [
  // page 0 — communication
  [
    { id: "phone", Icon: Phone, label: "Phone" },
    { id: "smartphone", Icon: Smartphone, label: "Mobile" },
    { id: "message-circle", Icon: MessageCircle, label: "Chat" },
    { id: "mail", Icon: Mail, label: "Mail" },
    { id: "at-sign", Icon: AtSign, label: "Email" },
    { id: "inbox", Icon: Inbox, label: "Inbox" },
    { id: "mail-open", Icon: MailOpen, label: "Open" },
    { id: "map-pin", Icon: MapPin, label: "Location" },
    { id: "navigation", Icon: Navigation, label: "Navigate" },
    { id: "globe", Icon: Globe, label: "Globe" },
    { id: "building", Icon: Building, label: "Building" },
    { id: "home", Icon: Home, label: "Home" },
    { id: "handshake", Icon: Handshake, label: "Contact" },
    { id: "heart-handshake", Icon: HeartHandshake, label: "Support" },
    { id: "compass", Icon: Compass, label: "Compass" },
  ],
  // page 1 — misc
  [
    { id: "landmark", Icon: Landmark, label: "Place" },
    { id: "waypoints", Icon: Waypoints, label: "Route" },
    { id: "route", Icon: Route, label: "Road" },
    { id: "flag", Icon: Flag, label: "Flag" },
    { id: "users", Icon: Users, label: "Team" },
    { id: "user-check", Icon: UserCheck, label: "Agent" },
    { id: "shield", Icon: Shield, label: "Safe" },
    { id: "shield-check", Icon: ShieldCheck, label: "Secure" },
    { id: "check-circle-2", Icon: CheckCircle2, label: "Done" },
    { id: "zap", Icon: Zap, label: "Fast" },
    { id: "star", Icon: Star, label: "Star" },
    { id: "award", Icon: Award, label: "Award" },
    { id: "sparkles", Icon: Sparkles, label: "Premium" },
    { id: "heart", Icon: Heart, label: "Heart" },
    { id: "package", Icon: Package, label: "Package" },
  ],
];

// Lucide icon options for about badge pickers — 3 pages × 15 each
const BADGE_ICON_OPTS: Record<
  "drivers" | "location",
  { id: string; Icon: LucideIcon; label: string }[][]
> = {
  drivers: [
    // page 0
    [
      { id: "users", Icon: Users, label: "People" },
      { id: "user-check", Icon: UserCheck, label: "Driver" },
      { id: "users-round", Icon: UsersRound, label: "Team" },
      { id: "user-star", Icon: UserStar, label: "Top driver" },
      { id: "user-cog", Icon: UserCog, label: "Staff" },
      { id: "person-standing", Icon: PersonStanding, label: "Person" },
      { id: "hard-hat", Icon: HardHat, label: "Hard Hat" },
      { id: "briefcase", Icon: Briefcase, label: "Briefcase" },
      { id: "briefcase-biz", Icon: BriefcaseBusiness, label: "Business" },
      { id: "truck", Icon: Truck, label: "Truck" },
      { id: "truck-electric", Icon: TruckElectric, label: "Electric" },
      { id: "car", Icon: Car, label: "Car" },
      { id: "bus", Icon: Bus, label: "Bus" },
      { id: "bike", Icon: Bike, label: "Bike" },
      { id: "fuel", Icon: Fuel, label: "Fuel" },
    ],
    // page 1
    [
      { id: "package", Icon: Package, label: "Package" },
      { id: "shield-check", Icon: ShieldCheck, label: "Shield" },
      { id: "award", Icon: Award, label: "Award" },
      { id: "trophy", Icon: Trophy, label: "Trophy" },
      { id: "medal", Icon: Medal, label: "Medal" },
      { id: "star", Icon: Star, label: "Star" },
      { id: "circle-star", Icon: CircleStar, label: "Circle Star" },
      { id: "badge-check", Icon: BadgeCheck, label: "Badge" },
      { id: "crown", Icon: Crown, label: "Crown" },
      { id: "sparkles", Icon: Sparkles, label: "Sparkles" },
      { id: "zap", Icon: Zap, label: "Zap" },
      { id: "bolt", Icon: Bolt, label: "Bolt" },
      { id: "flame", Icon: Flame, label: "Flame" },
      { id: "target", Icon: Target, label: "Target" },
      { id: "goal", Icon: Goal, label: "Goal" },
    ],
    // page 2
    [
      { id: "thumbs-up", Icon: ThumbsUp, label: "Thumbs Up" },
      { id: "handshake", Icon: Handshake, label: "Handshake" },
      { id: "heart-handshake", Icon: HeartHandshake, label: "Partnership" },
      { id: "hand-helping", Icon: HandHelping, label: "Helping" },
      { id: "trending-up", Icon: TrendingUp, label: "Trending" },
      { id: "activity", Icon: Activity, label: "Activity" },
      { id: "circle-gauge", Icon: CircleGauge, label: "Speed" },
      { id: "timer", Icon: Timer, label: "Timer" },
      { id: "route", Icon: Route, label: "Route" },
      { id: "navigation", Icon: Navigation, label: "Navigation" },
      { id: "navigation-2", Icon: Navigation2, label: "Direction" },
      { id: "waypoints", Icon: Waypoints, label: "Waypoints" },
      { id: "traffic-cone", Icon: TrafficCone, label: "Traffic" },
      { id: "rocket", Icon: Rocket, label: "Rocket" },
      { id: "wrench", Icon: Wrench, label: "Wrench" },
    ],
  ],
  location: [
    // page 0
    [
      { id: "map-pin", Icon: MapPin, label: "Map Pin" },
      { id: "map-pin-check", Icon: MapPinCheck, label: "Pin Check" },
      { id: "map-pin-house", Icon: MapPinHouse, label: "Pin House" },
      { id: "map-pinned", Icon: MapPinned, label: "Pinned" },
      { id: "locate-fixed", Icon: LocateFixed, label: "Locate" },
      { id: "compass", Icon: Compass, label: "Compass" },
      { id: "navigation", Icon: Navigation, label: "Navigation" },
      { id: "navigation-2", Icon: Navigation2, label: "Direction" },
      { id: "waypoints", Icon: Waypoints, label: "Waypoints" },
      { id: "route", Icon: Route, label: "Route" },
      { id: "milestone", Icon: Milestone, label: "Milestone" },
      { id: "signpost", Icon: Signpost, label: "Signpost" },
      { id: "globe", Icon: Globe, label: "Globe" },
      { id: "plane", Icon: Plane, label: "Plane" },
      { id: "ship", Icon: Ship, label: "Ship" },
    ],
    // page 1
    [
      { id: "building", Icon: Building, label: "Building" },
      { id: "building-2", Icon: Building2, label: "Tower" },
      { id: "landmark", Icon: Landmark, label: "Landmark" },
      { id: "warehouse", Icon: Warehouse, label: "Warehouse" },
      { id: "factory", Icon: Factory, label: "Factory" },
      { id: "home", Icon: Home, label: "Home" },
      { id: "flag", Icon: Flag, label: "Flag" },
      { id: "mountain", Icon: Mountain, label: "Mountain" },
      { id: "traffic-cone", Icon: TrafficCone, label: "Traffic" },
      { id: "fuel", Icon: Fuel, label: "Fuel" },
      { id: "truck", Icon: Truck, label: "Truck" },
      { id: "bus", Icon: Bus, label: "Bus" },
      { id: "bike", Icon: Bike, label: "Bike" },
      { id: "car", Icon: Car, label: "Car" },
      { id: "ship", Icon: Ship, label: "Ship" },
    ],
    // page 2
    [
      { id: "goal", Icon: Goal, label: "Goal" },
      { id: "target", Icon: Target, label: "Target" },
      { id: "sparkles", Icon: Sparkles, label: "Sparkles" },
      { id: "star", Icon: Star, label: "Star" },
      { id: "award", Icon: Award, label: "Award" },
      { id: "trophy", Icon: Trophy, label: "Trophy" },
      { id: "shield-check", Icon: ShieldCheck, label: "Shield" },
      { id: "badge-check", Icon: BadgeCheck, label: "Badge" },
      { id: "crown", Icon: Crown, label: "Crown" },
      { id: "activity", Icon: Activity, label: "Activity" },
      { id: "trending-up", Icon: TrendingUp, label: "Trending" },
      { id: "zap", Icon: Zap, label: "Zap" },
      { id: "flame", Icon: Flame, label: "Flame" },
      { id: "handshake", Icon: Handshake, label: "Handshake" },
      { id: "wrench", Icon: Wrench, label: "Wrench" },
    ],
  ],
};

// Lucide icon options for the hero trust-line icon picker — 3 pages × 15 each
const TRUST_ICON_OPTS: { id: string; Icon: LucideIcon; label: string }[][] = [
  // page 0 — trust / achievement
  [
    { id: "shield", Icon: Shield, label: "Shield" },
    { id: "shield-check", Icon: ShieldCheck, label: "Shield Check" },
    { id: "badge-check", Icon: BadgeCheck, label: "Badge" },
    { id: "check-circle-2", Icon: CheckCircle2, label: "Check Circle" },
    { id: "award", Icon: Award, label: "Award" },
    { id: "medal", Icon: Medal, label: "Medal" },
    { id: "trophy", Icon: Trophy, label: "Trophy" },
    { id: "star", Icon: Star, label: "Star" },
    { id: "circle-star", Icon: CircleStar, label: "Circle Star" },
    { id: "crown", Icon: Crown, label: "Crown" },
    { id: "sparkles", Icon: Sparkles, label: "Sparkles" },
    { id: "zap", Icon: Zap, label: "Zap" },
    { id: "flame", Icon: Flame, label: "Flame" },
    { id: "target", Icon: Target, label: "Target" },
    { id: "goal", Icon: Goal, label: "Goal" },
  ],
  // page 1 — people / social
  [
    { id: "users", Icon: Users, label: "People" },
    { id: "user-check", Icon: UserCheck, label: "Driver" },
    { id: "users-round", Icon: UsersRound, label: "Team" },
    { id: "handshake", Icon: Handshake, label: "Handshake" },
    { id: "heart-handshake", Icon: HeartHandshake, label: "Partnership" },
    { id: "hand-helping", Icon: HandHelping, label: "Helping" },
    { id: "thumbs-up", Icon: ThumbsUp, label: "Thumbs Up" },
    { id: "hard-hat", Icon: HardHat, label: "Hard Hat" },
    { id: "briefcase", Icon: Briefcase, label: "Briefcase" },
    { id: "person-standing", Icon: PersonStanding, label: "Person" },
    { id: "trending-up", Icon: TrendingUp, label: "Trending" },
    { id: "activity", Icon: Activity, label: "Activity" },
    { id: "rocket", Icon: Rocket, label: "Rocket" },
    { id: "timer", Icon: Timer, label: "Timer" },
    { id: "circle-gauge", Icon: CircleGauge, label: "Speed" },
  ],
  // page 2 — transport / location
  [
    { id: "truck", Icon: Truck, label: "Truck" },
    { id: "car", Icon: Car, label: "Car" },
    { id: "route", Icon: Route, label: "Route" },
    { id: "navigation", Icon: Navigation, label: "Navigation" },
    { id: "compass", Icon: Compass, label: "Compass" },
    { id: "globe", Icon: Globe, label: "Globe" },
    { id: "map-pin", Icon: MapPin, label: "Map Pin" },
    { id: "flag", Icon: Flag, label: "Flag" },
    { id: "milestone", Icon: Milestone, label: "Milestone" },
    { id: "wrench", Icon: Wrench, label: "Wrench" },
    { id: "fuel", Icon: Fuel, label: "Fuel" },
    { id: "waypoints", Icon: Waypoints, label: "Waypoints" },
    { id: "traffic-cone", Icon: TrafficCone, label: "Traffic" },
    { id: "plane", Icon: Plane, label: "Plane" },
    { id: "ship", Icon: Ship, label: "Ship" },
  ],
];

const COLOR_DEFAULTS = {
  brandGreen: "#36b347",
  brandMid: "#079441",
  brandDark: "#006637",
  brandBtnText: "#ffffff",
  trustBg: "#0d3d1e",
  headerBg: "#040f08",
  footerBg: "#040f08",
};

type ColorKey = keyof typeof COLOR_DEFAULTS;
type SubTab =
  | "colors"
  | "fonts"
  | "header"
  | "hero"
  | "services"
  | "about"
  | "housing"
  | "contact"
  | "footer";
type SectionKey =
  | "slogan"
  | "badge"
  | "trustLine"
  | "trustIcon"
  | "trustBg"
  | "partnersBg"
  | "stats"
  | "partners"
  | "heroImgDesktop"
  | "heroImgMobile";

type ServicesSectionKey =
  | "svcHeading"
  | "svcCard0"
  | "svcCard1"
  | "svcCard2"
  | "svcCard3"
  | "svcCard4"
  | "svcCard5";

type AboutSectionKey =
  | "aboutHeading"
  | "aboutDescriptions"
  | "aboutValues"
  | "aboutBadges"
  | "aboutImgLeft"
  | "aboutImgTopRight"
  | "aboutImgBottomRight";

type HousingSectionKey =
  | "housingHeading"
  | "housingDescription"
  | "housingPerks"
  | "housingCta"
  | "housingImg1"
  | "housingImg2"
  | "housingBg";

type ContactSectionKey =
  | "contactHeading"
  | "contactDetails"
  | "contactLabels"
  | "contactMapPin"
  | "contactImg";

const DEFAULT_SVC_IMGS = [
  "/images/gls_vans_webP.webp",
  "/images/fedex_courier_2_webP.webp",
  "/images/dpd_courier_2_webP.webp",
  "/images/dpd_courier_webP.webp",
  "/images/fedex_courier_webP.webp",
  "/images/gls_courier_webP.webp",
];

const CSS_VAR_MAP: Record<ColorKey, string> = {
  brandGreen: "--brand-green",
  brandMid: "--brand-mid",
  brandDark: "--brand-dark",
  brandBtnText: "--brand-btn-text",
  trustBg: "--brand-trust-bg",
  headerBg: "--brand-header-bg",
  footerBg: "--brand-footer-bg",
};

const LS_FONT = "tc_brand_font";

type FontOption = {
  id: string;
  label: string;
  family: string;
  google: string | null;
};

const FONT_OPTIONS: FontOption[] = [
  {
    id: "arial",
    label: "Arial",
    family: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    google: null,
  },
  {
    id: "helvetica",
    label: "Helvetica Neue",
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    google: null,
  },
  {
    id: "inter",
    label: "Inter",
    family: '"Inter", sans-serif',
    google: "Inter:wght@400;500;600;700",
  },
  {
    id: "roboto",
    label: "Roboto",
    family: '"Roboto", sans-serif',
    google: "Roboto:wght@400;500;700",
  },
  {
    id: "poppins",
    label: "Poppins",
    family: '"Poppins", sans-serif',
    google: "Poppins:wght@400;500;600;700",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    family: '"Montserrat", sans-serif',
    google: "Montserrat:wght@400;500;600;700",
  },
  {
    id: "raleway",
    label: "Raleway",
    family: '"Raleway", sans-serif',
    google: "Raleway:wght@400;500;600;700",
  },
  {
    id: "lato",
    label: "Lato",
    family: '"Lato", sans-serif',
    google: "Lato:wght@400;700",
  },
  {
    id: "nunito",
    label: "Nunito",
    family: '"Nunito", sans-serif',
    google: "Nunito:wght@400;500;600;700",
  },
  {
    id: "opensans",
    label: "Open Sans",
    family: '"Open Sans", sans-serif',
    google: "Open+Sans:wght@400;500;600;700",
  },
  {
    id: "playfair",
    label: "Playfair Display",
    family: '"Playfair Display", serif',
    google: "Playfair+Display:wght@400;600;700",
  },
  {
    id: "merriweather",
    label: "Merriweather",
    family: '"Merriweather", serif',
    google: "Merriweather:wght@400;700",
  },
  {
    id: "oswald",
    label: "Oswald",
    family: '"Oswald", sans-serif',
    google: "Oswald:wght@400;500;600;700",
  },
  {
    id: "sourcesans",
    label: "Source Sans 3",
    family: '"Source Sans 3", sans-serif',
    google: "Source+Sans+3:wght@400;500;600;700",
  },
  {
    id: "ubuntu",
    label: "Ubuntu",
    family: '"Ubuntu", sans-serif',
    google: "Ubuntu:wght@400;500;700",
  },
  {
    id: "dmsans",
    label: "DM Sans",
    family: '"DM Sans", sans-serif',
    google: "DM+Sans:wght@400;500;600;700",
  },
];

export default function AdminCustomizationTab({
  dict,
  win98 = false,
}: {
  dict: Dictionary;
  win98?: boolean;
}) {
  const [subTab, setSubTab] = useState<SubTab>("colors");

  // ── Header ───────────────────────────────────────────────────────────────
  const [headerTransparent, setHeaderTransparent] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem(LS_HEADER);
      if (saved) return (JSON.parse(saved) as { transparent: boolean }).transparent !== false;
    } catch {
      /* ignore */
    }
    return true;
  });
  const [headerSaved, setHeaderSaved] = useState(false);

  // ── Colors ───────────────────────────────────────────────────────────────
  const [colors, setColors] = useState<typeof COLOR_DEFAULTS>(() => {
    if (typeof window === "undefined") return COLOR_DEFAULTS;
    try {
      const saved = localStorage.getItem(LS_COLORS);
      return saved
        ? (JSON.parse(saved) as typeof COLOR_DEFAULTS)
        : COLOR_DEFAULTS;
    } catch {
      return COLOR_DEFAULTS;
    }
  });
  const [colorSaved, setColorSaved] = useState(false);

  // ── Fonts ─────────────────────────────────────────────────────────────────
  const [selectedFont, setSelectedFont] = useState<string>(() => {
    if (typeof window === "undefined") return "helvetica";
    try {
      const saved = localStorage.getItem(LS_FONT);
      if (saved) return (JSON.parse(saved) as { id: string }).id ?? "helvetica";
    } catch {
      /* ignore */
    }
    return "helvetica";
  });
  const [letterSpacing, setLetterSpacing] = useState(() => {
    if (typeof window === "undefined") return "0.02";
    try {
      const saved = localStorage.getItem(LS_FONT);
      if (saved)
        return (
          (JSON.parse(saved) as { letterSpacing?: string }).letterSpacing ??
          "0.02"
        );
    } catch {
      /* ignore */
    }
    return "0.02";
  });
  const [lineHeight, setLineHeight] = useState(() => {
    if (typeof window === "undefined") return "1.65";
    try {
      const saved = localStorage.getItem(LS_FONT);
      if (saved)
        return (
          (JSON.parse(saved) as { lineHeight?: string }).lineHeight ?? "1.65"
        );
    } catch {
      /* ignore */
    }
    return "1.65";
  });
  const [fontWeight, setFontWeight] = useState(() => {
    if (typeof window === "undefined") return "400";
    try {
      const saved = localStorage.getItem(LS_FONT);
      if (saved)
        return (
          (JSON.parse(saved) as { fontWeight?: string }).fontWeight ?? "400"
        );
    } catch {
      /* ignore */
    }
    return "400";
  });
  const [fontSaved, setFontSaved] = useState(false);

  // ── Parse all localStorage sections once at init (avoids setState-in-effect) ─
  const [_lsData] = useState(() => {
    if (typeof window === "undefined")
      return {
        hero: null,
        svc: null,
        about: null,
        housing: null,
        contact: null,
        footer: null,
      } as {
        hero: Record<string, unknown> | null;
        svc: Record<string, string> | null;
        about: Record<string, string> | null;
        housing: Record<string, string> | null;
        contact: Record<string, string> | null;
        footer: Record<string, string> | null;
      };
    const parse = <T,>(key: string): T | null => {
      try {
        const s = localStorage.getItem(key);
        return s ? (JSON.parse(s) as T) : null;
      } catch {
        return null;
      }
    };
    return {
      hero: parse<Record<string, unknown>>(LS_HERO),
      svc: parse<Record<string, string>>(LS_SERVICES),
      about: parse<Record<string, string>>(LS_ABOUT),
      housing: parse<Record<string, string>>(LS_HOUSING),
      contact: parse<Record<string, string>>("tc_contact_overrides"),
      footer: parse<Record<string, string>>("tc_footer_overrides"),
    };
  });
  const _h = _lsData.hero;
  const _s = _lsData.svc;
  const _a = _lsData.about;
  const _hg = _lsData.housing;
  const _c = _lsData.contact;
  const _ft = _lsData.footer;

  // ── Hero text ─────────────────────────────────────────────────────────────
  const [slogan, setSlogan] = useState(() => (_h?.slogan as string) ?? "");
  const [badge, setBadge] = useState(() => (_h?.badge as string) ?? "");
  const [trustLine, setTrustLine] = useState(
    () => (_h?.trustLine as string) ?? "",
  );
  const [heroTrustIcon, setHeroTrustIcon] = useState(
    () => (_h?.trustIcon as string) ?? "",
  );
  const [heroTrustIconPicker, setHeroTrustIconPicker] = useState(false);
  const [heroTrustIconPage, setHeroTrustIconPage] = useState(0);
  const [sectionSaved, setSectionSaved] = useState<Record<SectionKey, boolean>>(
    {
      slogan: false,
      badge: false,
      trustLine: false,
      trustIcon: false,
      trustBg: false,
      partnersBg: false,
      stats: false,
      partners: false,
      heroImgDesktop: false,
      heroImgMobile: false,
    },
  );
  const [savingKey, setSavingKey] = useState<SectionKey | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [allSaved, setAllSaved] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  // ── Hero stats ────────────────────────────────────────────────────────────
  const [stat1Value, setStat1Value] = useState(
    () => (_h?.stat1Value as string) ?? "",
  );
  const [stat1Label, setStat1Label] = useState(
    () => (_h?.stat1Label as string) ?? "",
  );
  const [stat2Value, setStat2Value] = useState(
    () => (_h?.stat2Value as string) ?? "",
  );
  const [stat2Label, setStat2Label] = useState(
    () => (_h?.stat2Label as string) ?? "",
  );
  const [stat3Value, setStat3Value] = useState(
    () => (_h?.stat3Value as string) ?? "",
  );
  const [stat3Label, setStat3Label] = useState(
    () => (_h?.stat3Label as string) ?? "",
  );
  const [stat4Value, setStat4Value] = useState(
    () => (_h?.stat4Value as string) ?? "",
  );
  const [stat4Label, setStat4Label] = useState(
    () => (_h?.stat4Label as string) ?? "",
  );
  const [trustBg, setTrustBg] = useState(
    () => (_h?.trustBg as string) ?? COLOR_DEFAULTS.trustBg,
  );
  const [partnersBg, setPartnersBg] = useState(
    () => (_h?.partnersBg as string) ?? "#ffffff",
  );
  const [heroImgDesktop, setHeroImgDesktop] = useState(
    () => (_h?.heroImgDesktop as string) ?? "",
  );
  const [heroImgMobile, setHeroImgMobile] = useState(
    () => (_h?.heroImgMobile as string) ?? "",
  );

  // ── Partners ──────────────────────────────────────────────────────────────
  const DEFAULT_PARTNERS = [
    { name: "Amazon", logo: "/partners/amazon_logo.svg" },
    { name: "FedEx", logo: "/partners/fedex_logo.svg" },
    { name: "DPD", logo: "/partners/dpd_logo.svg" },
    { name: "GLS", logo: "/partners/gls_logo.svg" },
    { name: "Transmission", logo: "/partners/transmission_logo.svg" },
  ];
  const [partners, setPartners] = useState<{ name: string; logo: string }[]>(
    () => {
      const p = _h?.partners as { name: string; logo: string }[] | undefined;
      return p && p.length > 0 ? p : DEFAULT_PARTNERS;
    },
  );

  // ── Services ─────────────────────────────────────────────────────────────
  const DEFAULT_SVC_CARDS = DEFAULT_SVC_IMGS.map((img) => ({
    title: "",
    desc: "",
    img,
  }));

  const [svcTitle, setSvcTitle] = useState(() => _s?.title ?? "");
  const [svcLabel, setSvcLabel] = useState(() => _s?.label ?? "");
  const [svcCards, setSvcCards] = useState<
    { title: string; desc: string; img: string }[]
  >(() => {
    if (!_s) return DEFAULT_SVC_CARDS;
    return DEFAULT_SVC_CARDS.map((c, i) => ({
      title: _s[`item${i}Title`] ?? "",
      desc: _s[`item${i}Desc`] ?? "",
      img: _s[`img${i}`] ?? c.img,
    }));
  });
  const [svcSectionSaved, setSvcSectionSaved] = useState<
    Record<ServicesSectionKey, boolean>
  >({
    svcHeading: false,
    svcCard0: false,
    svcCard1: false,
    svcCard2: false,
    svcCard3: false,
    svcCard4: false,
    svcCard5: false,
  });
  const [svcSavingKey, setSvcSavingKey] = useState<ServicesSectionKey | null>(
    null,
  );
  const [svcTranslating, setSvcTranslating] = useState(false);
  const [svcTranslateError, setSvcTranslateError] = useState<string | null>(
    null,
  );
  const [svcSavingAll, setSvcSavingAll] = useState(false);
  const [svcAllSaved, setSvcAllSaved] = useState(false);

  // ── About state ───────────────────────────────────────────────────────────
  const [aboutLabel, setAboutLabel] = useState(() => _a?.label ?? "");
  const [aboutTitle, setAboutTitle] = useState(() => _a?.title ?? "");
  const [aboutDesc, setAboutDesc] = useState(() => _a?.description ?? "");
  const [aboutDesc2, setAboutDesc2] = useState(() => _a?.description2 ?? "");
  const [aboutValuesTitle, setAboutValuesTitle] = useState(
    () => _a?.valuesTitle ?? "",
  );
  const [aboutValues, setAboutValues] = useState(() => [
    _a?.value0 ?? "",
    _a?.value1 ?? "",
    _a?.value2 ?? "",
    _a?.value3 ?? "",
  ]);
  const [aboutDriversPlaced, setAboutDriversPlaced] = useState(
    () => _a?.driversPlaced ?? "",
  );
  const [aboutYearsActive, setAboutYearsActive] = useState(
    () => _a?.yearsActive ?? "",
  );
  const [aboutLocation, setAboutLocation] = useState(() => _a?.location ?? "");
  const [aboutYearsActiveNum, setAboutYearsActiveNum] = useState(
    () => _a?.yearsActiveNum ?? "",
  );
  const [aboutDriversIcon, setAboutDriversIcon] = useState(
    () => _a?.driversIcon ?? "",
  );
  const [aboutLocationIcon, setAboutLocationIcon] = useState(
    () => _a?.locationIcon ?? "",
  );
  const [aboutIconPicker, setAboutIconPicker] = useState<
    "drivers" | "location" | null
  >(null);
  const [aboutDriversIconPage, setAboutDriversIconPage] = useState(0);
  const [aboutLocationIconPage, setAboutLocationIconPage] = useState(0);
  const [aboutImgLeft, setAboutImgLeft] = useState(() => _a?.imgLeft ?? "");
  const [aboutImgTopRight, setAboutImgTopRight] = useState(
    () => _a?.imgTopRight ?? "",
  );
  const [aboutImgBottomRight, setAboutImgBottomRight] = useState(
    () => _a?.imgBottomRight ?? "",
  );
  const [aboutSectionSaved, setAboutSectionSaved] = useState<
    Record<AboutSectionKey, boolean>
  >({
    aboutHeading: false,
    aboutDescriptions: false,
    aboutValues: false,
    aboutBadges: false,
    aboutImgLeft: false,
    aboutImgTopRight: false,
    aboutImgBottomRight: false,
  });
  const [aboutSavingKey, setAboutSavingKey] = useState<AboutSectionKey | null>(
    null,
  );
  const [aboutTranslating, setAboutTranslating] = useState(false);
  const [aboutTranslateError, setAboutTranslateError] = useState<string | null>(
    null,
  );
  const [aboutSavingAll, setAboutSavingAll] = useState(false);
  const [aboutAllSaved, setAboutAllSaved] = useState(false);
  const [aboutTranslationPending, setAboutTranslationPending] = useState(false);

  // ── Housing state ─────────────────────────────────────────────────────────
  const [housingLabel, setHousingLabel] = useState(() => _hg?.label ?? "");
  const [housingTitle, setHousingTitle] = useState(() => _hg?.title ?? "");
  const [housingDesc, setHousingDesc] = useState(() => _hg?.description ?? "");
  const [housingPerks, setHousingPerks] = useState(() => [
    _hg?.perk0 ?? "",
    _hg?.perk1 ?? "",
    _hg?.perk2 ?? "",
    _hg?.perk3 ?? "",
  ]);
  const [housingCta, setHousingCta] = useState(() => _hg?.cta ?? "");
  const [housingPerkIcons, setHousingPerkIcons] = useState(() => [
    _hg?.perk0Icon ?? "",
    _hg?.perk1Icon ?? "",
    _hg?.perk2Icon ?? "",
    _hg?.perk3Icon ?? "",
  ]);
  const [housingImg1, setHousingImg1] = useState(() => _hg?.img1 ?? "");
  const [housingImg2, setHousingImg2] = useState(() => _hg?.img2 ?? "");
  const [housingBg, setHousingBg] = useState(() => _hg?.bg ?? "");
  const [housingIconPicker, setHousingIconPicker] = useState<number | null>(
    null,
  );
  const [housingIconPages, setHousingIconPages] = useState([0, 0, 0, 0]);
  const [housingSectionSaved, setHousingSectionSaved] = useState<
    Record<HousingSectionKey, boolean>
  >({
    housingHeading: false,
    housingDescription: false,
    housingPerks: false,
    housingCta: false,
    housingImg1: false,
    housingImg2: false,
    housingBg: false,
  });
  const [housingSavingKey, setHousingSavingKey] =
    useState<HousingSectionKey | null>(null);
  const [housingTranslating, setHousingTranslating] = useState(false);
  const [housingTranslateError, setHousingTranslateError] = useState<
    string | null
  >(null);
  const [housingSavingAll, setHousingSavingAll] = useState(false);
  const [housingAllSaved, setHousingAllSaved] = useState(false);
  const [housingTranslationPending, setHousingTranslationPending] =
    useState(false);

  // ── Footer state ──────────────────────────────────────────────────────────
  const [footerTaglineSub, setFooterTaglineSub] = useState(
    () => _ft?.tagline_sub ?? "",
  );
  const [footerAddressLine1, setFooterAddressLine1] = useState(
    () => _ft?.address_line1 ?? "",
  );
  const [footerAddressLine2, setFooterAddressLine2] = useState(
    () => _ft?.address_line2 ?? "",
  );
  const [footerPhone, setFooterPhone] = useState(() => _ft?.phone ?? "");
  const [footerEmail, setFooterEmail] = useState(() => _ft?.email ?? "");
  const [footerSectionSaved, setFooterSectionSaved] = useState(false);
  const [footerSaving, setFooterSaving] = useState(false);
  const [footerSaveError, setFooterSaveError] = useState<string | null>(null);

  // ── Contact state ─────────────────────────────────────────────────────────
  const [contactTitle, setContactTitle] = useState(() => _c?.title ?? "");
  const [contactSubtitle, setContactSubtitle] = useState(
    () => _c?.subtitle ?? "",
  );
  const [contactPhoneLabel, setContactPhoneLabel] = useState(
    () => _c?.phone ?? "",
  );
  const [contactEmailLabel, setContactEmailLabel] = useState(
    () => _c?.email ?? "",
  );
  const [contactAddressLabel, setContactAddressLabel] = useState(
    () => _c?.address ?? "",
  );
  const [contactMapPin, setContactMapPin] = useState(() => _c?.map_pin ?? "");
  const [contactWhatsapp, setContactWhatsapp] = useState(
    () => _c?.whatsapp_number ?? "",
  );
  const [contactEmailAddress, setContactEmailAddress] = useState(
    () => _c?.email_address ?? "",
  );
  const [contactMapAddress, setContactMapAddress] = useState(
    () => _c?.map_address ?? "",
  );
  const [contactImg, setContactImg] = useState(() => _c?.img ?? "");
  const [contactSectionSaved, setContactSectionSaved] = useState<
    Record<ContactSectionKey, boolean>
  >({
    contactHeading: false,
    contactDetails: false,
    contactLabels: false,
    contactMapPin: false,
    contactImg: false,
  });
  const [contactSavingKey, setContactSavingKey] =
    useState<ContactSectionKey | null>(null);
  const [contactTranslating, setContactTranslating] = useState(false);
  const [contactTranslateError, setContactTranslateError] = useState<
    string | null
  >(null);
  const [contactSavingAll, setContactSavingAll] = useState(false);
  const [contactAllSaved, setContactAllSaved] = useState(false);
  const [contactTranslationPending, setContactTranslationPending] =
    useState(false);
  const [contactRowIcons, setContactRowIcons] = useState(() => [
    _c?.phoneIcon ?? "",
    _c?.emailIcon ?? "",
    _c?.addressIcon ?? "",
  ]);
  const [contactIconPicker, setContactIconPicker] = useState<number | null>(
    null,
  );
  const [contactIconPages, setContactIconPages] = useState([0, 0, 0]);

  // ── Translation-in-progress indicators ───────────────────────────────────
  const [heroTranslationPending, setHeroTranslationPending] = useState(false);
  const [svcTranslationPending, setSvcTranslationPending] = useState(false);

  // ── Color helpers ─────────────────────────────────────────────────────────
  /** Extract Cloudinary public_id from a secure_url, or null for non-Cloudinary URLs */
  const cloudinaryPublicId = (url: string): string | null => {
    const m = url.match(
      /res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)/,
    );
    if (!m) return null;
    return m[1].replace(/\.[^.]+$/, ""); // strip file extension
  };

  const removePartner = (logo: string, index: number) => {
    setPartners((prev) => prev.filter((_, j) => j !== index));
    const publicId = cloudinaryPublicId(logo);
    if (publicId) {
      void fetchWithAuth("/api/admin/cloudinary/delete", {
        method: "DELETE",
        body: JSON.stringify({ publicId }),
      });
    }
  };

  const applyColor = (key: ColorKey, val: string) => {
    document.documentElement.style.setProperty(CSS_VAR_MAP[key], val);
    setColors((prev) => ({ ...prev, [key]: val }));
  };

  const saveColors = () => {
    localStorage.setItem(LS_COLORS, JSON.stringify(colors));
    setColorSaved(true);
    setTimeout(() => setColorSaved(false), 2000);
  };

  const resetColors = () => {
    Object.entries(CSS_VAR_MAP).forEach(([, cssVar]) =>
      document.documentElement.style.removeProperty(cssVar),
    );
    setColors(COLOR_DEFAULTS);
    localStorage.removeItem(LS_COLORS);
  };

  const applyFont = (font: FontOption) => {
    // Load Google Font if needed
    if (font.google) {
      const linkId = `gf-${font.id}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
        document.head.appendChild(link);
      }
    }
    document.documentElement.style.setProperty(
      "--brand-font-family",
      font.family,
    );
    setSelectedFont(font.id);
  };

  const saveFont = () => {
    const font =
      FONT_OPTIONS.find((f) => f.id === selectedFont) ?? FONT_OPTIONS[0];
    localStorage.setItem(
      LS_FONT,
      JSON.stringify({
        id: font.id,
        family: font.family,
        google: font.google,
        letterSpacing,
        lineHeight,
        fontWeight,
      }),
    );
    setFontSaved(true);
    setTimeout(() => setFontSaved(false), 2000);
  };

  const resetFont = () => {
    document.documentElement.style.removeProperty("--brand-font-family");
    document.documentElement.style.removeProperty("--brand-letter-spacing");
    document.documentElement.style.removeProperty("--brand-line-height");
    document.documentElement.style.removeProperty("--brand-font-weight");
    setSelectedFont("helvetica");
    setLetterSpacing("0.02");
    setLineHeight("1.65");
    setFontWeight("400");
    localStorage.removeItem(LS_FONT);
  };

  const applyLetterSpacing = (val: string) => {
    setLetterSpacing(val);
    document.documentElement.style.setProperty(
      "--brand-letter-spacing",
      `${val}em`,
    );
  };

  const applyLineHeight = (val: string) => {
    setLineHeight(val);
    document.documentElement.style.setProperty("--brand-line-height", val);
  };

  const applyFontWeight = (val: string) => {
    setFontWeight(val);
    document.documentElement.style.setProperty("--brand-font-weight", val);
  };

  // ── Shared translation-done poller ───────────────────────────────────────
  /**
   * After a background translation is triggered, poll the public GET endpoint
   * every 5 s (up to 2 min).  When `_hasTranslations` flips to true the AI
   * job finished — fire the update event so display components re-fetch.
   */
  const startTranslationPoll = (
    endpoint: string,
    setpending: (v: boolean) => void,
    event: string,
  ) => {
    const deadline = Date.now() + 120_000;
    const attempt = async () => {
      if (Date.now() > deadline) {
        setpending(false);
        return;
      }
      try {
        const r = await fetch(endpoint);
        if (r.ok) {
          const d = (await r.json()) as { _hasTranslations?: boolean };
          if (d._hasTranslations) {
            setpending(false);
            window.dispatchEvent(new Event(event));
            return;
          }
        }
      } catch {
        /* ignore */
      }
      setTimeout(() => void attempt(), 5000);
    };
    setTimeout(() => void attempt(), 5000);
  };

  // ── Hero helpers ──────────────────────────────────────────────────────────
  const buildSource = () => ({
    slogan,
    badge,
    trustLine,
    trustIcon: heroTrustIcon,
    trustBg,
    partnersBg,
    heroImgDesktop,
    heroImgMobile,
    partners,
    stat1Value,
    stat1Label,
    stat2Value,
    stat2Label,
    stat3Value,
    stat3Label,
    stat4Value,
    stat4Label,
  });

  const persist = async (
    source: ReturnType<typeof buildSource>,
    key: SectionKey,
  ) => {
    localStorage.setItem(LS_HERO, JSON.stringify(source));
    document.documentElement.style.setProperty(
      "--brand-trust-bg",
      source.trustBg,
    );
    document.documentElement.style.setProperty(
      "--brand-partner-bg",
      source.partnersBg,
    );
    setSavingKey(key);
    setTranslating(true);
    setTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:hero-updated"));
      if (body.translating) {
        setHeroTranslationPending(true);
        startTranslationPoll(
          "/api/hero-overrides/nl",
          setHeroTranslationPending,
          "tc:hero-updated",
        );
      }
      setSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setTranslating(false);
      setSavingKey(null);
    }
  };

  const saveAll = async () => {
    setSavingAll(true);
    setTranslateError(null);
    try {
      const source = buildSource();
      localStorage.setItem(LS_HERO, JSON.stringify(source));
      document.documentElement.style.setProperty(
        "--brand-trust-bg",
        source.trustBg,
      );
      document.documentElement.style.setProperty(
        "--brand-partner-bg",
        source.partnersBg,
      );
      const res = await fetchWithAuth("/api/admin/customization/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:hero-updated"));
      if (body.translating) {
        setHeroTranslationPending(true);
        startTranslationPoll(
          "/api/hero-overrides/nl",
          setHeroTranslationPending,
          "tc:hero-updated",
        );
      }
      setAllSaved(true);
      setTimeout(() => setAllSaved(false), 2500);
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingAll(false);
    }
  };

  const resetAll = async () => {
    setSlogan("");
    setBadge("");
    setTrustLine("");
    setHeroTrustIcon("");
    setTrustBg(COLOR_DEFAULTS.trustBg);
    document.documentElement.style.setProperty(
      "--brand-trust-bg",
      COLOR_DEFAULTS.trustBg,
    );
    setPartnersBg("#ffffff");
    document.documentElement.style.setProperty("--brand-partner-bg", "#ffffff");
    setHeroImgDesktop("");
    setHeroImgMobile("");
    setPartners(DEFAULT_PARTNERS);
    setStat1Value("");
    setStat1Label("");
    setStat2Value("");
    setStat2Label("");
    setStat3Value("");
    setStat3Label("");
    setStat4Value("");
    setStat4Label("");
    localStorage.removeItem(LS_HERO);
    setHeroTranslationPending(false);
    setSavingAll(true);
    setTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/hero", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:hero-updated"));
    } catch (err) {
      setTranslateError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setSavingAll(false);
    }
  };

  // ── Services helpers ──────────────────────────────────────────────────────
  const buildServicesSource = () => ({
    title: svcTitle,
    label: svcLabel,
    ...Object.fromEntries(
      svcCards.flatMap((c, i) => [
        [`item${i}Title`, c.title],
        [`item${i}Desc`, c.desc],
        [`img${i}`, c.img],
      ]),
    ),
  });

  const persistServices = async (
    source: ReturnType<typeof buildServicesSource>,
    key: ServicesSectionKey,
  ) => {
    localStorage.setItem(LS_SERVICES, JSON.stringify(source));
    setSvcSavingKey(key);
    setSvcTranslating(true);
    setSvcTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:services-updated"));
      if (body.translating) {
        setSvcTranslationPending(true);
        startTranslationPoll(
          "/api/services-overrides/nl",
          setSvcTranslationPending,
          "tc:services-updated",
        );
      }
      setSvcSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setSvcSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setSvcTranslateError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSvcTranslating(false);
      setSvcSavingKey(null);
    }
  };

  const saveAllServices = async () => {
    setSvcSavingAll(true);
    setSvcTranslateError(null);
    try {
      const source = buildServicesSource();
      localStorage.setItem(LS_SERVICES, JSON.stringify(source));
      const res = await fetchWithAuth("/api/admin/customization/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:services-updated"));
      if (body.translating) {
        setSvcTranslationPending(true);
        startTranslationPoll(
          "/api/services-overrides/nl",
          setSvcTranslationPending,
          "tc:services-updated",
        );
      }
      setSvcAllSaved(true);
      setTimeout(() => setSvcAllSaved(false), 2500);
    } catch (err) {
      setSvcTranslateError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSvcSavingAll(false);
    }
  };

  const resetAllServices = async () => {
    setSvcTitle("");
    setSvcLabel("");
    setSvcCards(DEFAULT_SVC_CARDS);
    localStorage.removeItem(LS_SERVICES);
    setSvcTranslationPending(false);
    setSvcSavingAll(true);
    setSvcTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/services", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:services-updated"));
    } catch (err) {
      setSvcTranslateError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setSvcSavingAll(false);
    }
  };

  // ── About helpers ─────────────────────────────────────────────────────────
  const buildAboutSource = () => ({
    label: aboutLabel,
    title: aboutTitle,
    description: aboutDesc,
    description2: aboutDesc2,
    valuesTitle: aboutValuesTitle,
    value0: aboutValues[0],
    value1: aboutValues[1],
    value2: aboutValues[2],
    value3: aboutValues[3],
    driversPlaced: aboutDriversPlaced,
    yearsActive: aboutYearsActive,
    location: aboutLocation,
    yearsActiveNum: aboutYearsActiveNum,
    driversIcon: aboutDriversIcon,
    locationIcon: aboutLocationIcon,
    imgLeft: aboutImgLeft,
    imgTopRight: aboutImgTopRight,
    imgBottomRight: aboutImgBottomRight,
  });

  const persistAbout = async (
    source: ReturnType<typeof buildAboutSource>,
    key: AboutSectionKey,
  ) => {
    localStorage.setItem(LS_ABOUT, JSON.stringify(source));
    setAboutSavingKey(key);
    setAboutTranslating(true);
    setAboutTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:about-updated"));
      if (body.translating) {
        setAboutTranslationPending(true);
        startTranslationPoll(
          "/api/about-overrides/nl",
          setAboutTranslationPending,
          "tc:about-updated",
        );
      }
      setAboutSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setAboutSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setAboutTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setAboutTranslating(false);
      setAboutSavingKey(null);
    }
  };

  const saveAllAbout = async () => {
    setAboutSavingAll(true);
    setAboutTranslateError(null);
    try {
      const source = buildAboutSource();
      localStorage.setItem(LS_ABOUT, JSON.stringify(source));
      const res = await fetchWithAuth("/api/admin/customization/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:about-updated"));
      if (body.translating) {
        setAboutTranslationPending(true);
        startTranslationPoll(
          "/api/about-overrides/nl",
          setAboutTranslationPending,
          "tc:about-updated",
        );
      }
      setAboutAllSaved(true);
      setTimeout(() => setAboutAllSaved(false), 2500);
    } catch (err) {
      setAboutTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setAboutSavingAll(false);
    }
  };

  const resetAllAbout = async () => {
    setAboutLabel("");
    setAboutTitle("");
    setAboutDesc("");
    setAboutDesc2("");
    setAboutValuesTitle("");
    setAboutValues(["", "", "", ""]);
    setAboutDriversPlaced("");
    setAboutYearsActive("");
    setAboutLocation("");
    setAboutYearsActiveNum("");
    setAboutDriversIcon("");
    setAboutLocationIcon("");
    setAboutImgLeft("");
    setAboutImgTopRight("");
    setAboutImgBottomRight("");
    localStorage.removeItem(LS_ABOUT);
    setAboutTranslationPending(false);
    setAboutSavingAll(true);
    setAboutTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/about", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:about-updated"));
    } catch (err) {
      setAboutTranslateError(
        err instanceof Error ? err.message : "Reset failed",
      );
    } finally {
      setAboutSavingAll(false);
    }
  };

  // ── Housing helpers ───────────────────────────────────────────────────────
  const buildHousingSource = () => ({
    label: housingLabel,
    title: housingTitle,
    description: housingDesc,
    perk0: housingPerks[0],
    perk1: housingPerks[1],
    perk2: housingPerks[2],
    perk3: housingPerks[3],
    cta: housingCta,
    perk0Icon: housingPerkIcons[0],
    perk1Icon: housingPerkIcons[1],
    perk2Icon: housingPerkIcons[2],
    perk3Icon: housingPerkIcons[3],
    img1: housingImg1,
    img2: housingImg2,
    bg: housingBg,
  });

  const persistHousing = async (
    source: ReturnType<typeof buildHousingSource>,
    key: HousingSectionKey,
  ) => {
    localStorage.setItem(LS_HOUSING, JSON.stringify(source));
    setHousingSavingKey(key);
    setHousingTranslating(true);
    setHousingTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/housing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:housing-updated"));
      if (body.translating) {
        setHousingTranslationPending(true);
        startTranslationPoll(
          "/api/housing-overrides/nl",
          setHousingTranslationPending,
          "tc:housing-updated",
        );
      }
      setHousingSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setHousingSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setHousingTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setHousingTranslating(false);
      setHousingSavingKey(null);
    }
  };

  const saveAllHousing = async () => {
    setHousingSavingAll(true);
    setHousingTranslateError(null);
    try {
      const source = buildHousingSource();
      localStorage.setItem(LS_HOUSING, JSON.stringify(source));
      const res = await fetchWithAuth("/api/admin/customization/housing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:housing-updated"));
      if (body.translating) {
        setHousingTranslationPending(true);
        startTranslationPoll(
          "/api/housing-overrides/nl",
          setHousingTranslationPending,
          "tc:housing-updated",
        );
      }
      setHousingAllSaved(true);
      setTimeout(() => setHousingAllSaved(false), 2500);
    } catch (err) {
      setHousingTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setHousingSavingAll(false);
    }
  };

  const resetAllHousing = async () => {
    setHousingLabel("");
    setHousingTitle("");
    setHousingDesc("");
    setHousingPerks(["", "", "", ""]);
    setHousingCta("");
    setHousingPerkIcons(["", "", "", ""]);
    setHousingImg1("");
    setHousingImg2("");
    setHousingBg("");
    localStorage.removeItem(LS_HOUSING);
    setHousingTranslationPending(false);
    setHousingSavingAll(true);
    setHousingTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/housing", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:housing-updated"));
    } catch (err) {
      setHousingTranslateError(
        err instanceof Error ? err.message : "Reset failed",
      );
    } finally {
      setHousingSavingAll(false);
    }
  };

  // ── Contact helpers ─────────────────────────────────────────────────────────────────
  const buildContactSource = () => ({
    title: contactTitle,
    subtitle: contactSubtitle,
    phone: contactPhoneLabel,
    email: contactEmailLabel,
    address: contactAddressLabel,
    map_pin: contactMapPin,
    whatsapp_number: contactWhatsapp,
    email_address: contactEmailAddress,
    map_address: contactMapAddress,
    img: contactImg,
    phoneIcon: contactRowIcons[0],
    emailIcon: contactRowIcons[1],
    addressIcon: contactRowIcons[2],
  });

  const persistContact = async (
    source: ReturnType<typeof buildContactSource>,
    key: ContactSectionKey,
  ) => {
    localStorage.setItem("tc_contact_overrides", JSON.stringify(source));
    setContactSavingKey(key);
    setContactTranslating(true);
    setContactTranslateError(null);
    try {
      const res = await fetchWithAuth("/api/admin/customization/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:contact-updated"));
      if (body.translating) {
        setContactTranslationPending(true);
        startTranslationPoll(
          "/api/contact-overrides/nl",
          setContactTranslationPending,
          "tc:contact-updated",
        );
      }
      setContactSectionSaved((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setContactSectionSaved((prev) => ({ ...prev, [key]: false })),
        2500,
      );
    } catch (err) {
      setContactTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setContactTranslating(false);
      setContactSavingKey(null);
    }
  };

  const saveAllContact = async () => {
    setContactSavingAll(true);
    setContactTranslateError(null);
    try {
      const source = buildContactSource();
      localStorage.setItem("tc_contact_overrides", JSON.stringify(source));
      const res = await fetchWithAuth("/api/admin/customization/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        translating?: boolean;
        message?: string;
      };
      if (!res.ok) throw new Error(body.message ?? "Save failed");
      window.dispatchEvent(new Event("tc:contact-updated"));
      if (body.translating) {
        setContactTranslationPending(true);
        startTranslationPoll(
          "/api/contact-overrides/nl",
          setContactTranslationPending,
          "tc:contact-updated",
        );
      }
      setContactAllSaved(true);
      setTimeout(() => setContactAllSaved(false), 2500);
    } catch (err) {
      setContactTranslateError(
        err instanceof Error ? err.message : "Save failed",
      );
    } finally {
      setContactSavingAll(false);
    }
  };

  const resetAllContact = async () => {
    setContactTitle("");
    setContactSubtitle("");
    setContactPhoneLabel("");
    setContactEmailLabel("");
    setContactAddressLabel("");
    setContactMapPin("");
    setContactWhatsapp("");
    setContactEmailAddress("");
    setContactMapAddress("");
    setContactImg("");
    setContactRowIcons(["", "", ""]);
    localStorage.removeItem("tc_contact_overrides");
    setContactTranslationPending(false);
    setContactSavingAll(true);
    setContactTranslateError(null);
    try {
      await fetchWithAuth("/api/admin/customization/contact", {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("tc:contact-updated"));
    } catch (err) {
      setContactTranslateError(
        err instanceof Error ? err.message : "Reset failed",
      );
    } finally {
      setContactSavingAll(false);
    }
  };

  // ── Color fields config ───────────────────────────────────────────────────
  const colorFields: { key: ColorKey; label: string; default: string }[] = [
    {
      key: "brandGreen",
      label: dict.admin.custom_color_primary,
      default: COLOR_DEFAULTS.brandGreen,
    },
    {
      key: "brandMid",
      label: dict.admin.custom_color_mid,
      default: COLOR_DEFAULTS.brandMid,
    },
    {
      key: "brandDark",
      label: dict.admin.custom_color_dark,
      default: COLOR_DEFAULTS.brandDark,
    },
    {
      key: "brandBtnText",
      label: "Button Text",
      default: COLOR_DEFAULTS.brandBtnText,
    },
    {
      key: "trustBg",
      label: dict.admin.custom_hero_trust_bg,
      default: COLOR_DEFAULTS.trustBg,
    },
  ];

  return (
    <div
      className={win98 ? "" : "max-w-[83.6352rem] mx-auto space-y-6"}
      style={win98 ? { padding: 0 } : undefined}
    >
      {!win98 && (
        <h2 className="text-lg font-bold text-white">
          {dict.admin.tab_customization}
        </h2>
      )}

      {/* ── Sub-tab switcher ── */}
      {win98 ? (
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
              ["housing", "Housing"],
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
      ) : (
        <div className="flex flex-wrap sm:flex-nowrap gap-1 bg-slate-800/60 rounded-xl p-1 w-full overflow-x-auto">
          {(
            [
              "colors",
              "fonts",
              "header",
              "hero",
              "services",
              "about",
              "housing",
              "contact",
              "footer",
            ] as SubTab[]
          ).map((key) => {
            const labels: Record<SubTab, string> = {
              colors: "Colors",
              fonts: "Fonts",
              header: "Header",
              hero: "Hero",
              services: "Services",
              about: "About",
              housing: "Housing",
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
              housing: Home,
              contact: Mail,
              footer: LayoutGrid,
            };
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
      )}

      {/* ── Header panel (modern) ── */}
      {subTab === "header" && !win98 && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Header Transparency
            </p>
            <p className="text-xs text-slate-500">
              Control whether the header fades in from transparent as the user scrolls, or always appears solid.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setHeaderTransparent(true)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                  headerTransparent
                    ? "bg-amber-400 text-amber-900 border-amber-400"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500"
                }`}
              >
                Transparent at top
              </button>
              <button
                onClick={() => setHeaderTransparent(false)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                  !headerTransparent
                    ? "bg-amber-400 text-amber-900 border-amber-400"
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500"
                }`}
              >
                Always visible (solid)
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {headerTransparent
                ? "Header starts transparent and fades in as you scroll down."
                : "Header is always solid — no fade effect."}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Apply header display settings across the entire site
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  localStorage.setItem(LS_HEADER, JSON.stringify({ transparent: headerTransparent }));
                  window.dispatchEvent(new Event("tc-header-settings-changed"));
                  setHeaderSaved(true);
                  setTimeout(() => setHeaderSaved(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 transition-colors"
              >
                {headerSaved ? "All Saved ✓" : "Save All"}
              </button>
              <button
                onClick={() => {
                  setHeaderTransparent(true);
                  localStorage.removeItem(LS_HEADER);
                  window.dispatchEvent(new Event("tc-header-settings-changed"));
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
              >
                Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header panel (win98) ── */}
      {subTab === "header" &&
        win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 18px",
            cursor: "pointer",
            minWidth: 88,
          };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          const RADIO: React.CSSProperties = {
            accentColor: "#000080",
            marginRight: 4,
            cursor: "pointer",
          };
          return (
            <div style={{ padding: "4px 2px 14px", fontFamily: F, fontSize: 11, color: "#000" }}>
              <div style={{ ...GRP, marginTop: 8 }}>
                <span style={GRP_LBL}>Header Transparency</span>
                <p style={{ fontFamily: F, fontSize: 11, color: "#000", marginBottom: 10 }}>
                  Control whether the header fades in from transparent on scroll, or stays solid.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontFamily: F, fontSize: 11 }}>
                    <input
                      type="radio"
                      name="headerMode"
                      checked={headerTransparent}
                      onChange={() => setHeaderTransparent(true)}
                      style={RADIO}
                    />
                    Transparent at top (fades in on scroll)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontFamily: F, fontSize: 11 }}>
                    <input
                      type="radio"
                      name="headerMode"
                      checked={!headerTransparent}
                      onChange={() => setHeaderTransparent(false)}
                      style={RADIO}
                    />
                    Always visible (solid)
                  </label>
                </div>
              </div>
              <div
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap" as const,
                  marginTop: 14,
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Apply header display settings across the entire site
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => {
                      localStorage.setItem(LS_HEADER, JSON.stringify({ transparent: headerTransparent }));
                      window.dispatchEvent(new Event("tc-header-settings-changed"));
                      setHeaderSaved(true);
                      setTimeout(() => setHeaderSaved(false), 2000);
                    }}
                    style={BTN_LG}
                  >
                    {headerSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => {
                      setHeaderTransparent(true);
                      localStorage.removeItem(LS_HEADER);
                      window.dispatchEvent(new Event("tc-header-settings-changed"));
                    }}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ── Colors panel ── */}
      {subTab === "colors" && !win98 && (
        <div className="space-y-4">
          {/* ── Card 1: Button Colors ── */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Button Colors
            </p>
            <p className="text-xs text-slate-500">
              {dict.admin.custom_live_preview}
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {colorFields
                .filter(
                  (f) =>
                    f.key === "brandGreen" ||
                    f.key === "brandMid" ||
                    f.key === "brandBtnText",
                )
                .map(({ key, label, default: defaultHex }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="relative w-9 h-9 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
                        style={{ backgroundColor: colors[key] }}
                      >
                        <input
                          type="color"
                          value={colors[key]}
                          onChange={(e) => applyColor(key, e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={colors[key]}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^#[0-9a-fA-F]{0,6}$/.test(v)) applyColor(key, v);
                        }}
                        placeholder={defaultHex}
                        maxLength={7}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div
                className="px-5 py-2 text-sm font-bold rounded"
                style={{
                  backgroundColor: colors.brandGreen,
                  color: colors.brandBtnText,
                }}
              >
                Default
              </div>
              <div
                className="px-5 py-2 text-sm font-bold rounded"
                style={{
                  backgroundColor: colors.brandMid,
                  color: colors.brandBtnText,
                }}
              >
                Hover
              </div>
            </div>
          </div>
          {/* ── Card 2: Header & Footer ── */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Header &amp; Footer Background
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {(["headerBg", "footerBg"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {key === "headerBg" ? "Header" : "Footer"}
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className="relative w-9 h-9 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
                      style={{ backgroundColor: colors[key] }}
                    >
                      <input
                        type="color"
                        value={colors[key]}
                        onChange={(e) => applyColor(key, e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={colors[key]}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v)) applyColor(key, v);
                      }}
                      placeholder="#040f08"
                      maxLength={7}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div
                    className="h-7 border border-slate-700"
                    style={{ backgroundColor: colors[key] }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* ── Card 3: Save ── */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-300">
                Save all changes
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Applies all color &amp; background overrides site-wide
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={saveColors}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-300 transition-colors"
              >
                {colorSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {colorSaved ? "All saved!" : "Save all"}
              </button>
              <button
                onClick={resetColors}
                className="inline-flex items-center gap-2 rounded-lg border border-red-700/60 px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:border-red-500 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore all defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === "colors" &&
        win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          const FIELD_LBL: React.CSSProperties = {
            fontSize: 11,
            color: "#000",
            fontFamily: F,
            marginBottom: 2,
            display: "block",
          };
          const SWATCH: React.CSSProperties = {
            width: 20,
            height: 20,
            flexShrink: 0,
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          };
          const HEX: React.CSSProperties = {
            width: 80,
            fontFamily: '"Courier New", monospace',
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "1px 4px",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 18px",
            cursor: "pointer",
            minWidth: 88,
          };
          const BTN_RED: React.CSSProperties = { ...BTN, color: "#cc0000" };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          const PREVIEW_BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "default",
          };
          const btnFields = colorFields.filter(
            (f) =>
              f.key === "brandGreen" ||
              f.key === "brandMid" ||
              f.key === "brandBtnText",
          );

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
              }}
            >
              {/* ── Row 1: two group boxes side by side ── */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  alignItems: "stretch",
                  marginTop: 8,
                }}
              >
                {/* ── Group: Button Colors ── */}
                <div style={{ ...GRP, flex: "1 1 200px" }}>
                  <span style={GRP_LBL}>Button Colors</span>

                  {/* fields in a 3-column grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, auto)",
                      gap: "6px 10px",
                    }}
                  >
                    {btnFields.map(({ key, label }) => (
                      <div key={key}>
                        <span style={FIELD_LBL}>{label}</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{ ...SWATCH, backgroundColor: colors[key] }}
                          >
                            <input
                              type="color"
                              value={colors[key]}
                              onChange={(e) => applyColor(key, e.target.value)}
                              style={{
                                position: "absolute",
                                inset: 0,
                                opacity: 0,
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            value={colors[key]}
                            maxLength={7}
                            style={HEX}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (/^#[0-9a-fA-F]{0,6}$/.test(v))
                                applyColor(key, v);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={HR} />

                  {/* preview row */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{ fontSize: 11, color: "#555", marginRight: 2 }}
                    >
                      Preview:
                    </span>
                    <button
                      style={{
                        ...PREVIEW_BTN,
                        backgroundColor: colors.brandGreen,
                        color: colors.brandBtnText,
                      }}
                    >
                      Default
                    </button>
                    <button
                      style={{
                        ...PREVIEW_BTN,
                        backgroundColor: colors.brandMid,
                        color: colors.brandBtnText,
                      }}
                    >
                      Hover
                    </button>
                  </div>
                </div>

                {/* ── Group: Page Structure ── */}
                <div style={{ ...GRP, flex: "1 1 200px" }}>
                  <span style={GRP_LBL}>Page Structure</span>

                  {/* fields in a 2-column grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, auto)",
                      gap: "6px 10px",
                    }}
                  >
                    {(["headerBg", "footerBg"] as const).map((key) => (
                      <div key={key}>
                        <span style={FIELD_LBL}>
                          {key === "headerBg" ? "Header" : "Footer"}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{ ...SWATCH, backgroundColor: colors[key] }}
                          >
                            <input
                              type="color"
                              value={colors[key]}
                              onChange={(e) => applyColor(key, e.target.value)}
                              style={{
                                position: "absolute",
                                inset: 0,
                                opacity: 0,
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            value={colors[key]}
                            maxLength={7}
                            style={HEX}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (/^#[0-9a-fA-F]{0,6}$/.test(v))
                                applyColor(key, v);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={HR} />

                  {/* preview bars */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{ fontSize: 11, color: "#555", marginRight: 2 }}
                    >
                      Preview:
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      {(["headerBg", "footerBg"] as const).map((key) => (
                        <div
                          key={key}
                          style={{
                            background: colors[key],
                            width: 100,
                            border: "1px solid #808080",
                            padding: "2px 6px",
                            fontSize: 9,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span style={{ opacity: 0.55, fontSize: 8 }}>
                            ■■■
                          </span>
                          <span>
                            {key === "headerBg" ? "Header" : "Footer"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ══ Bottom bar — Global Actions ══ */}
              <div
                style={{
                  ...GRP,
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  {colorSaved
                    ? "✓  All changes saved."
                    : "Changes are applied live instantly."}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={saveColors} style={BTN_LG}>
                    {colorSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={resetColors}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ── Fonts modern panel ── */}
      {subTab === "fonts" &&
        !win98 &&
        (() => {
          const activeFontFamily =
            FONT_OPTIONS.find((f) => f.id === selectedFont)?.family ??
            '"MS Sans Serif", Arial, sans-serif';
          const weightLabel: Record<string, string> = {
            "100": "Thin",
            "200": "ExtraLight",
            "300": "Light",
            "400": "Regular",
            "500": "Medium",
            "600": "SemiBold",
            "700": "Bold",
            "800": "ExtraBold",
            "900": "Black",
          };
          return (
            <div className="space-y-4">
              {/* Font family grid */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Typeface
                </p>
                <p className="text-[11px] text-slate-500">
                  Choose the font family used across the entire site.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {FONT_OPTIONS.map((font) => {
                    const isActive = selectedFont === font.id;
                    return (
                      <button
                        key={font.id}
                        onClick={() => applyFont(font)}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          isActive
                            ? "bg-amber-400/10 border-amber-400/60 ring-1 ring-amber-400/30"
                            : "bg-slate-800/40 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <p
                          className={`text-base font-bold truncate mb-0.5 ${isActive ? "text-amber-300" : "text-white"}`}
                          style={{ fontFamily: font.family }}
                        >
                          {font.label}
                        </p>
                        <p
                          className="text-[11px] text-slate-500"
                          style={{ fontFamily: font.family }}
                        >
                          Aa Bb 123
                        </p>
                        {isActive && (
                          <p className="text-[10px] font-bold text-amber-400 mt-1 uppercase tracking-widest">
                            ✓ Active
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typography controls + live preview */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Controls */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Typography Controls
                  </p>
                  {/* Weight */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">Font Weight</p>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {weightLabel[fontWeight] ?? fontWeight}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={900}
                      step={100}
                      value={fontWeight}
                      onChange={(e) => applyFontWeight(e.target.value)}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                      <span>100</span>
                      <span>300</span>
                      <span>400</span>
                      <span>600</span>
                      <span>700</span>
                      <span>900</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-800" />
                  {/* Letter spacing */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">Letter Spacing</p>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {letterSpacing}em
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-0.05}
                      max={0.2}
                      step={0.005}
                      value={letterSpacing}
                      onChange={(e) => applyLetterSpacing(e.target.value)}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                      <span>-0.05</span>
                      <span>0</span>
                      <span>0.1</span>
                      <span>0.2em</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-800" />
                  {/* Line height */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">Line Height</p>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {lineHeight}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1.0}
                      max={2.2}
                      step={0.05}
                      value={lineHeight}
                      onChange={(e) => applyLineHeight(e.target.value)}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                      <span>1.0</span>
                      <span>1.4</span>
                      <span>1.65</span>
                      <span>2.0</span>
                      <span>2.2</span>
                    </div>
                  </div>
                </div>

                {/* Live preview */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Live Preview
                  </p>
                  <div
                    className="rounded-xl bg-slate-800 border border-slate-700 p-4 space-y-2"
                    style={{
                      fontFamily: activeFontFamily,
                      letterSpacing: `${letterSpacing}em`,
                      lineHeight,
                      fontWeight,
                    }}
                  >
                    <p className="text-lg font-bold text-white">
                      Team Cargo — Professioneel Transport
                    </p>
                    <p className="text-sm text-slate-300">
                      Wij maken onze klanten en die van uw tevreden.
                      Betrouwbaar, snel en professioneel.
                    </p>
                    <p className="text-xs text-slate-500">
                      De beste keuze voor uw logistieke behoeften. Snel, veilig
                      en betrouwbaar transport door heel Nederland.
                    </p>
                  </div>
                  <div
                    className="rounded-xl bg-amber-400 p-3"
                    style={{
                      fontFamily: activeFontFamily,
                      letterSpacing: `${letterSpacing}em`,
                      lineHeight,
                      fontWeight,
                    }}
                  >
                    <p className="text-xs text-amber-900 opacity-70 mb-0.5">
                      Dark button sample
                    </p>
                    <p className="text-sm font-bold text-amber-900">
                      Transport · Logistiek · Nederland
                    </p>
                  </div>
                </div>
              </div>

              {/* Global actions */}
              <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-slate-400">
                  Apply typography settings across the entire site
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={saveFont}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 transition-colors"
                  >
                    {fontSaved ? "All Saved \u2713" : "Save All"}
                  </button>
                  <button
                    onClick={resetFont}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    Restore Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ── Fonts Win98 panel ── */}
      {subTab === "fonts" &&
        win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "pointer",
            minWidth: 60,
            whiteSpace: "nowrap" as const,
          };
          const BTN_RED: React.CSSProperties = {
            ...BTN,
            color: "#800000",
          };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "5px 20px",
            fontWeight: "bold",
            fontSize: 12,
          };
          const activeFontFamily =
            FONT_OPTIONS.find((f) => f.id === selectedFont)?.family ?? F;
          const weightLabel: Record<string, string> = {
            "100": "Thin",
            "200": "ExtraLight",
            "300": "Light",
            "400": "Regular",
            "500": "Medium",
            "600": "SemiBold",
            "700": "Bold",
            "800": "ExtraBold",
            "900": "Black",
          };

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
              }}
            >
              <style>{`
                @media (max-width: 600px) {
                  .w98f-typeface { grid-template-columns: repeat(2, 1fr) !important; }
                  .w98f-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>

              {/* ══ Section A — Typeface ══ */}
              <div style={{ ...GRP, marginTop: 8 }}>
                <span style={GRP_LBL}>Typeface</span>
                <p style={{ fontSize: 10, color: "#555", marginBottom: 8 }}>
                  Choose the font family used across the entire site.
                </p>
                <div
                  className="w98f-typeface"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 8,
                  }}
                >
                  {FONT_OPTIONS.map((font) => {
                    const isActive = selectedFont === font.id;
                    return (
                      <button
                        key={font.id}
                        onClick={() => applyFont(font)}
                        style={{
                          fontFamily: F,
                          border: "2px solid",
                          borderColor: isActive
                            ? "#000080 #c0c0c0 #c0c0c0 #000080"
                            : "#fff #808080 #808080 #fff",
                          background: isActive ? "#000080" : "#c0c0c0",
                          color: isActive ? "#fff" : "#000",
                          padding: "8px 6px",
                          cursor: "pointer",
                          textAlign: "left" as const,
                          position: "relative" as const,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: font.family,
                            fontSize: 15,
                            fontWeight: "bold",
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap" as const,
                          }}
                        >
                          {font.label}
                        </div>
                        <div
                          style={{
                            fontFamily: font.family,
                            fontSize: 10,
                            opacity: 0.75,
                          }}
                        >
                          Aa Bb Cc 123
                        </div>
                        {isActive && (
                          <div
                            style={{
                              fontSize: 9,
                              marginTop: 4,
                              fontWeight: "bold",
                              letterSpacing: 1,
                            }}
                          >
                            ✓ ACTIVE
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ══ Section B — Typography Controls + Live Preview ══ */}
              <div
                className="w98f-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {/* Typography Controls */}
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Typography Controls</span>

                  {/* Font Weight */}
                  <div style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontSize: 10, color: "#555" }}>
                        Font Weight
                      </span>
                      <span
                        style={{
                          fontFamily: '"Courier New", monospace',
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {weightLabel[fontWeight] ?? fontWeight}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={900}
                      step={100}
                      value={fontWeight}
                      onChange={(e) => applyFontWeight(e.target.value)}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        accentColor: "#000080",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 9,
                        color: "#808080",
                        fontFamily: '"Courier New", monospace',
                        marginTop: 1,
                      }}
                    >
                      <span>100</span>
                      <span>300</span>
                      <span>400</span>
                      <span>600</span>
                      <span>700</span>
                      <span>900</span>
                    </div>
                  </div>

                  <div style={{ ...HR }} />

                  {/* Letter Spacing */}
                  <div style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontSize: 10, color: "#555" }}>
                        Letter Spacing
                      </span>
                      <span
                        style={{
                          fontFamily: '"Courier New", monospace',
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {letterSpacing}em
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-0.05}
                      max={0.2}
                      step={0.005}
                      value={letterSpacing}
                      onChange={(e) => applyLetterSpacing(e.target.value)}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        accentColor: "#000080",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 9,
                        color: "#808080",
                        fontFamily: '"Courier New", monospace',
                        marginTop: 1,
                      }}
                    >
                      <span>-0.05em</span>
                      <span>0em</span>
                      <span>0.1em</span>
                      <span>0.2em</span>
                    </div>
                  </div>

                  <div style={{ ...HR }} />

                  {/* Line Height */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ fontSize: 10, color: "#555" }}>
                        Line Height
                      </span>
                      <span
                        style={{
                          fontFamily: '"Courier New", monospace',
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {lineHeight}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1.0}
                      max={2.2}
                      step={0.05}
                      value={lineHeight}
                      onChange={(e) => applyLineHeight(e.target.value)}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        accentColor: "#000080",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 9,
                        color: "#808080",
                        fontFamily: '"Courier New", monospace',
                        marginTop: 1,
                      }}
                    >
                      <span>1.0</span>
                      <span>1.4</span>
                      <span>1.65</span>
                      <span>2.0</span>
                      <span>2.2</span>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Live Preview</span>
                  <div
                    style={{
                      border: "2px solid",
                      borderColor: "#808080 #fff #fff #808080",
                      background: "#fff",
                      padding: 10,
                      fontFamily: activeFontFamily,
                      letterSpacing: `${letterSpacing}em`,
                      lineHeight,
                      fontWeight,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#000",
                        margin: "0 0 6px",
                      }}
                    >
                      Team Cargo — Professioneel Transport
                    </p>
                    <p
                      style={{ fontSize: 12, color: "#333", margin: "0 0 5px" }}
                    >
                      Wij maken onze klanten en die van uw tevreden.
                      Betrouwbaar, snel en professioneel.
                    </p>
                    <p style={{ fontSize: 10, color: "#808080", margin: 0 }}>
                      De beste keuze voor uw logistieke behoeften. Snel, veilig
                      en betrouwbaar transport door heel Nederland.
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      border: "2px solid",
                      borderColor: "#808080 #fff #fff #808080",
                      background: "#000080",
                      color: "#fff",
                      padding: "6px 8px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: activeFontFamily,
                        letterSpacing: `${letterSpacing}em`,
                        lineHeight,
                        fontWeight,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          opacity: 0.7,
                          display: "block",
                          marginBottom: 2,
                          fontFamily: F,
                        }}
                      >
                        Dark background sample
                      </span>
                      <span style={{ fontSize: 13 }}>
                        Transport · Logistiek · Nederland
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ══ Bottom bar — Global Actions ══ */}
              <div
                style={{
                  ...GRP,
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Applies all typography settings across the entire site
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={saveFont} style={BTN_LG}>
                    {fontSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={resetFont}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ── Hero sections panel ── */}
      {subTab === "hero" && !win98 && (
        <div className="space-y-4">
          {translateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {translateError}
            </p>
          )}

          {heroTranslationPending && (
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-3 text-xs text-amber-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              Translating to all 18 languages in the background… This tab will
              auto-refresh when done.
            </div>
          )}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_slogan}
            </p>
            <textarea
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              rows={3}
              placeholder="Start Your Driving Job in the Netherlands — We Handle the Rest."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "slogan")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "slogan" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.slogan ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.slogan ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setSlogan("");
                  void persist({ ...buildSource(), slogan: "" }, "slogan");
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 2 ── Badge Text */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_badge}
            </p>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Driver Recruitment · Amsterdam, NL"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "badge")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "badge" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.badge ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.badge ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setBadge("");
                  void persist({ ...buildSource(), badge: "" }, "badge");
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 3 ── Trust Line */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_trust}
            </p>
            <div className="flex items-center gap-2">
              {/* Trust icon picker */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setHeroTrustIconPicker((v) => !v);
                    setHeroTrustIconPage(0);
                  }}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-700 border border-slate-600 hover:border-amber-400 transition-colors"
                  title="Pick icon"
                >
                  {(() => {
                    const opt = TRUST_ICON_OPTS.flat().find(
                      (o) => o.id === heroTrustIcon,
                    );
                    const Ic = opt?.Icon ?? Shield;
                    return <Ic className="w-4 h-4 text-amber-400" />;
                  })()}
                </button>
                {heroTrustIconPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-50 w-56 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">
                        Choose icon
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={heroTrustIconPage === 0}
                          onClick={() => setHeroTrustIconPage((p) => p - 1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                        >
                          ‹
                        </button>
                        <span className="text-[9px] text-slate-500 w-8 text-center">
                          {heroTrustIconPage + 1} / {TRUST_ICON_OPTS.length}
                        </span>
                        <button
                          type="button"
                          disabled={
                            heroTrustIconPage === TRUST_ICON_OPTS.length - 1
                          }
                          onClick={() => setHeroTrustIconPage((p) => p + 1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {TRUST_ICON_OPTS[heroTrustIconPage].map(
                        ({ id, Icon: Ic, label }) => (
                          <button
                            key={id}
                            type="button"
                            title={label}
                            onClick={() => {
                              setHeroTrustIcon(id);
                              setHeroTrustIconPicker(false);
                            }}
                            className={
                              "w-9 h-9 flex items-center justify-center rounded-lg transition-colors " +
                              (heroTrustIcon === id
                                ? "bg-amber-400/20 border border-amber-400/50 text-amber-300"
                                : "text-slate-400 hover:bg-slate-700 hover:text-white")
                            }
                          >
                            <Ic className="w-4 h-4" />
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      type="button"
                      title="Reset to default"
                      onClick={() => {
                        setHeroTrustIcon("");
                        setHeroTrustIconPicker(false);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg py-1 text-[10px] text-slate-500 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset to default
                    </button>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={trustLine}
                onChange={(e) => setTrustLine(e.target.value)}
                placeholder="No experience with Dutch paperwork? No problem — we guide you step by step."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "trustLine")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "trustLine" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.trustLine ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.trustLine ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setTrustLine("");
                  setHeroTrustIcon("");
                  void persist(
                    { ...buildSource(), trustLine: "", trustIcon: "" },
                    "trustLine",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 4 ── Trust Bar Background */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_trust_bg}
            </p>
            <div className="flex items-center gap-3">
              <div
                className="relative w-10 h-10 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
                style={{ backgroundColor: trustBg }}
              >
                <input
                  type="color"
                  value={trustBg}
                  onChange={(e) => {
                    setTrustBg(e.target.value);
                    document.documentElement.style.setProperty(
                      "--brand-trust-bg",
                      e.target.value,
                    );
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={trustBg}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                    setTrustBg(v);
                    if (v.length === 7)
                      document.documentElement.style.setProperty(
                        "--brand-trust-bg",
                        v,
                      );
                  }
                }}
                maxLength={7}
                className="max-w-35 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
              <div
                className="flex-1 h-10 rounded-lg flex items-center justify-center gap-2 text-xs font-medium"
                style={{ backgroundColor: trustBg, color: "#ffffff" }}
              >
                <span>&#128737;</span>
                <span className="truncate opacity-80">Trust bar preview</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "trustBg")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "trustBg" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.trustBg ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.trustBg ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setTrustBg(COLOR_DEFAULTS.trustBg);
                  document.documentElement.style.setProperty(
                    "--brand-trust-bg",
                    COLOR_DEFAULTS.trustBg,
                  );
                  void persist(
                    { ...buildSource(), trustBg: COLOR_DEFAULTS.trustBg },
                    "trustBg",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 5 ── Partners Strip Background */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Partners Strip Background
            </p>
            <div className="flex items-center gap-3">
              <div
                className="relative w-10 h-10 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
                style={{ backgroundColor: partnersBg }}
              >
                <input
                  type="color"
                  value={partnersBg}
                  onChange={(e) => {
                    setPartnersBg(e.target.value);
                    document.documentElement.style.setProperty(
                      "--brand-partner-bg",
                      e.target.value,
                    );
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={partnersBg}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                    setPartnersBg(v);
                    if (v.length === 7)
                      document.documentElement.style.setProperty(
                        "--brand-partner-bg",
                        v,
                      );
                  }
                }}
                maxLength={7}
                className="max-w-35 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
              <div
                className="flex-1 h-10 rounded-lg flex items-center justify-center border border-slate-700 text-xs font-medium"
                style={{ backgroundColor: partnersBg, color: "#6b7280" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Our Partners
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void persist(buildSource(), "partnersBg")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "partnersBg" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.partnersBg ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.partnersBg ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setPartnersBg("#ffffff");
                  document.documentElement.style.setProperty(
                    "--brand-partner-bg",
                    "#ffffff",
                  );
                  void persist(
                    { ...buildSource(), partnersBg: "#ffffff" },
                    "partnersBg",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 6 ── Hero Stats */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              {dict.admin.custom_hero_stats}
            </p>
            <div className="grid grid-cols-[1fr_120px_1fr] gap-3 items-center">
              <span />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide text-center">
                {dict.admin.custom_hero_stat_value}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {dict.admin.custom_hero_stat_label_text}
              </span>
            </div>
            {(
              [
                {
                  id: "1",
                  defaultVal: "500+",
                  defaultLabel: "Happy clients",
                  val: stat1Value,
                  label: stat1Label,
                  setVal: setStat1Value,
                  setLabel: setStat1Label,
                },
                {
                  id: "2",
                  defaultVal: "7+",
                  defaultLabel: "Years experience",
                  val: stat2Value,
                  label: stat2Label,
                  setVal: setStat2Value,
                  setLabel: setStat2Label,
                },
                {
                  id: "3",
                  defaultVal: "24/7",
                  defaultLabel: "Available",
                  val: stat3Value,
                  label: stat3Label,
                  setVal: setStat3Value,
                  setLabel: setStat3Label,
                },
                {
                  id: "4",
                  defaultVal: "5",
                  defaultLabel: "Top partners",
                  val: stat4Value,
                  label: stat4Label,
                  setVal: setStat4Value,
                  setLabel: setStat4Label,
                },
              ] as const
            ).map(
              ({
                id,
                defaultVal,
                defaultLabel,
                val,
                label,
                setVal,
                setLabel,
              }) => (
                <div
                  key={id}
                  className="grid grid-cols-[1fr_120px_1fr] gap-3 items-center"
                >
                  <span className="text-xs text-slate-500 font-medium">
                    {defaultLabel}
                  </span>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder={defaultVal}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder={defaultLabel}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                </div>
              ),
            )}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => void persist(buildSource(), "stats")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "stats" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.stats ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.stats ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setStat1Value("");
                  setStat1Label("");
                  setStat2Value("");
                  setStat2Label("");
                  setStat3Value("");
                  setStat3Label("");
                  setStat4Value("");
                  setStat4Label("");
                  void persist(
                    {
                      ...buildSource(),
                      stat1Value: "",
                      stat1Label: "",
                      stat2Value: "",
                      stat2Label: "",
                      stat3Value: "",
                      stat3Label: "",
                      stat4Value: "",
                      stat4Label: "",
                    },
                    "stats",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 7 ── Partner Logos */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Partner Logos
              </p>
              <button
                type="button"
                onClick={() =>
                  setPartners((p) => [...p, { name: "", logo: "" }])
                }
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                + Add partner
              </button>
            </div>
            <div className="space-y-2">
              {partners.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) =>
                      setPartners((prev) =>
                        prev.map((x, j) =>
                          j === i ? { ...x, name: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Name (e.g. FedEx)"
                    className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                  <CloudinaryLogoUpload
                    value={p.logo}
                    onChange={(url) =>
                      setPartners((prev) =>
                        prev.map((x, j) => (j === i ? { ...x, logo: url } : x)),
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removePartner(p.logo, i)}
                    className="text-slate-500 hover:text-red-400 transition-colors shrink-0 text-lg leading-none"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => void persist(buildSource(), "partners")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "partners" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.partners ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.partners ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setPartners(DEFAULT_PARTNERS);
                  void persist(
                    { ...buildSource(), partners: DEFAULT_PARTNERS },
                    "partners",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 8 ── Desktop Hero Image */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Desktop Hero Image
            </p>
            <p className="text-xs text-slate-500">
              Shown on screens ≥ 768 px. Use a wide landscape photo for best
              results.
            </p>
            {/* Current image preview */}
            {(heroImgDesktop || true) && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    heroImgDesktop ||
                    "/teamCargo-trans-webP/cargo-trans-horizontal-3.webp"
                  }
                  alt="Desktop hero preview"
                  className="w-full h-full object-cover object-center"
                />
                {heroImgDesktop && (
                  <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                    Custom
                  </span>
                )}
              </div>
            )}
            <CloudinaryLogoUpload
              value={heroImgDesktop}
              onChange={setHeroImgDesktop}
              folder="tc-hero"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => void persist(buildSource(), "heroImgDesktop")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "heroImgDesktop" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.heroImgDesktop ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.heroImgDesktop ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setHeroImgDesktop("");
                  void persist(
                    { ...buildSource(), heroImgDesktop: "" },
                    "heroImgDesktop",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 9 ── Mobile Hero Image */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Mobile Hero Image
            </p>
            <p className="text-xs text-slate-500">
              Shown on screens &lt; 768 px. Use a tall portrait photo for best
              results.
            </p>
            {/* Current image preview — portrait ratio */}
            {(heroImgMobile || true) && (
              <div className="relative w-40 h-56 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    heroImgMobile ||
                    "/teamCargo-trans-webP/cargo-trans-vertical-3.webp"
                  }
                  alt="Mobile hero preview"
                  className="w-full h-full object-cover object-center"
                />
                {heroImgMobile && (
                  <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                    Custom
                  </span>
                )}
              </div>
            )}
            <CloudinaryLogoUpload
              value={heroImgMobile}
              onChange={setHeroImgMobile}
              folder="tc-hero"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => void persist(buildSource(), "heroImgMobile")}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingKey === "heroImgMobile" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : sectionSaved.heroImgMobile ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {sectionSaved.heroImgMobile ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setHeroImgMobile("");
                  void persist(
                    { ...buildSource(), heroImgMobile: "" },
                    "heroImgMobile",
                  );
                }}
                disabled={translating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* ── Global action bar ─────────────────────────────────── */}
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-amber-300">
                Save all changes
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Applies every section above at once &amp; translates to all 18
                languages
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => void saveAll()}
                disabled={savingAll || translating}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {savingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : allSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {allSaved ? "All saved!" : "Save all"}
              </button>
              <button
                onClick={() => void resetAll()}
                disabled={savingAll || translating}
                className="inline-flex items-center gap-2 rounded-lg border border-red-700/60 px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:border-red-500 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore all defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Win98 panel ── */}
      {subTab === "hero" &&
        win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const INPUT: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "2px 4px",
          };
          const TEXTAREA: React.CSSProperties = {
            ...INPUT,
            resize: "vertical" as const,
            width: "100%",
            display: "block",
          };
          const HEX: React.CSSProperties = {
            width: 80,
            fontFamily: '"Courier New", monospace',
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "1px 4px",
          };
          const SWATCH: React.CSSProperties = {
            width: 20,
            height: 20,
            flexShrink: 0,
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "pointer",
            minWidth: 68,
          };
          const BTN_RED: React.CSSProperties = { ...BTN, color: "#cc0000" };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          const ROW: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: 6,
          };

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
              }}
            >
              <style>{`
                @media (max-width: 600px) {
                  .w98h-grid-a, .w98h-grid-b, .w98h-grid-c {
                    grid-template-columns: 1fr !important;
                  }
                  .w98h-colors {
                    flex-direction: column !important;
                    gap: 10px !important;
                  }
                  .w98h-vdivider { display: none !important; }
                  .w98h-color-row { flex-wrap: wrap !important; }
                }
              `}</style>
              {translateError && (
                <div
                  style={{
                    background: "#fff0f0",
                    border: "2px solid #cc0000",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#cc0000",
                  }}
                >
                  {translateError}
                </div>
              )}
              {heroTranslationPending && (
                <div
                  style={{
                    background: "#ffffd0",
                    border: "1px solid #808080",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#555",
                  }}
                >
                  Translating to all 18 languages… please wait.
                </div>
              )}

              {/* ══ Section A — Content ══ */}
              <div
                className="w98h-grid-a"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 10,
                  marginTop: 8,
                }}
              >
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Slogan</span>
                  <textarea
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    rows={2}
                    placeholder="Start Your Driving Job in the Netherlands — We Handle the Rest."
                    style={{ ...TEXTAREA }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button
                      onClick={() => void persist(buildSource(), "slogan")}
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.slogan ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setSlogan("");
                        void persist(
                          { ...buildSource(), slogan: "" },
                          "slogan",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Badge Text</span>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Driver Recruitment · Amsterdam, NL"
                    style={{ ...INPUT, width: "100%", marginBottom: 6 }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <button
                      onClick={() => void persist(buildSource(), "badge")}
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.badge ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setBadge("");
                        void persist({ ...buildSource(), badge: "" }, "badge");
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Trust Line — full width */}
                <div style={{ ...GRP, gridColumn: "1 / -1" }}>
                  <span style={GRP_LBL}>Trust Line</span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroTrustIconPicker((v) => !v);
                          setHeroTrustIconPage(0);
                        }}
                        style={{ ...BTN, minWidth: 0, padding: "2px 8px" }}
                        title="Pick icon"
                      >
                        {(() => {
                          const opt = TRUST_ICON_OPTS.flat().find(
                            (o) => o.id === heroTrustIcon,
                          );
                          return (
                            <span style={{ fontSize: 10 }}>
                              {opt ? opt.label.slice(0, 3) : "Ico"}
                            </span>
                          );
                        })()}
                      </button>
                      {heroTrustIconPicker && (
                        <div
                          data-iconpicker
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            marginTop: 2,
                            zIndex: 50,
                            width: 176,
                            background: "#c0c0c0",
                            border: "2px solid",
                            borderColor: "#fff #808080 #808080 #fff",
                            padding: 6,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 4,
                            }}
                          >
                            <span style={{ fontSize: 10, color: "#555" }}>
                              Choose icon
                            </span>
                            <div
                              style={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                              }}
                            >
                              <button
                                type="button"
                                disabled={heroTrustIconPage === 0}
                                onClick={() =>
                                  setHeroTrustIconPage((p) => p - 1)
                                }
                                style={{
                                  ...BTN,
                                  minWidth: 0,
                                  padding: "0 5px",
                                }}
                              >
                                ‹
                              </button>
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "#555",
                                  width: 30,
                                  textAlign: "center" as const,
                                }}
                              >
                                {heroTrustIconPage + 1}/{TRUST_ICON_OPTS.length}
                              </span>
                              <button
                                type="button"
                                disabled={
                                  heroTrustIconPage ===
                                  TRUST_ICON_OPTS.length - 1
                                }
                                onClick={() =>
                                  setHeroTrustIconPage((p) => p + 1)
                                }
                                style={{
                                  ...BTN,
                                  minWidth: 0,
                                  padding: "0 5px",
                                }}
                              >
                                ›
                              </button>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(5, 1fr)",
                              gap: 2,
                            }}
                          >
                            {TRUST_ICON_OPTS[heroTrustIconPage].map(
                              ({ id, Icon: Ic, label }) => (
                                <button
                                  key={id}
                                  type="button"
                                  title={label}
                                  onClick={() => {
                                    setHeroTrustIcon(id);
                                    setHeroTrustIconPicker(false);
                                  }}
                                  style={{
                                    ...BTN,
                                    minWidth: 0,
                                    padding: "3px",
                                    background:
                                      heroTrustIcon === id
                                        ? "#d0d0d0"
                                        : "#c0c0c0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Ic
                                    style={{
                                      width: 12,
                                      height: 12,
                                      display: "block",
                                    }}
                                  />
                                </button>
                              ),
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setHeroTrustIcon("");
                              setHeroTrustIconPicker(false);
                            }}
                            style={{
                              ...BTN,
                              width: "100%",
                              marginTop: 4,
                              fontSize: 10,
                            }}
                          >
                            Reset icon
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={trustLine}
                      onChange={(e) => setTrustLine(e.target.value)}
                      placeholder="No experience with Dutch paperwork? No problem…"
                      style={{ ...INPUT, flex: 1 }}
                    />
                    <button
                      onClick={() => void persist(buildSource(), "trustLine")}
                      disabled={translating}
                      style={{ ...BTN, flexShrink: 0 }}
                    >
                      {sectionSaved.trustLine ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setTrustLine("");
                        setHeroTrustIcon("");
                        void persist(
                          { ...buildSource(), trustLine: "", trustIcon: "" },
                          "trustLine",
                        );
                      }}
                      disabled={translating}
                      style={{ ...BTN_RED, flexShrink: 0 }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Strip Colors — full-width row ══ */}
              <div style={{ ...GRP, marginTop: 10 }}>
                <span style={GRP_LBL}>Strip Colors</span>
                <div
                  className="w98h-colors"
                  style={{ display: "flex", gap: 24, alignItems: "flex-start" }}
                >
                  {/* Trust Bar — single row */}
                  <div className="w98h-color-row" style={{ ...ROW, flex: 1 }}>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#555",
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      Trust Bar
                    </span>
                    <div style={{ ...SWATCH, backgroundColor: trustBg }}>
                      <input
                        type="color"
                        value={trustBg}
                        onChange={(e) => {
                          setTrustBg(e.target.value);
                          document.documentElement.style.setProperty(
                            "--brand-trust-bg",
                            e.target.value,
                          );
                        }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={trustBg}
                      maxLength={7}
                      style={{ ...HEX, width: 72 }}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                          setTrustBg(v);
                          if (v.length === 7)
                            document.documentElement.style.setProperty(
                              "--brand-trust-bg",
                              v,
                            );
                        }
                      }}
                    />
                    <button
                      onClick={() => void persist(buildSource(), "trustBg")}
                      disabled={translating}
                      style={{ ...BTN, minWidth: 0, padding: "3px 8px" }}
                    >
                      {sectionSaved.trustBg ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setTrustBg(COLOR_DEFAULTS.trustBg);
                        document.documentElement.style.setProperty(
                          "--brand-trust-bg",
                          COLOR_DEFAULTS.trustBg,
                        );
                        void persist(
                          { ...buildSource(), trustBg: COLOR_DEFAULTS.trustBg },
                          "trustBg",
                        );
                      }}
                      disabled={translating}
                      style={{ ...BTN_RED, minWidth: 0, padding: "3px 8px" }}
                    >
                      Reset
                    </button>
                    <div
                      style={{
                        flex: 1,
                        height: 20,
                        background: trustBg,
                        border: "1px solid #808080",
                      }}
                    />
                  </div>

                  <div
                    className="w98h-vdivider"
                    style={{
                      borderLeft: "1px solid #808080",
                      alignSelf: "stretch",
                    }}
                  />

                  {/* Partners Strip — single row */}
                  <div className="w98h-color-row" style={{ ...ROW, flex: 1 }}>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#555",
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      Partners Strip
                    </span>
                    <div style={{ ...SWATCH, backgroundColor: partnersBg }}>
                      <input
                        type="color"
                        value={partnersBg}
                        onChange={(e) => {
                          setPartnersBg(e.target.value);
                          document.documentElement.style.setProperty(
                            "--brand-partner-bg",
                            e.target.value,
                          );
                        }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={partnersBg}
                      maxLength={7}
                      style={{ ...HEX, width: 72 }}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                          setPartnersBg(v);
                          if (v.length === 7)
                            document.documentElement.style.setProperty(
                              "--brand-partner-bg",
                              v,
                            );
                        }
                      }}
                    />
                    <button
                      onClick={() => void persist(buildSource(), "partnersBg")}
                      disabled={translating}
                      style={{ ...BTN, minWidth: 0, padding: "3px 8px" }}
                    >
                      {sectionSaved.partnersBg ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setPartnersBg("#ffffff");
                        document.documentElement.style.setProperty(
                          "--brand-partner-bg",
                          "#ffffff",
                        );
                        void persist(
                          { ...buildSource(), partnersBg: "#ffffff" },
                          "partnersBg",
                        );
                      }}
                      disabled={translating}
                      style={{ ...BTN_RED, minWidth: 0, padding: "3px 8px" }}
                    >
                      Reset
                    </button>
                    <div
                      style={{
                        flex: 1,
                        height: 20,
                        background: partnersBg,
                        border: "1px solid #808080",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ══ Section B — Stats + Logos ══ */}
              <div
                className="w98h-grid-b"
                style={{
                  display: "grid",
                  gridTemplateColumns: "30fr 70fr",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Hero Stats</span>
                  {(
                    [
                      {
                        id: "1",
                        dv: "500+",
                        dl: "Happy clients",
                        val: stat1Value,
                        lbl: stat1Label,
                        sv: setStat1Value,
                        sl: setStat1Label,
                      },
                      {
                        id: "2",
                        dv: "7+",
                        dl: "Years exp.",
                        val: stat2Value,
                        lbl: stat2Label,
                        sv: setStat2Value,
                        sl: setStat2Label,
                      },
                      {
                        id: "3",
                        dv: "24/7",
                        dl: "Available",
                        val: stat3Value,
                        lbl: stat3Label,
                        sv: setStat3Value,
                        sl: setStat3Label,
                      },
                      {
                        id: "4",
                        dv: "5",
                        dl: "Top partners",
                        val: stat4Value,
                        lbl: stat4Label,
                        sv: setStat4Value,
                        sl: setStat4Label,
                      },
                    ] as const
                  ).map(({ id, dv, dl, val, lbl, sv, sl }) => (
                    <div
                      key={id}
                      style={{
                        border: "2px solid",
                        borderColor: "#808080 #fff #fff #808080",
                        padding: "8px 6px 4px",
                        position: "relative",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: -6,
                          left: 6,
                          background: "#c0c0c0",
                          padding: "0 3px",
                          fontSize: 9,
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        {dl}
                      </span>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0 6px",
                        }}
                      >
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => sv(e.target.value)}
                          placeholder={dv}
                          style={{
                            ...INPUT,
                            width: "100%",
                            textAlign: "center" as const,
                            fontFamily: '"Courier New", monospace',
                            fontWeight: "bold",
                          }}
                        />
                        <input
                          type="text"
                          value={lbl}
                          onChange={(e) => sl(e.target.value)}
                          placeholder={dl}
                          style={{ ...INPUT, width: "100%" }}
                        />
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: "auto",
                      paddingTop: 6,
                    }}
                  >
                    <button
                      onClick={() => void persist(buildSource(), "stats")}
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.stats ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setStat1Value("");
                        setStat1Label("");
                        setStat2Value("");
                        setStat2Label("");
                        setStat3Value("");
                        setStat3Label("");
                        setStat4Value("");
                        setStat4Label("");
                        void persist(
                          {
                            ...buildSource(),
                            stat1Value: "",
                            stat1Label: "",
                            stat2Value: "",
                            stat2Label: "",
                            stat3Value: "",
                            stat3Label: "",
                            stat4Value: "",
                            stat4Label: "",
                          },
                          "stats",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Partner Logos</span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: 5,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setPartners((p) => [...p, { name: "", logo: "" }])
                      }
                      style={{ ...BTN, fontSize: 10 }}
                    >
                      + Add
                    </button>
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {partners.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) =>
                            setPartners((prev) =>
                              prev.map((x, j) =>
                                j === i ? { ...x, name: e.target.value } : x,
                              ),
                            )
                          }
                          placeholder="Name"
                          style={{ ...INPUT, width: 60 }}
                        />
                        <CloudinaryLogoUpload
                          value={p.logo}
                          onChange={(url) =>
                            setPartners((prev) =>
                              prev.map((x, j) =>
                                j === i ? { ...x, logo: url } : x,
                              ),
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removePartner(p.logo, i)}
                          style={{
                            ...BTN_RED,
                            minWidth: 0,
                            padding: "1px 5px",
                            fontSize: 13,
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button
                      onClick={() => void persist(buildSource(), "partners")}
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.partners ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setPartners(DEFAULT_PARTNERS);
                        void persist(
                          { ...buildSource(), partners: DEFAULT_PARTNERS },
                          "partners",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Section C — Hero Images ══ */}
              <div
                className="w98h-grid-c"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Desktop Hero Image</span>
                  <p style={{ fontSize: 10, color: "#555", margin: "0 0 5px" }}>
                    Wide landscape · screens ≥ 768 px
                  </p>
                  <div
                    style={{
                      width: "100%",
                      height: 72,
                      overflow: "hidden",
                      border: "2px solid",
                      borderColor: "#808080 #fff #fff #808080",
                      marginBottom: 5,
                      position: "relative",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        heroImgDesktop ||
                        "/teamCargo-trans-webP/cargo-trans-horizontal-3.webp"
                      }
                      alt="Desktop hero"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {heroImgDesktop && (
                      <span
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          background: "#c0c0c0",
                          border: "1px solid #808080",
                          fontSize: 9,
                          padding: "0 4px",
                        }}
                      >
                        Custom
                      </span>
                    )}
                  </div>
                  <CloudinaryLogoUpload
                    value={heroImgDesktop}
                    onChange={setHeroImgDesktop}
                    folder="tc-hero"
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                    <button
                      onClick={() =>
                        void persist(buildSource(), "heroImgDesktop")
                      }
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.heroImgDesktop ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setHeroImgDesktop("");
                        void persist(
                          { ...buildSource(), heroImgDesktop: "" },
                          "heroImgDesktop",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Mobile Hero Image</span>
                  <p style={{ fontSize: 10, color: "#555", margin: "0 0 5px" }}>
                    Tall portrait · screens &lt; 768 px
                  </p>
                  <div
                    style={{
                      width: "100%",
                      height: 72,
                      overflow: "hidden",
                      border: "2px solid",
                      borderColor: "#808080 #fff #fff #808080",
                      marginBottom: 5,
                      position: "relative",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        heroImgMobile ||
                        "/teamCargo-trans-webP/cargo-trans-vertical-3.webp"
                      }
                      alt="Mobile hero"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                      }}
                    />
                    {heroImgMobile && (
                      <span
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          background: "#c0c0c0",
                          border: "1px solid #808080",
                          fontSize: 9,
                          padding: "0 4px",
                        }}
                      >
                        Custom
                      </span>
                    )}
                  </div>
                  <CloudinaryLogoUpload
                    value={heroImgMobile}
                    onChange={setHeroImgMobile}
                    folder="tc-hero"
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                    <button
                      onClick={() =>
                        void persist(buildSource(), "heroImgMobile")
                      }
                      disabled={translating}
                      style={BTN}
                    >
                      {sectionSaved.heroImgMobile ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setHeroImgMobile("");
                        void persist(
                          { ...buildSource(), heroImgMobile: "" },
                          "heroImgMobile",
                        );
                      }}
                      disabled={translating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Bottom bar — Global Actions ══ */}
              <div
                style={{
                  ...GRP,
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all sections &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAll()}
                    disabled={savingAll || translating}
                    style={BTN_LG}
                  >
                    {allSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAll()}
                    disabled={savingAll || translating}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      {/* ══════════════════════════════════════════════════════════════════════
          Services Section panel
      ══════════════════════════════════════════════════════════════════════ */}
      {subTab === "services" &&
        win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          const INPUT: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "2px 4px",
            width: "100%",
            boxSizing: "border-box" as const,
          };
          const TEXTAREA: React.CSSProperties = {
            ...INPUT,
            resize: "vertical" as const,
            display: "block",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "pointer",
            minWidth: 68,
          };
          const BTN_RED: React.CSSProperties = { ...BTN, color: "#cc0000" };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };

          const defaultTitles = [
            "Driver Job Placement",
            "Documents Support",
            "Accommodation",
            "Ongoing Support",
            "Reliable Opportunities",
            "Local Transport",
          ];
          const defaultDescs = [
            "We connect drivers with delivery jobs at trusted logistics companies in Amsterdam and surrounding areas.",
            "We help you handle all necessary paperwork to legally work in the Netherlands.",
            "We provide housing options (shared rooms or apartments) depending on your contract.",
            "We stay available to assist you before and after you start working.",
            "We work with established logistics partners to offer stable, long-term jobs.",
            "We arrange local transport solutions to get you to and from your workplace.",
          ];

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
              }}
            >
              <style>{`
                @media (max-width: 800px) {
                  .w98s-cards-grid { grid-template-columns: 1fr 1fr !important; }
                }
                @media (max-width: 480px) {
                  .w98s-cards-grid { grid-template-columns: 1fr !important; }
                }
              `}</style>

              {/* ── Status banners ── */}
              {svcTranslateError && (
                <div
                  style={{
                    background: "#fff0f0",
                    border: "2px solid #cc0000",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#cc0000",
                    fontFamily: F,
                  }}
                >
                  {svcTranslateError}
                </div>
              )}
              {svcTranslationPending && (
                <div
                  style={{
                    background: "#ffffd0",
                    border: "1px solid #808080",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#555",
                    fontFamily: F,
                  }}
                >
                  Translating to all 18 languages… please wait.
                </div>
              )}

              {/* ══ Section Heading — full-width row ══ */}
              <div
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 10,
                }}
              >
                <span style={GRP_LBL}>Section Heading</span>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Small label
                  </div>
                  <input
                    type="text"
                    value={svcLabel}
                    onChange={(e) => setSvcLabel(e.target.value)}
                    placeholder="Our Services"
                    style={INPUT}
                  />
                </div>
                <div style={{ flex: 2, minWidth: 200 }}>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Main title
                  </div>
                  <input
                    type="text"
                    value={svcTitle}
                    onChange={(e) => setSvcTitle(e.target.value)}
                    placeholder="What We Do"
                    style={INPUT}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() =>
                      void persistServices(buildServicesSource(), "svcHeading")
                    }
                    disabled={svcTranslating}
                    style={BTN}
                  >
                    {svcSectionSaved.svcHeading ? "Saved ✓" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setSvcTitle("");
                      setSvcLabel("");
                      void persistServices(
                        { ...buildServicesSource(), title: "", label: "" },
                        "svcHeading",
                      );
                    }}
                    disabled={svcTranslating}
                    style={BTN_RED}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* ══ Service Cards — 3-column grid ══ */}
              <div
                className="w98s-cards-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  marginBottom: 12,
                  alignItems: "start",
                }}
              >
                {svcCards.map((card, i) => {
                  const cardKey = `svcCard${i}` as ServicesSectionKey;
                  return (
                    <div
                      key={i}
                      style={{
                        ...GRP,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span style={GRP_LBL}>Card {i + 1}</span>
                      {/* Image preview */}
                      <div
                        style={{
                          width: "100%",
                          height: 160,
                          overflow: "hidden",
                          border: "2px solid",
                          borderColor: "#808080 #fff #fff #808080",
                          marginBottom: 6,
                          position: "relative",
                          flexShrink: 0,
                          background: "#000",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={card.img || DEFAULT_SVC_IMGS[i]}
                          alt={`Card ${i + 1} preview`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                      <CloudinaryLogoUpload
                        value={card.img}
                        onChange={(url) =>
                          setSvcCards((prev) =>
                            prev.map((c, j) =>
                              j === i ? { ...c, img: url } : c,
                            ),
                          )
                        }
                        folder="tc-services"
                      />
                      <div style={{ ...HR }} />
                      <div
                        style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}
                      >
                        Title
                      </div>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) =>
                          setSvcCards((prev) =>
                            prev.map((c, j) =>
                              j === i ? { ...c, title: e.target.value } : c,
                            ),
                          )
                        }
                        placeholder={defaultTitles[i]}
                        style={INPUT}
                      />
                      <div style={{ ...HR }} />
                      <div
                        style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}
                      >
                        Description
                      </div>
                      <textarea
                        value={card.desc}
                        onChange={(e) =>
                          setSvcCards((prev) =>
                            prev.map((c, j) =>
                              j === i ? { ...c, desc: e.target.value } : c,
                            ),
                          )
                        }
                        rows={3}
                        placeholder={defaultDescs[i]}
                        style={TEXTAREA}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          marginTop: "auto",
                          paddingTop: 8,
                        }}
                      >
                        <button
                          onClick={() =>
                            void persistServices(buildServicesSource(), cardKey)
                          }
                          disabled={svcTranslating}
                          style={BTN}
                        >
                          {svcSectionSaved[cardKey] ? "Saved ✓" : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setSvcCards((prev) =>
                              prev.map((c, j) =>
                                j === i
                                  ? {
                                      title: "",
                                      desc: "",
                                      img: DEFAULT_SVC_IMGS[i],
                                    }
                                  : c,
                              ),
                            );
                            const updated = buildServicesSource();
                            void persistServices(
                              {
                                ...updated,
                                [`item${i}Title`]: "",
                                [`item${i}Desc`]: "",
                                [`img${i}`]: DEFAULT_SVC_IMGS[i],
                              },
                              cardKey,
                            );
                          }}
                          disabled={svcTranslating}
                          style={BTN_RED}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ══ Bottom bar — Save All / Restore All ══ */}
              <div
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all cards &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAllServices()}
                    disabled={svcSavingAll || svcTranslating}
                    style={BTN_LG}
                  >
                    {svcAllSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAllServices()}
                    disabled={svcSavingAll || svcTranslating}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {subTab === "services" && !win98 && (
        <div className="space-y-4">
          {svcTranslateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {svcTranslateError}
            </p>
          )}
          {svcTranslationPending && (
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-3 text-xs text-amber-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              Translating to all 18 languages in the background… This tab will
              auto-refresh when done.
            </div>
          )}
          {/* Section Heading */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Small label</p>
                <input
                  type="text"
                  value={svcLabel}
                  onChange={(e) => setSvcLabel(e.target.value)}
                  placeholder="OUR SERVICES"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Main title</p>
                <input
                  type="text"
                  value={svcTitle}
                  onChange={(e) => setSvcTitle(e.target.value)}
                  placeholder="What We Offer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>
          {/* Service Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {svcCards.map((card, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3"
              >
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Service {i + 1}
                </p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) =>
                      setSvcCards((prev) =>
                        prev.map((c, j) =>
                          j === i ? { ...c, title: e.target.value } : c,
                        ),
                      )
                    }
                    placeholder="Title"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                  <textarea
                    value={card.desc}
                    rows={3}
                    onChange={(e) =>
                      setSvcCards((prev) =>
                        prev.map((c, j) =>
                          j === i ? { ...c, desc: e.target.value } : c,
                        ),
                      )
                    }
                    placeholder="Description"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
                  />
                </div>
                {card.img && (
                  <img
                    src={card.img}
                    alt=""
                    className="w-full h-24 object-cover rounded-lg"
                  />
                )}
                <CloudinaryLogoUpload
                  value={card.img}
                  onChange={(url: string) =>
                    setSvcCards((prev) =>
                      prev.map((c, j) => (j === i ? { ...c, img: url } : c)),
                    )
                  }
                />
              </div>
            ))}
          </div>
          {/* Global Actions */}
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Save all changes &amp; translate to 18 languages
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => void saveAllServices()}
                disabled={svcSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {svcSavingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : svcAllSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {svcAllSaved ? "All Saved \u2713" : "Save All"}
              </button>
              <button
                onClick={() => void resetAllServices()}
                disabled={svcSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-60 transition-colors"
              >
                Restore All Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          About Section panel
      ══════════════════════════════════════════════════════════════════════ */}
      {subTab === "about" &&
        win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          const INPUT: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "2px 4px",
            width: "100%",
            boxSizing: "border-box" as const,
          };
          const TEXTAREA: React.CSSProperties = {
            ...INPUT,
            resize: "vertical" as const,
            display: "block",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "pointer",
            minWidth: 68,
          };
          const BTN_RED: React.CSSProperties = { ...BTN, color: "#cc0000" };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };

          const imgItems = [
            {
              key: "aboutImgLeft" as AboutSectionKey,
              label: "Left Portrait",
              hint: "Tall portrait — left column",
              state: aboutImgLeft,
              setter: setAboutImgLeft,
              defaultSrc: "/teamCargo-trans-webP/TeamCargoGeletEdited.webp",
            },
            {
              key: "aboutImgTopRight" as AboutSectionKey,
              label: "Top-Right Image",
              hint: "Upper image in right column",
              state: aboutImgTopRight,
              setter: setAboutImgTopRight,
              defaultSrc: "/images/amazon_courier_webP.webp",
            },
            {
              key: "aboutImgBottomRight" as AboutSectionKey,
              label: "Bottom-Right Image",
              hint: "Lower image in right column",
              state: aboutImgBottomRight,
              setter: setAboutImgBottomRight,
              defaultSrc: "/images/cargoTeam_webP.webp",
            },
          ];

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
              }}
            >
              <style>{`
                @media (max-width: 800px) { .w98a-grid { grid-template-columns: 1fr 1fr !important; } }
                @media (max-width: 480px) { .w98a-grid { grid-template-columns: 1fr !important; } }
              `}</style>

              {/* status banners */}
              {aboutTranslateError && (
                <div
                  style={{
                    background: "#fff0f0",
                    border: "2px solid #cc0000",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#cc0000",
                    fontFamily: F,
                  }}
                >
                  {aboutTranslateError}
                </div>
              )}
              {aboutTranslationPending && (
                <div
                  style={{
                    background: "#ffffd0",
                    border: "1px solid #808080",
                    padding: "4px 8px",
                    marginBottom: 8,
                    fontSize: 11,
                    color: "#555",
                    fontFamily: F,
                  }}
                >
                  Translating to all 18 languages… please wait.
                </div>
              )}

              {/* ══ Section Heading — full-width row ══ */}
              <div
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 10,
                }}
              >
                <span style={GRP_LBL}>Section Heading</span>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Small label
                  </div>
                  <input
                    type="text"
                    value={aboutLabel}
                    onChange={(e) => setAboutLabel(e.target.value)}
                    placeholder="About us"
                    style={INPUT}
                  />
                </div>
                <div style={{ flex: 2, minWidth: 200 }}>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Main title
                  </div>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    placeholder="About Team Cargo"
                    style={INPUT}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() =>
                      void persistAbout(buildAboutSource(), "aboutHeading")
                    }
                    disabled={aboutTranslating}
                    style={BTN}
                  >
                    {aboutSectionSaved.aboutHeading ? "Saved ✓" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setAboutLabel("");
                      setAboutTitle("");
                      void persistAbout(
                        { ...buildAboutSource(), label: "", title: "" },
                        "aboutHeading",
                      );
                    }}
                    disabled={aboutTranslating}
                    style={BTN_RED}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* ══ 3-column grid ══ */}
              <div
                className="w98a-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  marginBottom: 12,
                  alignItems: "start",
                }}
              >
                {/* Descriptions */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Descriptions</span>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    First paragraph
                  </div>
                  <textarea
                    value={aboutDesc}
                    onChange={(e) => setAboutDesc(e.target.value)}
                    rows={3}
                    placeholder="Team Cargo is a driver recruitment agency based in Amsterdam…"
                    style={TEXTAREA}
                  />
                  <div style={{ ...HR }} />
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Second paragraph
                  </div>
                  <textarea
                    value={aboutDesc2}
                    onChange={(e) => setAboutDesc2(e.target.value)}
                    rows={3}
                    placeholder="We work with trusted partners such as GLS, FedEx, Amazon, and DPD…"
                    style={TEXTAREA}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: "auto",
                      paddingTop: 8,
                    }}
                  >
                    <button
                      onClick={() =>
                        void persistAbout(
                          buildAboutSource(),
                          "aboutDescriptions",
                        )
                      }
                      disabled={aboutTranslating}
                      style={BTN}
                    >
                      {aboutSectionSaved.aboutDescriptions ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setAboutDesc("");
                        setAboutDesc2("");
                        void persistAbout(
                          {
                            ...buildAboutSource(),
                            description: "",
                            description2: "",
                          },
                          "aboutDescriptions",
                        );
                      }}
                      disabled={aboutTranslating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Our Values */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Our Values</span>
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Values title
                  </div>
                  <input
                    type="text"
                    value={aboutValuesTitle}
                    onChange={(e) => setAboutValuesTitle(e.target.value)}
                    placeholder="Our values"
                    style={INPUT}
                  />
                  <div style={{ ...HR }} />
                  {(
                    [
                      "Reliability",
                      "Efficiency",
                      "Customer focus",
                      "Safety",
                    ] as const
                  ).map((ph, i) => (
                    <div key={i} style={{ marginBottom: i < 3 ? 5 : 0 }}>
                      <input
                        type="text"
                        value={aboutValues[i]}
                        onChange={(e) =>
                          setAboutValues((prev) =>
                            prev.map((v, j) => (j === i ? e.target.value : v)),
                          )
                        }
                        placeholder={ph}
                        style={INPUT}
                      />
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: "auto",
                      paddingTop: 8,
                    }}
                  >
                    <button
                      onClick={() =>
                        void persistAbout(buildAboutSource(), "aboutValues")
                      }
                      disabled={aboutTranslating}
                      style={BTN}
                    >
                      {aboutSectionSaved.aboutValues ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setAboutValuesTitle("");
                        setAboutValues(["", "", "", ""]);
                        void persistAbout(
                          {
                            ...buildAboutSource(),
                            valuesTitle: "",
                            value0: "",
                            value1: "",
                            value2: "",
                            value3: "",
                          },
                          "aboutValues",
                        );
                      }}
                      disabled={aboutTranslating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Stat Badges */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Stat Badges</span>
                  {aboutIconPicker && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAboutIconPicker(null)}
                    />
                  )}
                  {/* Drivers badge */}
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Drivers placed
                  </div>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setAboutIconPicker(
                            aboutIconPicker === "drivers" ? null : "drivers",
                          );
                          setAboutDriversIconPage(0);
                        }}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-700 border border-slate-600 hover:border-amber-400 transition-colors"
                        title="Pick icon"
                      >
                        {(() => {
                          const opt = BADGE_ICON_OPTS.drivers
                            .flat()
                            .find((o) => o.id === aboutDriversIcon);
                          const Ic = opt?.Icon ?? Users;
                          return <Ic className="w-4 h-4 text-amber-400" />;
                        })()}
                      </button>
                      {aboutIconPicker === "drivers" && (
                        <div className="absolute bottom-full left-0 mb-2 z-50 w-56 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">
                              Choose icon
                            </p>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={aboutDriversIconPage === 0}
                                onClick={() =>
                                  setAboutDriversIconPage((p) => p - 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                              >
                                ‹
                              </button>
                              <span className="text-[9px] text-slate-500 w-8 text-center">
                                {aboutDriversIconPage + 1} /{" "}
                                {BADGE_ICON_OPTS.drivers.length}
                              </span>
                              <button
                                type="button"
                                disabled={
                                  aboutDriversIconPage ===
                                  BADGE_ICON_OPTS.drivers.length - 1
                                }
                                onClick={() =>
                                  setAboutDriversIconPage((p) => p + 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                              >
                                ›
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {BADGE_ICON_OPTS.drivers[aboutDriversIconPage].map(
                              ({ id, Icon: Ic, label }) => (
                                <button
                                  key={id}
                                  type="button"
                                  title={label}
                                  onClick={() => {
                                    setAboutDriversIcon(id);
                                    setAboutIconPicker(null);
                                  }}
                                  className={
                                    "w-9 h-9 flex items-center justify-center rounded-lg transition-colors " +
                                    (aboutDriversIcon === id
                                      ? "bg-amber-400/20 border border-amber-400/50 text-amber-300"
                                      : "text-slate-400 hover:bg-slate-700 hover:text-white")
                                  }
                                >
                                  <Ic className="w-4 h-4" />
                                </button>
                              ),
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAboutDriversIcon("");
                              setAboutIconPicker(null);
                            }}
                            className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg py-1 text-[10px] text-slate-500 hover:bg-slate-700 hover:text-white transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" /> Reset
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={aboutDriversPlaced}
                      onChange={(e) => setAboutDriversPlaced(e.target.value)}
                      placeholder="500+ Drivers placed"
                      style={{ ...INPUT, width: "auto", flex: 1 }}
                    />
                  </div>
                  <div style={{ ...HR }} />
                  {/* Location badge */}
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Location
                  </div>
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setAboutIconPicker(
                            aboutIconPicker === "location" ? null : "location",
                          );
                          setAboutLocationIconPage(0);
                        }}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-700 border border-slate-600 hover:border-amber-400 transition-colors"
                        title="Pick icon"
                      >
                        {(() => {
                          const opt = BADGE_ICON_OPTS.location
                            .flat()
                            .find((o) => o.id === aboutLocationIcon);
                          const Ic = opt?.Icon ?? MapPin;
                          return <Ic className="w-4 h-4 text-amber-400" />;
                        })()}
                      </button>
                      {aboutIconPicker === "location" && (
                        <div className="absolute bottom-full left-0 mb-2 z-50 w-56 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">
                              Choose icon
                            </p>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={aboutLocationIconPage === 0}
                                onClick={() =>
                                  setAboutLocationIconPage((p) => p - 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                              >
                                ‹
                              </button>
                              <span className="text-[9px] text-slate-500 w-8 text-center">
                                {aboutLocationIconPage + 1} /{" "}
                                {BADGE_ICON_OPTS.location.length}
                              </span>
                              <button
                                type="button"
                                disabled={
                                  aboutLocationIconPage ===
                                  BADGE_ICON_OPTS.location.length - 1
                                }
                                onClick={() =>
                                  setAboutLocationIconPage((p) => p + 1)
                                }
                                className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-white disabled:opacity-30 hover:bg-slate-700 transition-colors text-xs"
                              >
                                ›
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {BADGE_ICON_OPTS.location[
                              aboutLocationIconPage
                            ].map(({ id, Icon: Ic, label }) => (
                              <button
                                key={id}
                                type="button"
                                title={label}
                                onClick={() => {
                                  setAboutLocationIcon(id);
                                  setAboutIconPicker(null);
                                }}
                                className={
                                  "w-9 h-9 flex items-center justify-center rounded-lg transition-colors " +
                                  (aboutLocationIcon === id
                                    ? "bg-amber-400/20 border border-amber-400/50 text-amber-300"
                                    : "text-slate-400 hover:bg-slate-700 hover:text-white")
                                }
                              >
                                <Ic className="w-4 h-4" />
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setAboutLocationIcon("");
                              setAboutIconPicker(null);
                            }}
                            className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg py-1 text-[10px] text-slate-500 hover:bg-slate-700 hover:text-white transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" /> Reset
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={aboutLocation}
                      onChange={(e) => setAboutLocation(e.target.value)}
                      placeholder="Amsterdam, Netherlands"
                      style={{ ...INPUT, width: "auto", flex: 1 }}
                    />
                  </div>
                  <div style={{ ...HR }} />
                  {/* Years badge */}
                  <div style={{ marginBottom: 3, fontFamily: F, fontSize: 11 }}>
                    Years active badge
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      type="text"
                      value={aboutYearsActiveNum}
                      onChange={(e) => setAboutYearsActiveNum(e.target.value)}
                      placeholder="7+"
                      style={{ ...INPUT, width: 50 }}
                    />
                    <input
                      type="text"
                      value={aboutYearsActive}
                      onChange={(e) => setAboutYearsActive(e.target.value)}
                      placeholder="Years active"
                      style={{ ...INPUT, flex: 1, width: "auto" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: "auto",
                      paddingTop: 8,
                    }}
                  >
                    <button
                      onClick={() =>
                        void persistAbout(buildAboutSource(), "aboutBadges")
                      }
                      disabled={aboutTranslating}
                      style={BTN}
                    >
                      {aboutSectionSaved.aboutBadges ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setAboutDriversPlaced("");
                        setAboutYearsActive("");
                        setAboutLocation("");
                        setAboutYearsActiveNum("");
                        setAboutDriversIcon("");
                        setAboutLocationIcon("");
                        void persistAbout(
                          {
                            ...buildAboutSource(),
                            driversPlaced: "",
                            yearsActive: "",
                            location: "",
                            yearsActiveNum: "",
                            driversIcon: "",
                            locationIcon: "",
                          },
                          "aboutBadges",
                        );
                      }}
                      disabled={aboutTranslating}
                      style={BTN_RED}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* 3 Images */}
                {imgItems.map(
                  ({ key, label, hint, state, setter, defaultSrc }) => (
                    <div
                      key={key}
                      style={{
                        ...GRP,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span style={GRP_LBL}>{label}</span>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#555",
                          marginBottom: 5,
                          fontFamily: F,
                        }}
                      >
                        {hint}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: 140,
                          overflow: "hidden",
                          border: "2px solid",
                          borderColor: "#808080 #fff #fff #808080",
                          marginBottom: 6,
                          position: "relative",
                          flexShrink: 0,
                          background: "#000",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={state || defaultSrc}
                          alt={label}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                      <CloudinaryLogoUpload
                        value={state}
                        onChange={setter}
                        folder="tc-about"
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          marginTop: "auto",
                          paddingTop: 8,
                        }}
                      >
                        <button
                          onClick={() =>
                            void persistAbout(buildAboutSource(), key)
                          }
                          disabled={aboutTranslating}
                          style={BTN}
                        >
                          {aboutSectionSaved[key] ? "Saved ✓" : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setter("");
                            const imgKey = key
                              .replace(/^about/, "")
                              .replace(/^I/, "i");
                            void persistAbout(
                              { ...buildAboutSource(), [imgKey]: "" },
                              key,
                            );
                          }}
                          disabled={aboutTranslating}
                          style={BTN_RED}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* ══ Global Actions ══ */}
              <div
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all fields &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAllAbout()}
                    disabled={aboutSavingAll || aboutTranslating}
                    style={BTN_LG}
                  >
                    {aboutAllSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAllAbout()}
                    disabled={aboutSavingAll || aboutTranslating}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {subTab === "about" && !win98 && (
        <div className="space-y-4">
          {aboutTranslateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {aboutTranslateError}
            </p>
          )}
          {aboutTranslationPending && (
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-3 text-xs text-amber-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              Translating to all 18 languages in the background… This tab will
              auto-refresh when done.
            </div>
          )}
          {/* Section Heading */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Small label</p>
                <input
                  type="text"
                  value={aboutLabel}
                  onChange={(e) => setAboutLabel(e.target.value)}
                  placeholder="ABOUT US"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Main title</p>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  placeholder="Who We Are"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>
          {/* Descriptions */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Content
            </p>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-500">Description 1</p>
              <textarea
                value={aboutDesc}
                onChange={(e) => setAboutDesc(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-500">Description 2</p>
              <textarea
                value={aboutDesc2}
                onChange={(e) => setAboutDesc2(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
              />
            </div>
          </div>
          {/* Values */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Values
            </p>
            <div className="space-y-1.5">
              <p className="text-xs text-slate-500">Values title</p>
              <input
                type="text"
                value={aboutValuesTitle}
                onChange={(e) => setAboutValuesTitle(e.target.value)}
                placeholder="Our Values"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {aboutValues.map((v, i) => (
                <input
                  key={i}
                  type="text"
                  value={v}
                  onChange={(e) =>
                    setAboutValues((prev) =>
                      prev.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  placeholder={`Value ${i + 1}`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              ))}
            </div>
          </div>
          {/* Stats */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Stat Badges
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Drivers placed</p>
                <input
                  type="text"
                  value={aboutDriversPlaced}
                  onChange={(e) => setAboutDriversPlaced(e.target.value)}
                  placeholder="500+"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Years active (label)</p>
                <input
                  type="text"
                  value={aboutYearsActive}
                  onChange={(e) => setAboutYearsActive(e.target.value)}
                  placeholder="Years Active"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Years active (number)</p>
                <input
                  type="text"
                  value={aboutYearsActiveNum}
                  onChange={(e) => setAboutYearsActiveNum(e.target.value)}
                  placeholder="5+"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Location</p>
                <input
                  type="text"
                  value={aboutLocation}
                  onChange={(e) => setAboutLocation(e.target.value)}
                  placeholder="Amsterdam, NL"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>
          {/* Images */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Left Image
              </p>
              {aboutImgLeft && (
                <img
                  src={aboutImgLeft}
                  alt=""
                  className="w-full h-28 object-cover rounded-lg"
                />
              )}
              <CloudinaryLogoUpload
                value={aboutImgLeft}
                onChange={setAboutImgLeft}
              />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Top Right Image
              </p>
              {aboutImgTopRight && (
                <img
                  src={aboutImgTopRight}
                  alt=""
                  className="w-full h-28 object-cover rounded-lg"
                />
              )}
              <CloudinaryLogoUpload
                value={aboutImgTopRight}
                onChange={setAboutImgTopRight}
              />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Bottom Right Image
              </p>
              {aboutImgBottomRight && (
                <img
                  src={aboutImgBottomRight}
                  alt=""
                  className="w-full h-28 object-cover rounded-lg"
                />
              )}
              <CloudinaryLogoUpload
                value={aboutImgBottomRight}
                onChange={setAboutImgBottomRight}
              />
            </div>
          </div>
          {/* Global Actions */}
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Save all changes &amp; translate to 18 languages
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => void saveAllAbout()}
                disabled={aboutSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {aboutSavingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : aboutAllSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {aboutAllSaved ? "All Saved \u2713" : "Save All"}
              </button>
              <button
                onClick={() => void resetAllAbout()}
                disabled={aboutSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-60 transition-colors"
              >
                Restore All Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Housing panel ── */}
      {subTab === "housing" &&
        win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          const INPUT: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "2px 4px",
            width: "100%",
            boxSizing: "border-box",
          };
          const TEXTAREA: React.CSSProperties = {
            ...INPUT,
            resize: "vertical",
            display: "block",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "pointer",
            minWidth: 68,
          };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          void HR;
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <style>{`
              .w98h-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
              @media (max-width: 800px) { .w98h-grid { grid-template-columns: 1fr 1fr; } }
              @media (max-width: 480px) { .w98h-grid { grid-template-columns: 1fr; } }
            `}</style>

              {housingTranslateError && (
                <div
                  style={{
                    background: "#ffcccc",
                    border: "1px solid #cc0000",
                    padding: "4px 8px",
                    fontFamily: F,
                    fontSize: 11,
                    color: "#cc0000",
                  }}
                >
                  {housingTranslateError}
                </div>
              )}
              {housingTranslationPending && (
                <div
                  style={{
                    background: "#fffacc",
                    border: "1px solid #808000",
                    padding: "4px 8px",
                    fontFamily: F,
                    fontSize: 11,
                    color: "#555500",
                  }}
                >
                  Translating to all 18 languages in the background… This tab
                  will auto-refresh when done.
                </div>
              )}

              {/* Section Heading + CTA — same row, two separate boxes */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <div style={GRP}>
                  <span style={GRP_LBL}>Section Heading</span>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: "0 0 160px" }}>
                      <div
                        style={{
                          fontFamily: F,
                          fontSize: 11,
                          color: "#000",
                          marginBottom: 2,
                        }}
                      >
                        Small label
                      </div>
                      <input
                        style={INPUT}
                        value={housingLabel}
                        onChange={(e) => setHousingLabel(e.target.value)}
                        placeholder="Voor chauffeurs die verhuizen"
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div
                        style={{
                          fontFamily: F,
                          fontSize: 11,
                          color: "#000",
                          marginBottom: 2,
                        }}
                      >
                        Main title
                      </div>
                      <input
                        style={INPUT}
                        value={housingTitle}
                        onChange={(e) => setHousingTitle(e.target.value)}
                        placeholder="Tijdelijke woonruimte voor chauffeurs"
                      />
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        style={BTN}
                        onClick={() =>
                          void persistHousing(
                            buildHousingSource(),
                            "housingHeading",
                          )
                        }
                        disabled={housingTranslating}
                      >
                        Save
                      </button>
                      <button
                        style={BTN}
                        onClick={() => {
                          setHousingLabel("");
                          setHousingTitle("");
                          void persistHousing(
                            { ...buildHousingSource(), label: "", title: "" },
                            "housingHeading",
                          );
                        }}
                        disabled={housingTranslating}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ ...GRP, minWidth: 160 }}>
                  <span style={GRP_LBL}>CTA Button Text</span>
                  <div
                    style={{ display: "flex", gap: 4, alignItems: "flex-end" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: F,
                          fontSize: 11,
                          color: "#000",
                          marginBottom: 2,
                        }}
                      >
                        Button label
                      </div>
                      <input
                        style={INPUT}
                        value={housingCta}
                        onChange={(e) => setHousingCta(e.target.value)}
                        placeholder="Neem contact op"
                      />
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        style={BTN}
                        onClick={() =>
                          void persistHousing(
                            buildHousingSource(),
                            "housingCta",
                          )
                        }
                        disabled={housingTranslating}
                      >
                        Save
                      </button>
                      <button
                        style={BTN}
                        onClick={() => {
                          setHousingCta("");
                          void persistHousing(
                            { ...buildHousingSource(), cta: "" },
                            "housingCta",
                          );
                        }}
                        disabled={housingTranslating}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-col row: Description | BG Color | Perks */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  alignItems: "stretch",
                }}
              >
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Description</span>
                  <textarea
                    style={{ ...TEXTAREA, flex: 1 }}
                    rows={4}
                    value={housingDesc}
                    onChange={(e) => setHousingDesc(e.target.value)}
                    placeholder="Wij helpen chauffeurs die vanuit het buitenland komen…"
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: "auto",
                      paddingTop: 6,
                    }}
                  >
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(
                          buildHousingSource(),
                          "housingDescription",
                        )
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingDesc("");
                        void persistHousing(
                          { ...buildHousingSource(), description: "" },
                          "housingDescription",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Section Background Color</span>
                  <div
                    style={{
                      fontFamily: F,
                      fontSize: 10,
                      color: "#444",
                      marginBottom: 4,
                    }}
                  >
                    Default: #0d2e18
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <input
                      type="color"
                      value={housingBg || "#0d2e18"}
                      onChange={(e) => setHousingBg(e.target.value)}
                      style={{
                        width: 32,
                        height: 24,
                        border: "2px solid #808080",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                    <input
                      style={{ ...INPUT, width: 80, fontFamily: "monospace" }}
                      value={housingBg}
                      onChange={(e) => setHousingBg(e.target.value)}
                      placeholder="#0d2e18"
                      maxLength={7}
                    />
                  </div>
                  <div
                    style={{
                      height: 16,
                      border: "2px inset #808080",
                      marginBottom: 6,
                      background: housingBg || "#0d2e18",
                    }}
                  />
                  <div style={{ display: "flex", gap: 4, marginTop: "auto" }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(buildHousingSource(), "housingBg")
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingBg("");
                        void persistHousing(
                          { ...buildHousingSource(), bg: "" },
                          "housingBg",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Perks (4 items)</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      flex: 1,
                    }}
                  >
                    {housingPerks.map((perkText, i) => {
                      const isPickerOpen = housingIconPicker === i;
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <div style={{ position: "relative", flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => {
                                setHousingIconPicker(isPickerOpen ? null : i);
                                setHousingIconPages((prev) => {
                                  const next = [...prev];
                                  next[i] = 0;
                                  return next;
                                });
                              }}
                              style={{
                                ...BTN,
                                minWidth: 0,
                                padding: "2px 8px",
                              }}
                              title="Pick icon"
                            >
                              <span style={{ fontSize: 10 }}>Ico</span>
                            </button>
                            {isPickerOpen && (
                              <div
                                data-iconpicker
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: 0,
                                  marginTop: 2,
                                  zIndex: 50,
                                  width: 176,
                                  background: "#c0c0c0",
                                  border: "2px solid",
                                  borderColor: "#fff #808080 #808080 #fff",
                                  padding: 6,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 4,
                                  }}
                                >
                                  <span style={{ fontSize: 10, color: "#555" }}>
                                    Choose icon
                                  </span>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: 2,
                                      alignItems: "center",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      disabled={housingIconPages[i] === 0}
                                      onClick={() =>
                                        setHousingIconPages((prev) => {
                                          const next = [...prev];
                                          next[i] = Math.max(0, next[i] - 1);
                                          return next;
                                        })
                                      }
                                      style={{
                                        ...BTN,
                                        minWidth: 0,
                                        padding: "0 5px",
                                      }}
                                    >
                                      ‹
                                    </button>
                                    <span
                                      style={{
                                        fontSize: 10,
                                        color: "#555",
                                        width: 30,
                                        textAlign: "center" as const,
                                      }}
                                    >
                                      {housingIconPages[i] + 1}/
                                      {HOUSING_ICON_OPTS.length}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={
                                        housingIconPages[i] >=
                                        HOUSING_ICON_OPTS.length - 1
                                      }
                                      onClick={() =>
                                        setHousingIconPages((prev) => {
                                          const next = [...prev];
                                          next[i] = Math.min(
                                            HOUSING_ICON_OPTS.length - 1,
                                            next[i] + 1,
                                          );
                                          return next;
                                        })
                                      }
                                      style={{
                                        ...BTN,
                                        minWidth: 0,
                                        padding: "0 5px",
                                      }}
                                    >
                                      ›
                                    </button>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                    gap: 2,
                                  }}
                                >
                                  {HOUSING_ICON_OPTS[housingIconPages[i]].map(
                                    ({ id, Icon: Ic, label }) => (
                                      <button
                                        key={id}
                                        type="button"
                                        title={label}
                                        onClick={() => {
                                          setHousingPerkIcons((prev) => {
                                            const next = [...prev];
                                            next[i] = id;
                                            return next;
                                          });
                                          setHousingIconPicker(null);
                                        }}
                                        style={{
                                          ...BTN,
                                          minWidth: 0,
                                          padding: "3px",
                                          background:
                                            housingPerkIcons[i] === id
                                              ? "#d0d0d0"
                                              : "#c0c0c0",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <Ic
                                          style={{
                                            width: 12,
                                            height: 12,
                                            display: "block",
                                          }}
                                        />
                                      </button>
                                    ),
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHousingPerkIcons((prev) => {
                                      const next = [...prev];
                                      next[i] = "";
                                      return next;
                                    });
                                    setHousingIconPicker(null);
                                  }}
                                  style={{
                                    ...BTN,
                                    width: "100%",
                                    marginTop: 4,
                                    fontSize: 10,
                                  }}
                                >
                                  Reset icon
                                </button>
                              </div>
                            )}
                          </div>
                          <input
                            style={{ ...INPUT, flex: 1 }}
                            type="text"
                            value={perkText}
                            onChange={(e) =>
                              setHousingPerks((prev) => {
                                const next = [...prev];
                                next[i] = e.target.value;
                                return next;
                              })
                            }
                            placeholder={`Perk ${i + 1} text`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: "auto",
                      paddingTop: 8,
                    }}
                  >
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(
                          buildHousingSource(),
                          "housingPerks",
                        )
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingPerks(["", "", "", ""]);
                        setHousingPerkIcons(["", "", "", ""]);
                        void persistHousing(
                          {
                            ...buildHousingSource(),
                            perk0: "",
                            perk1: "",
                            perk2: "",
                            perk3: "",
                            perk0Icon: "",
                            perk1Icon: "",
                            perk2Icon: "",
                            perk3Icon: "",
                          },
                          "housingPerks",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Photos — 1fr 1fr */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div style={GRP}>
                  <span style={GRP_LBL}>Photo 1 (left column)</span>
                  <img
                    src={housingImg1 || "/images/living_1_webP.webp"}
                    alt=""
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "contain",
                      background: "#000",
                      display: "block",
                      marginBottom: 6,
                    }}
                  />
                  <CloudinaryLogoUpload
                    value={housingImg1 || "/images/living_1_webP.webp"}
                    onChange={(url) => setHousingImg1(url)}
                  />
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(buildHousingSource(), "housingImg1")
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingImg1("");
                        void persistHousing(
                          { ...buildHousingSource(), img1: "" },
                          "housingImg1",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div style={GRP}>
                  <span style={GRP_LBL}>Photo 2 (right column)</span>
                  <img
                    src={housingImg2 || "/images/living_2_webP.webp"}
                    alt=""
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "contain",
                      background: "#000",
                      display: "block",
                      marginBottom: 6,
                    }}
                  />
                  <CloudinaryLogoUpload
                    value={housingImg2 || "/images/living_2_webP.webp"}
                    onChange={(url) => setHousingImg2(url)}
                  />
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistHousing(buildHousingSource(), "housingImg2")
                      }
                      disabled={housingTranslating}
                    >
                      Save
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setHousingImg2("");
                        void persistHousing(
                          { ...buildHousingSource(), img2: "" },
                          "housingImg2",
                        );
                      }}
                      disabled={housingTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Global Actions */}
              <div
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all Housing fields &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAllHousing()}
                    style={BTN_LG}
                    disabled={housingSavingAll || housingTranslating}
                  >
                    {housingAllSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAllHousing()}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                    disabled={housingSavingAll || housingTranslating}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {subTab === "housing" && !win98 && (
        <div className="space-y-4">
          {housingTranslateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {housingTranslateError}
            </p>
          )}
          {housingTranslationPending && (
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-3 text-xs text-amber-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              Translating to all 18 languages in the background… This tab will
              auto-refresh when done.
            </div>
          )}
          {/* Section Heading */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Small label</p>
                <input
                  type="text"
                  value={housingLabel}
                  onChange={(e) => setHousingLabel(e.target.value)}
                  placeholder="HOUSING"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Main title</p>
                <input
                  type="text"
                  value={housingTitle}
                  onChange={(e) => setHousingTitle(e.target.value)}
                  placeholder="Your New Home"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>
          {/* CTA + BG Color */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                CTA Button
              </p>
              <input
                type="text"
                value={housingCta}
                onChange={(e) => setHousingCta(e.target.value)}
                placeholder="Get Started"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Background Color
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={housingBg || "#1e293b"}
                  onChange={(e) => setHousingBg(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={housingBg}
                  onChange={(e) => setHousingBg(e.target.value)}
                  placeholder="#1e293b"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
                <div
                  className="w-8 h-8 rounded border border-slate-600 shrink-0"
                  style={{ background: housingBg || "#1e293b" }}
                />
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Description
            </p>
            <textarea
              value={housingDesc}
              onChange={(e) => setHousingDesc(e.target.value)}
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
            />
          </div>
          {/* Perks */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Perks
            </p>
            <div className="space-y-2">
              {housingPerks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-14 shrink-0">
                    Perk {i + 1}
                  </span>
                  <input
                    type="text"
                    value={perk}
                    onChange={(e) =>
                      setHousingPerks((prev) =>
                        prev.map((p, j) => (j === i ? e.target.value : p)),
                      )
                    }
                    placeholder={`Perk ${i + 1}`}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Photos */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Photo 1
              </p>
              {housingImg1 && (
                <img
                  src={housingImg1}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              <CloudinaryLogoUpload
                value={housingImg1}
                onChange={setHousingImg1}
              />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Photo 2
              </p>
              {housingImg2 && (
                <img
                  src={housingImg2}
                  alt=""
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              <CloudinaryLogoUpload
                value={housingImg2}
                onChange={setHousingImg2}
              />
            </div>
          </div>
          {/* Global Actions */}
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Save all changes &amp; translate to 18 languages
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => void saveAllHousing()}
                disabled={housingSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {housingSavingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : housingAllSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {housingAllSaved ? "All Saved \u2713" : "Save All"}
              </button>
              <button
                onClick={() => void resetAllHousing()}
                disabled={housingSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-60 transition-colors"
              >
                Restore All Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contact Section ─────────────────────────────────────────────────── */}
      {subTab === "contact" && !win98 && (
        <div className="space-y-4">
          {contactTranslateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {contactTranslateError}
            </p>
          )}
          {contactTranslationPending && (
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-3 text-xs text-amber-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              Translating to all 18 languages in the background… This tab will
              auto-refresh when done.
            </div>
          )}
          {/* Section Heading */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Title</p>
                <input
                  type="text"
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  placeholder="Contact Us"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Subtitle</p>
                <input
                  type="text"
                  value={contactSubtitle}
                  onChange={(e) => setContactSubtitle(e.target.value)}
                  placeholder="Get in touch"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>
          {/* Row Labels */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Row Labels
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Phone label</p>
                <input
                  type="text"
                  value={contactPhoneLabel}
                  onChange={(e) => setContactPhoneLabel(e.target.value)}
                  placeholder="Phone"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Email label</p>
                <input
                  type="text"
                  value={contactEmailLabel}
                  onChange={(e) => setContactEmailLabel(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Address label</p>
                <input
                  type="text"
                  value={contactAddressLabel}
                  onChange={(e) => setContactAddressLabel(e.target.value)}
                  placeholder="Address"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>
          {/* Contact Details */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Contact Details
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Phone / WhatsApp</p>
                <input
                  type="text"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="+31 6 00000000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Email address</p>
                <input
                  type="text"
                  value={contactEmailAddress}
                  onChange={(e) => setContactEmailAddress(e.target.value)}
                  placeholder="info@teamcargo.nl"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Map address</p>
                <input
                  type="text"
                  value={contactMapAddress}
                  onChange={(e) => setContactMapAddress(e.target.value)}
                  placeholder="Amsterdam, Netherlands"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Map pin label</p>
                <input
                  type="text"
                  value={contactMapPin}
                  onChange={(e) => setContactMapPin(e.target.value)}
                  placeholder="Our Location"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>
          {/* Side Image */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Background / Side Image
            </p>
            {contactImg && (
              <img
                src={contactImg}
                alt=""
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
            <CloudinaryLogoUpload value={contactImg} onChange={setContactImg} />
          </div>
          {/* Global Actions */}
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Save all changes &amp; translate to 18 languages
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => void saveAllContact()}
                disabled={contactSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {contactSavingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : contactAllSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {contactAllSaved ? "All Saved \u2713" : "Save All"}
              </button>
              <button
                onClick={() => void resetAllContact()}
                disabled={contactSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-60 transition-colors"
              >
                Restore All Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === "contact" &&
        win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          const INPUT: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "2px 4px",
            width: "100%",
            boxSizing: "border-box",
          };
          const TEXTAREA: React.CSSProperties = {
            ...INPUT,
            resize: "vertical",
            display: "block",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "pointer",
            minWidth: 68,
          };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          const LBL: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            color: "#000",
            display: "block",
            marginBottom: 2,
          };
          const contactRowDefs = [
            {
              key: "phone",
              label: "Phone / WhatsApp label",
              placeholder: "WhatsApp",
              value: contactPhoneLabel,
              setter: setContactPhoneLabel,
            },
            {
              key: "email",
              label: "Email label",
              placeholder: "E-mail",
              value: contactEmailLabel,
              setter: setContactEmailLabel,
            },
            {
              key: "address",
              label: "Address label",
              placeholder: "Address",
              value: contactAddressLabel,
              setter: setContactAddressLabel,
            },
          ] as {
            key: string;
            label: string;
            placeholder: string;
            value: string;
            setter: (v: string) => void;
          }[];
          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <style>{`
              @media (max-width: 600px) {
                .w98c-row1, .w98c-row3 { grid-template-columns: 1fr !important; }
                .w98c-row2-inner { grid-template-columns: 1fr !important; }
                .w98c-global { flex-direction: column !important; align-items: flex-start !important; }
              }
            `}</style>
              {contactTranslateError && (
                <div
                  style={{
                    fontFamily: F,
                    fontSize: 11,
                    color: "#cc0000",
                    border: "2px solid #cc0000",
                    padding: "4px 8px",
                    background: "#fff0f0",
                  }}
                >
                  {contactTranslateError}
                </div>
              )}
              {contactTranslationPending && (
                <div
                  style={{
                    fontFamily: F,
                    fontSize: 11,
                    color: "#555",
                    border: "2px solid #808080",
                    padding: "4px 8px",
                    background: "#fffff0",
                  }}
                >
                  Translating to all 18 languages… This tab will auto-refresh
                  when done.
                </div>
              )}

              {/* Row 1 — Section Heading | Contact Details */}
              <div
                className="w98c-row1"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  alignItems: "stretch",
                }}
              >
                {/* Section Heading */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Section Heading</span>
                  <span style={LBL}>Title</span>
                  <input
                    type="text"
                    value={contactTitle}
                    onChange={(e) => setContactTitle(e.target.value)}
                    placeholder="Contact us"
                    style={{ ...INPUT, marginBottom: 6 }}
                  />
                  <span style={LBL}>Subtitle</span>
                  <textarea
                    value={contactSubtitle}
                    onChange={(e) => setContactSubtitle(e.target.value)}
                    rows={2}
                    placeholder="We're here to help"
                    style={{ ...TEXTAREA, marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistContact(
                          buildContactSource(),
                          "contactHeading",
                        )
                      }
                      disabled={contactTranslating}
                    >
                      {contactSectionSaved.contactHeading ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setContactTitle("");
                        setContactSubtitle("");
                        void persistContact(
                          { ...buildContactSource(), title: "", subtitle: "" },
                          "contactHeading",
                        );
                      }}
                      disabled={contactTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Contact Details */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Contact Details</span>
                  <span style={{ ...LBL, color: "#808080", marginBottom: 6 }}>
                    These values are used directly — not translated.
                  </span>
                  <span style={LBL}>
                    WhatsApp number (digits only, e.g. 31685352412)
                  </span>
                  <input
                    type="text"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="31685352412"
                    style={{ ...INPUT, marginBottom: 6 }}
                  />
                  <span style={LBL}>Email address</span>
                  <input
                    type="text"
                    value={contactEmailAddress}
                    onChange={(e) => setContactEmailAddress(e.target.value)}
                    placeholder="info@teamcargo.nl"
                    style={{ ...INPUT, marginBottom: 6 }}
                  />
                  <span style={LBL}>Address (shown in contact row)</span>
                  <input
                    type="text"
                    value={contactMapAddress}
                    onChange={(e) => setContactMapAddress(e.target.value)}
                    placeholder="Poortland 146, 1046 BD Amsterdam"
                    style={{ ...INPUT, marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistContact(
                          buildContactSource(),
                          "contactDetails",
                        )
                      }
                      disabled={contactTranslating}
                    >
                      {contactSectionSaved.contactDetails ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setContactWhatsapp("");
                        setContactEmailAddress("");
                        setContactMapAddress("");
                        void persistContact(
                          {
                            ...buildContactSource(),
                            whatsapp_number: "",
                            email_address: "",
                            map_address: "",
                          },
                          "contactDetails",
                        );
                      }}
                      disabled={contactTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2 — Row Labels & Icons (3 cols) */}
              <div style={{ ...GRP }}>
                <span style={GRP_LBL}>Row Labels &amp; Icons</span>
                <div
                  className="w98c-row2-inner"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  {contactRowDefs.map(
                    ({ key, label, placeholder, value, setter }, i) => {
                      const isPickerOpen = contactIconPicker === i;
                      return (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <span style={LBL}>{label}</span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <div
                              style={{ position: "relative", flexShrink: 0 }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setContactIconPicker(isPickerOpen ? null : i)
                                }
                                style={{
                                  ...BTN,
                                  minWidth: 0,
                                  padding: "2px 8px",
                                }}
                                title="Pick icon"
                              >
                                <span style={{ fontSize: 10 }}>Ico</span>
                              </button>
                              {isPickerOpen && (
                                <div
                                  data-iconpicker
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    marginTop: 2,
                                    zIndex: 50,
                                    width: 176,
                                    background: "#c0c0c0",
                                    border: "2px solid",
                                    borderColor: "#fff #808080 #808080 #fff",
                                    padding: 6,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: 4,
                                    }}
                                  >
                                    <span
                                      style={{ fontSize: 10, color: "#555" }}
                                    >
                                      Choose icon
                                    </span>
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "center",
                                      }}
                                    >
                                      <button
                                        type="button"
                                        disabled={contactIconPages[i] === 0}
                                        onClick={() =>
                                          setContactIconPages((prev) => {
                                            const next = [...prev];
                                            next[i] = Math.max(0, next[i] - 1);
                                            return next;
                                          })
                                        }
                                        style={{
                                          ...BTN,
                                          minWidth: 0,
                                          padding: "0 5px",
                                        }}
                                      >
                                        ‹
                                      </button>
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: "#555",
                                          width: 30,
                                          textAlign: "center" as const,
                                        }}
                                      >
                                        {contactIconPages[i] + 1}/
                                        {CONTACT_ICON_OPTS.length}
                                      </span>
                                      <button
                                        type="button"
                                        disabled={
                                          contactIconPages[i] >=
                                          CONTACT_ICON_OPTS.length - 1
                                        }
                                        onClick={() =>
                                          setContactIconPages((prev) => {
                                            const next = [...prev];
                                            next[i] = Math.min(
                                              CONTACT_ICON_OPTS.length - 1,
                                              next[i] + 1,
                                            );
                                            return next;
                                          })
                                        }
                                        style={{
                                          ...BTN,
                                          minWidth: 0,
                                          padding: "0 5px",
                                        }}
                                      >
                                        ›
                                      </button>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "repeat(5, 1fr)",
                                      gap: 2,
                                    }}
                                  >
                                    {CONTACT_ICON_OPTS[contactIconPages[i]].map(
                                      ({ id, Icon: Ic, label: optLabel }) => (
                                        <button
                                          key={id}
                                          type="button"
                                          title={optLabel}
                                          onClick={() => {
                                            setContactRowIcons((prev) => {
                                              const next = [...prev];
                                              next[i] = id;
                                              return next;
                                            });
                                            setContactIconPicker(null);
                                          }}
                                          style={{
                                            ...BTN,
                                            minWidth: 0,
                                            padding: "3px",
                                            background:
                                              contactRowIcons[i] === id
                                                ? "#d0d0d0"
                                                : "#c0c0c0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <Ic
                                            style={{
                                              width: 12,
                                              height: 12,
                                              display: "block",
                                            }}
                                          />
                                        </button>
                                      ),
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setContactRowIcons((prev) => {
                                        const next = [...prev];
                                        next[i] = "";
                                        return next;
                                      });
                                      setContactIconPicker(null);
                                    }}
                                    style={{
                                      ...BTN,
                                      width: "100%",
                                      marginTop: 4,
                                      fontSize: 10,
                                    }}
                                  >
                                    Reset icon
                                  </button>
                                </div>
                              )}
                            </div>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => setter(e.target.value)}
                              placeholder={placeholder}
                              style={{ ...INPUT, flex: 1 }}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
                <div style={{ ...HR }} />
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    style={BTN}
                    onClick={() =>
                      void persistContact(buildContactSource(), "contactLabels")
                    }
                    disabled={contactTranslating}
                  >
                    {contactSectionSaved.contactLabels ? "Saved ✓" : "Save"}
                  </button>
                  <button
                    style={BTN}
                    onClick={() => {
                      setContactPhoneLabel("");
                      setContactEmailLabel("");
                      setContactAddressLabel("");
                      setContactRowIcons(["", "", ""]);
                      void persistContact(
                        {
                          ...buildContactSource(),
                          phone: "",
                          email: "",
                          address: "",
                          phoneIcon: "",
                          emailIcon: "",
                          addressIcon: "",
                        },
                        "contactLabels",
                      );
                    }}
                    disabled={contactTranslating}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Row 3 — Map Pin | Background Image */}
              <div
                className="w98c-row3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  alignItems: "stretch",
                }}
              >
                {/* Map Pin */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Map Pin Location</span>
                  <span style={{ ...LBL, color: "#808080", marginBottom: 6 }}>
                    Leave empty to use the address from Contact Details above.
                  </span>
                  <span style={LBL}>
                    Map search query (address or coordinates)
                  </span>
                  <input
                    type="text"
                    value={contactMapPin}
                    onChange={(e) => setContactMapPin(e.target.value)}
                    placeholder="Poortland 146, 1046 BD Amsterdam"
                    style={{ ...INPUT, marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistContact(
                          buildContactSource(),
                          "contactMapPin",
                        )
                      }
                      disabled={contactTranslating}
                    >
                      {contactSectionSaved.contactMapPin ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setContactMapPin("");
                        void persistContact(
                          { ...buildContactSource(), map_pin: "" },
                          "contactMapPin",
                        );
                      }}
                      disabled={contactTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Background / Side Image */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Background / Side Image</span>
                  <CloudinaryLogoUpload
                    value={contactImg || "/images/office_webP.webp"}
                    onChange={(url) => setContactImg(url)}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistContact(buildContactSource(), "contactImg")
                      }
                      disabled={contactTranslating}
                    >
                      {contactSectionSaved.contactImg ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setContactImg("");
                        void persistContact(
                          { ...buildContactSource(), img: "" },
                          "contactImg",
                        );
                      }}
                      disabled={contactTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Global Actions */}
              <div
                className="w98c-global"
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap" as const,
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all contact changes &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAllContact()}
                    disabled={contactSavingAll || contactTranslating}
                    style={BTN_LG}
                  >
                    {contactAllSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAllContact()}
                    disabled={contactSavingAll || contactTranslating}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ── Footer panel ── */}
      {subTab === "footer" &&
        !win98 &&
        (() => {
          const handleFooterSave = () => {
            const source = {
              tagline_sub: footerTaglineSub,
              address_line1: footerAddressLine1,
              address_line2: footerAddressLine2,
              phone: footerPhone,
              email: footerEmail,
            };
            localStorage.setItem("tc_footer_overrides", JSON.stringify(source));
            setFooterSaving(true);
            setFooterSaveError(null);
            void fetchWithAuth("/api/admin/customization/footer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ source }),
            })
              .then(
                (r) => r.json() as Promise<{ ok?: boolean; message?: string }>,
              )
              .then((body) => {
                if (!body.ok) throw new Error(body.message ?? "Save failed");
                window.dispatchEvent(new Event("tc:footer-updated"));
                setFooterSectionSaved(true);
                setTimeout(() => setFooterSectionSaved(false), 2500);
              })
              .catch((err: unknown) =>
                setFooterSaveError(
                  err instanceof Error ? err.message : "Save failed",
                ),
              )
              .finally(() => setFooterSaving(false));
          };
          const handleFooterReset = () => {
            setFooterTaglineSub("");
            setFooterAddressLine1("");
            setFooterAddressLine2("");
            setFooterPhone("");
            setFooterEmail("");
            localStorage.removeItem("tc_footer_overrides");
            void fetchWithAuth("/api/admin/customization/footer", {
              method: "DELETE",
            })
              .then(() => window.dispatchEvent(new Event("tc:footer-updated")))
              .catch((err: unknown) =>
                setFooterSaveError(
                  err instanceof Error ? err.message : "Reset failed",
                ),
              );
          };
          return (
            <div className="space-y-4">
              {footerSaveError && (
                <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
                  {footerSaveError}
                </p>
              )}
              {/* Tagline */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Tagline
                </p>
                <input
                  type="text"
                  value={footerTaglineSub}
                  onChange={(e) => setFooterTaglineSub(e.target.value)}
                  placeholder="Your tagline here"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              {/* Contact Info */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Contact Info
                </p>
                <p className="text-xs text-slate-500">
                  These values are not auto-translated.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500">Address line 1</p>
                    <input
                      type="text"
                      value={footerAddressLine1}
                      onChange={(e) => setFooterAddressLine1(e.target.value)}
                      placeholder="Streetname 1"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500">Phone</p>
                    <input
                      type="text"
                      value={footerPhone}
                      onChange={(e) => setFooterPhone(e.target.value)}
                      placeholder="+31 6 00000000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500">
                      Address line 2 (Country)
                    </p>
                    <input
                      type="text"
                      value={footerAddressLine2}
                      onChange={(e) => setFooterAddressLine2(e.target.value)}
                      placeholder="Netherlands"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-500">Email</p>
                    <input
                      type="text"
                      value={footerEmail}
                      onChange={(e) => setFooterEmail(e.target.value)}
                      placeholder="info@teamcargo.nl"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
              {/* Global Actions */}
              <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-slate-400">Save all changes</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleFooterSave}
                    disabled={footerSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
                  >
                    {footerSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : footerSectionSaved ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {footerSectionSaved ? "Saved \u2713" : "Save All"}
                  </button>
                  <button
                    onClick={handleFooterReset}
                    disabled={footerSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-60 transition-colors"
                  >
                    Restore Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {subTab === "footer" &&
        win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          const INPUT: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "2px 4px",
            boxSizing: "border-box" as const,
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "pointer",
            minWidth: 68,
          };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          const LBL: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            color: "#000",
            display: "block",
            marginBottom: 2,
          };

          const saveFooter = () => {
            const source = {
              tagline_sub: footerTaglineSub,
              address_line1: footerAddressLine1,
              address_line2: footerAddressLine2,
              phone: footerPhone,
              email: footerEmail,
            };
            localStorage.setItem("tc_footer_overrides", JSON.stringify(source));
            setFooterSaving(true);
            setFooterSaveError(null);
            fetchWithAuth("/api/admin/customization/footer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ source }),
            })
              .then(
                (r) => r.json() as Promise<{ ok?: boolean; message?: string }>,
              )
              .then((body) => {
                if (!body.ok) throw new Error(body.message ?? "Save failed");
                window.dispatchEvent(new Event("tc:footer-updated"));
                setFooterSectionSaved(true);
                setTimeout(() => setFooterSectionSaved(false), 2500);
              })
              .catch((err: unknown) =>
                setFooterSaveError(
                  err instanceof Error ? err.message : "Save failed",
                ),
              )
              .finally(() => setFooterSaving(false));
          };

          const resetFooter = () => {
            setFooterTaglineSub("");
            setFooterAddressLine1("");
            setFooterAddressLine2("");
            setFooterPhone("");
            setFooterEmail("");
            localStorage.removeItem("tc_footer_overrides");
            fetchWithAuth("/api/admin/customization/footer", {
              method: "DELETE",
            })
              .then(() => window.dispatchEvent(new Event("tc:footer-updated")))
              .catch((err: unknown) =>
                setFooterSaveError(
                  err instanceof Error ? err.message : "Reset failed",
                ),
              );
          };

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <style>{`
              @media (max-width: 600px) {
                .w98f-cols { grid-template-columns: 1fr !important; }
                .w98f-global { flex-direction: column !important; align-items: flex-start !important; }
              }
            `}</style>
              {footerSaveError && (
                <div
                  style={{
                    background: "#fff0f0",
                    border: "2px solid #cc0000",
                    padding: "4px 8px",
                    fontSize: 11,
                    color: "#cc0000",
                  }}
                >
                  {footerSaveError}
                </div>
              )}

              {/* ── Tagline ── */}
              <div style={GRP}>
                <span style={GRP_LBL}>Tagline</span>
                <span style={LBL}>Description line shown in the footer</span>
                <input
                  type="text"
                  value={footerTaglineSub}
                  onChange={(e) => setFooterTaglineSub(e.target.value)}
                  placeholder="Driver recruitment — Amsterdam"
                  style={{ ...INPUT, width: 320 }}
                />
              </div>

              {/* ── Contact Info ── */}
              <div style={GRP}>
                <span style={GRP_LBL}>Contact Info</span>
                <span
                  style={{
                    fontFamily: F,
                    fontSize: 11,
                    color: "#808080",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Used directly — not translated.
                </span>
                <div
                  className="w98f-cols"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px 24px",
                    alignItems: "end",
                  }}
                >
                  {/* col 1 */}
                  <div>
                    <span style={LBL}>Address line 1</span>
                    <input
                      type="text"
                      value={footerAddressLine1}
                      onChange={(e) => setFooterAddressLine1(e.target.value)}
                      placeholder="Poortland 146, 1046 BD Amsterdam"
                      style={{ ...INPUT, width: "100%" }}
                    />
                  </div>
                  {/* col 2 */}
                  <div>
                    <span style={LBL}>Phone (WhatsApp)</span>
                    <input
                      type="text"
                      value={footerPhone}
                      onChange={(e) => setFooterPhone(e.target.value)}
                      placeholder="+31 6 85352412"
                      style={{ ...INPUT, width: "100%" }}
                    />
                  </div>
                  {/* col 1 */}
                  <div>
                    <span style={LBL}>Country</span>
                    <input
                      type="text"
                      value={footerAddressLine2}
                      onChange={(e) => setFooterAddressLine2(e.target.value)}
                      placeholder="Netherlands"
                      style={{ ...INPUT, width: "100%" }}
                    />
                  </div>
                  {/* col 2 */}
                  <div>
                    <span style={LBL}>Email address</span>
                    <input
                      type="email"
                      value={footerEmail}
                      onChange={(e) => setFooterEmail(e.target.value)}
                      placeholder="info@teamcargo.nl"
                      style={{ ...INPUT, width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Global Actions ── */}
              <div
                className="w98f-global"
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap" as const,
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all footer changes &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={saveFooter}
                    disabled={footerSaving}
                    style={BTN_LG}
                  >
                    {footerSectionSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={resetFooter}
                    disabled={footerSaving}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
