"use client";

import { useEffect, useState } from "react";
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
};

type ColorKey = keyof typeof COLOR_DEFAULTS;
type SubTab = "colors" | "hero" | "services" | "about" | "housing" | "contact";
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
  | "housingImg2";

type ContactSectionKey =
  | "contactHeading"
  | "contactDetails"
  | "contactLabels"
  | "contactMessages"
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
};

export default function AdminCustomizationTab({ dict }: { dict: Dictionary }) {
  const [subTab, setSubTab] = useState<SubTab>("colors");

  // ── Colors ───────────────────────────────────────────────────────────────
  const [colors, setColors] = useState(COLOR_DEFAULTS);
  const [colorSaved, setColorSaved] = useState(false);

  // ── Hero text ─────────────────────────────────────────────────────────────
  const [slogan, setSlogan] = useState("");
  const [badge, setBadge] = useState("");
  const [trustLine, setTrustLine] = useState("");
  const [heroTrustIcon, setHeroTrustIcon] = useState("");
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
  const [stat1Value, setStat1Value] = useState("");
  const [stat1Label, setStat1Label] = useState("");
  const [stat2Value, setStat2Value] = useState("");
  const [stat2Label, setStat2Label] = useState("");
  const [stat3Value, setStat3Value] = useState("");
  const [stat3Label, setStat3Label] = useState("");
  const [stat4Value, setStat4Value] = useState("");
  const [stat4Label, setStat4Label] = useState("");
  const [trustBg, setTrustBg] = useState(COLOR_DEFAULTS.trustBg);
  const [partnersBg, setPartnersBg] = useState("#ffffff");
  const [heroImgDesktop, setHeroImgDesktop] = useState("");
  const [heroImgMobile, setHeroImgMobile] = useState("");

  // ── Partners ──────────────────────────────────────────────────────────────
  const DEFAULT_PARTNERS = [
    { name: "Amazon", logo: "/partners/amazon_logo.svg" },
    { name: "FedEx", logo: "/partners/fedex_logo.svg" },
    { name: "DPD", logo: "/partners/dpd_logo.svg" },
    { name: "GLS", logo: "/partners/gls_logo.svg" },
    { name: "Transmission", logo: "/partners/transmission_logo.svg" },
  ];
  const [partners, setPartners] =
    useState<{ name: string; logo: string }[]>(DEFAULT_PARTNERS);

  // ── Services ─────────────────────────────────────────────────────────────
  const DEFAULT_SVC_CARDS = DEFAULT_SVC_IMGS.map((img) => ({
    title: "",
    desc: "",
    img,
  }));

  const [svcTitle, setSvcTitle] = useState("");
  const [svcLabel, setSvcLabel] = useState("");
  const [svcCards, setSvcCards] =
    useState<{ title: string; desc: string; img: string }[]>(DEFAULT_SVC_CARDS);
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
  const [aboutLabel, setAboutLabel] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDesc, setAboutDesc] = useState("");
  const [aboutDesc2, setAboutDesc2] = useState("");
  const [aboutValuesTitle, setAboutValuesTitle] = useState("");
  const [aboutValues, setAboutValues] = useState(["", "", "", ""]);
  const [aboutDriversPlaced, setAboutDriversPlaced] = useState("");
  const [aboutYearsActive, setAboutYearsActive] = useState("");
  const [aboutLocation, setAboutLocation] = useState("");
  const [aboutYearsActiveNum, setAboutYearsActiveNum] = useState("");
  const [aboutDriversIcon, setAboutDriversIcon] = useState("");
  const [aboutLocationIcon, setAboutLocationIcon] = useState("");
  const [aboutIconPicker, setAboutIconPicker] = useState<
    "drivers" | "location" | null
  >(null);
  const [aboutDriversIconPage, setAboutDriversIconPage] = useState(0);
  const [aboutLocationIconPage, setAboutLocationIconPage] = useState(0);
  const [aboutImgLeft, setAboutImgLeft] = useState("");
  const [aboutImgTopRight, setAboutImgTopRight] = useState("");
  const [aboutImgBottomRight, setAboutImgBottomRight] = useState("");
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
  const [housingLabel, setHousingLabel] = useState("");
  const [housingTitle, setHousingTitle] = useState("");
  const [housingDesc, setHousingDesc] = useState("");
  const [housingPerks, setHousingPerks] = useState(["", "", "", ""]);
  const [housingCta, setHousingCta] = useState("");
  const [housingPerkIcons, setHousingPerkIcons] = useState(["", "", "", ""]);
  const [housingImg1, setHousingImg1] = useState("");
  const [housingImg2, setHousingImg2] = useState("");
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

  // ── Contact state ─────────────────────────────────────────────────────────
  const [contactTitle, setContactTitle] = useState("");
  const [contactSubtitle, setContactSubtitle] = useState("");
  const [contactPhoneLabel, setContactPhoneLabel] = useState("");
  const [contactEmailLabel, setContactEmailLabel] = useState("");
  const [contactAddressLabel, setContactAddressLabel] = useState("");
  const [contactSend, setContactSend] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactSuccessSubtitle, setContactSuccessSubtitle] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [contactEmailAddress, setContactEmailAddress] = useState("");
  const [contactMapAddress, setContactMapAddress] = useState("");
  const [contactImg, setContactImg] = useState("");
  const [contactSectionSaved, setContactSectionSaved] = useState<
    Record<ContactSectionKey, boolean>
  >({
    contactHeading: false,
    contactDetails: false,
    contactLabels: false,
    contactMessages: false,
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
  const [contactRowIcons, setContactRowIcons] = useState(["", "", ""]);
  const [contactIconPicker, setContactIconPicker] = useState<number | null>(
    null,
  );
  const [contactIconPages, setContactIconPages] = useState([0, 0, 0]);

  // ── Translation-in-progress indicators ───────────────────────────────────
  const [heroTranslationPending, setHeroTranslationPending] = useState(false);
  const [svcTranslationPending, setSvcTranslationPending] = useState(false);

  // Load persisted values on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_COLORS);
      if (saved) setColors(JSON.parse(saved) as typeof COLOR_DEFAULTS);
    } catch {
      /* ignore */
    }
    try {
      const saved = localStorage.getItem(LS_HERO);
      if (saved) {
        const h = JSON.parse(saved) as {
          slogan?: string;
          badge?: string;
          trustLine?: string;
          trustIcon?: string;
          trustBg?: string;
          partnersBg?: string;
          heroImgDesktop?: string;
          heroImgMobile?: string;
          partners?: { name: string; logo: string }[];
          stat1Value?: string;
          stat1Label?: string;
          stat2Value?: string;
          stat2Label?: string;
          stat3Value?: string;
          stat3Label?: string;
          stat4Value?: string;
          stat4Label?: string;
        };
        setSlogan(h.slogan ?? "");
        setBadge(h.badge ?? "");
        setTrustLine(h.trustLine ?? "");
        setHeroTrustIcon(h.trustIcon ?? "");
        setStat1Value(h.stat1Value ?? "");
        setStat1Label(h.stat1Label ?? "");
        setStat2Value(h.stat2Value ?? "");
        setStat2Label(h.stat2Label ?? "");
        setStat3Value(h.stat3Value ?? "");
        setStat3Label(h.stat3Label ?? "");
        setStat4Value(h.stat4Value ?? "");
        setStat4Label(h.stat4Label ?? "");
        if (h.trustBg) {
          setTrustBg(h.trustBg);
          document.documentElement.style.setProperty(
            "--brand-trust-bg",
            h.trustBg,
          );
        }
        if (h.partnersBg) {
          setPartnersBg(h.partnersBg);
          document.documentElement.style.setProperty(
            "--brand-partner-bg",
            h.partnersBg,
          );
        }
        if (h.heroImgDesktop) setHeroImgDesktop(h.heroImgDesktop);
        if (h.heroImgMobile) setHeroImgMobile(h.heroImgMobile);
        if (h.partners) setPartners(h.partners);
      }
    } catch {
      /* ignore */
    }
    try {
      const saved = localStorage.getItem(LS_SERVICES);
      if (saved) {
        const s = JSON.parse(saved) as Record<string, string>;
        setSvcTitle(s.title ?? "");
        setSvcLabel(s.label ?? "");
        setSvcCards((prev) =>
          prev.map((c, i) => ({
            title: s[`item${i}Title`] ?? "",
            desc: s[`item${i}Desc`] ?? "",
            img: s[`img${i}`] ?? c.img,
          })),
        );
      }
    } catch {
      /* ignore */
    }
    try {
      const saved = localStorage.getItem(LS_ABOUT);
      if (saved) {
        const a = JSON.parse(saved) as Record<string, string>;
        setAboutLabel(a.label ?? "");
        setAboutTitle(a.title ?? "");
        setAboutDesc(a.description ?? "");
        setAboutDesc2(a.description2 ?? "");
        setAboutValuesTitle(a.valuesTitle ?? "");
        setAboutValues([
          a.value0 ?? "",
          a.value1 ?? "",
          a.value2 ?? "",
          a.value3 ?? "",
        ]);
        setAboutDriversPlaced(a.driversPlaced ?? "");
        setAboutYearsActive(a.yearsActive ?? "");
        setAboutLocation(a.location ?? "");
        setAboutYearsActiveNum(a.yearsActiveNum ?? "");
        setAboutDriversIcon(a.driversIcon ?? "");
        setAboutLocationIcon(a.locationIcon ?? "");
        if (a.imgLeft) setAboutImgLeft(a.imgLeft);
        if (a.imgTopRight) setAboutImgTopRight(a.imgTopRight);
        if (a.imgBottomRight) setAboutImgBottomRight(a.imgBottomRight);
      }
    } catch {
      /* ignore */
    }
    try {
      const saved = localStorage.getItem(LS_HOUSING);
      if (saved) {
        const h = JSON.parse(saved) as Record<string, string>;
        setHousingLabel(h.label ?? "");
        setHousingTitle(h.title ?? "");
        setHousingDesc(h.description ?? "");
        setHousingPerks([
          h.perk0 ?? "",
          h.perk1 ?? "",
          h.perk2 ?? "",
          h.perk3 ?? "",
        ]);
        setHousingCta(h.cta ?? "");
        setHousingPerkIcons([
          h.perk0Icon ?? "",
          h.perk1Icon ?? "",
          h.perk2Icon ?? "",
          h.perk3Icon ?? "",
        ]);
        if (h.img1) setHousingImg1(h.img1);
        if (h.img2) setHousingImg2(h.img2);
      }
    } catch {
      /* ignore */
    }
    try {
      const saved = localStorage.getItem("tc_contact_overrides");
      if (saved) {
        const c = JSON.parse(saved) as Record<string, string>;
        setContactTitle(c.title ?? "");
        setContactSubtitle(c.subtitle ?? "");
        setContactPhoneLabel(c.phone ?? "");
        setContactEmailLabel(c.email ?? "");
        setContactAddressLabel(c.address ?? "");
        setContactSend(c.send ?? "");
        setContactSuccess(c.success ?? "");
        setContactSuccessSubtitle(c.success_subtitle ?? "");
        setContactWhatsapp(c.whatsapp_number ?? "");
        setContactEmailAddress(c.email_address ?? "");
        setContactMapAddress(c.map_address ?? "");
        if (c.img) setContactImg(c.img);
        setContactRowIcons([
          c.phoneIcon ?? "",
          c.emailIcon ?? "",
          c.addressIcon ?? "",
        ]);
      }
    } catch {
      /* ignore */
    }
  }, []);

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
    send: contactSend,
    success: contactSuccess,
    success_subtitle: contactSuccessSubtitle,
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
    setContactSend("");
    setContactSuccess("");
    setContactSuccessSubtitle("");
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
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">
        {dict.admin.tab_customization}
      </h2>

      {/* ── Sub-tab switcher ── */}
      <div className="flex flex-wrap gap-1 bg-slate-800/60 rounded-xl p-1 w-fit">
        {(
          [
            "colors",
            "hero",
            "services",
            "about",
            "housing",
            "contact",
          ] as SubTab[]
        ).map((key) => {
          const labels: Record<SubTab, string> = {
            colors: dict.admin.custom_subtab_colors,
            hero: dict.admin.custom_subtab_hero,
            services: dict.admin.custom_subtab_services,
            about: dict.admin.custom_subtab_about,
            housing: dict.admin.custom_subtab_housing,
            contact: dict.admin.custom_subtab_contact,
          };
          const Icons: Record<SubTab, typeof Palette> = {
            colors: Palette,
            hero: Type,
            services: LayoutGrid,
            about: Users,
            housing: Home,
            contact: Mail,
          };
          const Icon = Icons[key];
          return (
            <button
              key={key}
              onClick={() => setSubTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                subTab === key
                  ? "bg-amber-400 text-amber-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {labels[key]}
            </button>
          );
        })}
      </div>

      {/* ── Colors panel ── */}
      {subTab === "colors" && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          <p className="text-xs text-slate-500">
            {dict.admin.custom_live_preview}
          </p>

          {/* Button Colors group */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Button Colors
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {colorFields
                .filter(
                  (f) =>
                    f.key === "brandGreen" ||
                    f.key === "brandMid" ||
                    f.key === "brandBtnText",
                )
                .map(({ key, label, default: defaultHex }) => (
                  <div key={key} className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {label}
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className="relative w-10 h-10 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
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
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                      />
                    </div>
                  </div>
                ))}
            </div>
            {/* Live preview: button states */}
            <div className="flex items-center gap-3 pt-1">
              <div
                className="px-5 py-2.5 rounded-lg text-sm font-bold shadow"
                style={{
                  backgroundColor: colors.brandGreen,
                  color: colors.brandBtnText,
                }}
              >
                Default
              </div>
              <div
                className="px-5 py-2.5 rounded-lg text-sm font-bold shadow"
                style={{
                  backgroundColor: colors.brandMid,
                  color: colors.brandBtnText,
                }}
              >
                Hover
              </div>
            </div>
          </div>

          {/* Dark accent */}
          <div className="space-y-3 border-t border-slate-800 pt-5">
            {colorFields
              .filter((f) => f.key === "brandDark")
              .map(({ key, label, default: defaultHex }) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {label}
                  </label>
                  <div className="flex items-center gap-3">
                    <div
                      className="relative w-10 h-10 rounded-lg border border-slate-600 shrink-0 overflow-hidden cursor-pointer"
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
                      className="flex-1 max-w-[180px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={saveColors}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-300 transition-colors"
            >
              {colorSaved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {colorSaved ? dict.admin.custom_saved : dict.admin.custom_save}
            </button>
            <button
              onClick={resetColors}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:border-slate-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {dict.admin.custom_reset}
            </button>
          </div>
        </div>
      )}

      {/* ── Hero sections panel ── */}
      {subTab === "hero" && (
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
              <div className="relative flex-shrink-0">
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
                className="max-w-[140px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
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
                className="max-w-[140px] bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
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

      {/* ══════════════════════════════════════════════════════════════════════
          Services Section panel
      ══════════════════════════════════════════════════════════════════════ */}
      {subTab === "services" && (
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
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                Small label (e.g. &quot;Our Services&quot;)
              </label>
              <input
                type="text"
                value={svcLabel}
                onChange={(e) => setSvcLabel(e.target.value)}
                placeholder="Our Services"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
              <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                Main title (e.g. &quot;What We Do&quot;)
              </label>
              <input
                type="text"
                value={svcTitle}
                onChange={(e) => setSvcTitle(e.target.value)}
                placeholder="What We Do"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistServices(buildServicesSource(), "svcHeading")
                }
                disabled={svcTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {svcSavingKey === "svcHeading" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : svcSectionSaved.svcHeading ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {svcSectionSaved.svcHeading ? "Saved!" : "Save"}
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 2-7 ── Service Cards */}
          {svcCards.map((card, i) => {
            const cardKey = `svcCard${i}` as ServicesSectionKey;
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
                key={i}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3"
              >
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Service Card {i + 1}
                </p>
                {/* Image preview */}
                <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.img || DEFAULT_SVC_IMGS[i]}
                    alt={`Card ${i + 1} preview`}
                    className="w-full h-full object-cover object-center"
                  />
                  {card.img && card.img !== DEFAULT_SVC_IMGS[i] && (
                    <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                      Custom
                    </span>
                  )}
                </div>
                <CloudinaryLogoUpload
                  value={card.img}
                  onChange={(url) =>
                    setSvcCards((prev) =>
                      prev.map((c, j) => (j === i ? { ...c, img: url } : c)),
                    )
                  }
                  folder="tc-services"
                />
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      void persistServices(buildServicesSource(), cardKey)
                    }
                    disabled={svcTranslating}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
                  >
                    {svcSavingKey === cardKey ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : svcSectionSaved[cardKey] ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    {svcSectionSaved[cardKey] ? "Saved!" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setSvcCards((prev) =>
                        prev.map((c, j) =>
                          j === i
                            ? { title: "", desc: "", img: DEFAULT_SVC_IMGS[i] }
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
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset to default
                  </button>
                </div>
              </div>
            );
          })}

          {/* ── Global action bar ── */}
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-amber-300">
                Save all changes
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Applies every card &amp; translates to all 18 languages
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => void saveAllServices()}
                disabled={svcSavingAll || svcTranslating}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {svcSavingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : svcAllSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {svcAllSaved ? "All saved!" : "Save all"}
              </button>
              <button
                onClick={() => void resetAllServices()}
                disabled={svcSavingAll || svcTranslating}
                className="inline-flex items-center gap-2 rounded-lg border border-red-700/60 px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:border-red-500 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore all defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          About Section panel
      ══════════════════════════════════════════════════════════════════════ */}
      {subTab === "about" && (
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

          {/* 1 ── Section label + title */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Small label (e.g. &quot;About us&quot;)
            </label>
            <input
              type="text"
              value={aboutLabel}
              onChange={(e) => setAboutLabel(e.target.value)}
              placeholder="About us"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Main title (e.g. &quot;About Team Cargo&quot;)
            </label>
            <input
              type="text"
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              placeholder="About Team Cargo"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistAbout(buildAboutSource(), "aboutHeading")
                }
                disabled={aboutTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {aboutSavingKey === "aboutHeading" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : aboutSectionSaved.aboutHeading ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {aboutSectionSaved.aboutHeading ? "Saved!" : "Save"}
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 2 ── Descriptions */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Description Paragraphs
            </p>
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              First paragraph
            </label>
            <textarea
              value={aboutDesc}
              onChange={(e) => setAboutDesc(e.target.value)}
              rows={3}
              placeholder="Team Cargo is a driver recruitment agency based in Amsterdam…"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
            />
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Second paragraph
            </label>
            <textarea
              value={aboutDesc2}
              onChange={(e) => setAboutDesc2(e.target.value)}
              rows={3}
              placeholder="We work with trusted partners such as GLS, FedEx, Amazon, and DPD…"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistAbout(buildAboutSource(), "aboutDescriptions")
                }
                disabled={aboutTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {aboutSavingKey === "aboutDescriptions" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : aboutSectionSaved.aboutDescriptions ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {aboutSectionSaved.aboutDescriptions ? "Saved!" : "Save"}
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 3 ── Values */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Our Values
            </p>
            <input
              type="text"
              value={aboutValuesTitle}
              onChange={(e) => setAboutValuesTitle(e.target.value)}
              placeholder="Our values"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            {(
              ["Reliability", "Efficiency", "Customer focus", "Safety"] as const
            ).map((placeholder, i) => (
              <input
                key={i}
                type="text"
                value={aboutValues[i]}
                onChange={(e) =>
                  setAboutValues((prev) =>
                    prev.map((v, j) => (j === i ? e.target.value : v)),
                  )
                }
                placeholder={placeholder}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
              />
            ))}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistAbout(buildAboutSource(), "aboutValues")
                }
                disabled={aboutTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {aboutSavingKey === "aboutValues" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : aboutSectionSaved.aboutValues ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {aboutSectionSaved.aboutValues ? "Saved!" : "Save"}
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 4 ── Badges */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Stat Badges
            </p>

            {/* backdrop closes any open icon picker */}
            {aboutIconPicker && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAboutIconPicker(null)}
              />
            )}

            {/* ── Drivers badge ── */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                Drivers placed badge (e.g. &quot;500+ Drivers placed&quot;)
              </label>
              <div className="flex items-center gap-2">
                {/* Icon picker */}
                <div className="relative flex-shrink-0">
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
                        title="Reset to default"
                        onClick={() => {
                          setAboutDriversIcon("");
                          setAboutIconPicker(null);
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
                  value={aboutDriversPlaced}
                  onChange={(e) => setAboutDriversPlaced(e.target.value)}
                  placeholder="500+ Drivers placed"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>

            {/* ── Location badge ── */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                Location badge (e.g. &quot;Amsterdam, Netherlands&quot;)
              </label>
              <div className="flex items-center gap-2">
                {/* Icon picker */}
                <div className="relative flex-shrink-0">
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
                        {BADGE_ICON_OPTS.location[aboutLocationIconPage].map(
                          ({ id, Icon: Ic, label }) => (
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
                          ),
                        )}
                      </div>
                      <button
                        type="button"
                        title="Reset to default"
                        onClick={() => {
                          setAboutLocationIcon("");
                          setAboutIconPicker(null);
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
                  value={aboutLocation}
                  onChange={(e) => setAboutLocation(e.target.value)}
                  placeholder="Amsterdam, Netherlands"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>

            {/* ── Floating years badge ── */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                Floating years badge
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aboutYearsActiveNum}
                  onChange={(e) => setAboutYearsActiveNum(e.target.value)}
                  placeholder="7+"
                  className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white text-center font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
                <input
                  type="text"
                  value={aboutYearsActive}
                  onChange={(e) => setAboutYearsActive(e.target.value)}
                  placeholder="Years active"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <p className="text-[9px] text-slate-600 pl-0.5">
                Left: big number (e.g. &quot;7+&quot;) &nbsp;·&nbsp; Right:
                label below it (e.g. &quot;Years active&quot;)
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() =>
                  void persistAbout(buildAboutSource(), "aboutBadges")
                }
                disabled={aboutTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {aboutSavingKey === "aboutBadges" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : aboutSectionSaved.aboutBadges ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {aboutSectionSaved.aboutBadges ? "Saved!" : "Save"}
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 5 ── Left portrait image */}
          {[
            {
              key: "aboutImgLeft" as AboutSectionKey,
              label: "Left Portrait Image",
              hint: "Tall portrait — left column of the mosaic",
              state: aboutImgLeft,
              setter: setAboutImgLeft,
              defaultSrc: "/teamCargo-trans-webP/TeamCargoGeletEdited.webp",
              aspectClass: "w-32 h-48",
            },
            {
              key: "aboutImgTopRight" as AboutSectionKey,
              label: "Top-Right Image",
              hint: "Upper image in the right column",
              state: aboutImgTopRight,
              setter: setAboutImgTopRight,
              defaultSrc: "/images/amazon_courier_webP.webp",
              aspectClass: "w-full h-28",
            },
            {
              key: "aboutImgBottomRight" as AboutSectionKey,
              label: "Bottom-Right Image",
              hint: "Lower image in the right column",
              state: aboutImgBottomRight,
              setter: setAboutImgBottomRight,
              defaultSrc: "/images/cargoTeam_webP.webp",
              aspectClass: "w-full h-28",
            },
          ].map(
            ({ key, label, hint, state, setter, defaultSrc, aspectClass }) => (
              <div
                key={key}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3"
              >
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  {label}
                </p>
                <p className="text-xs text-slate-500">{hint}</p>
                <div
                  className={`relative ${aspectClass} rounded-xl overflow-hidden bg-slate-800 border border-slate-700`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={state || defaultSrc}
                    alt={label}
                    className="w-full h-full object-cover object-center"
                  />
                  {state && (
                    <span className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                      Custom
                    </span>
                  )}
                </div>
                <CloudinaryLogoUpload
                  value={state}
                  onChange={setter}
                  folder="tc-about"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void persistAbout(buildAboutSource(), key)}
                    disabled={aboutTranslating}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
                  >
                    {aboutSavingKey === key ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : aboutSectionSaved[key] ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    {aboutSectionSaved[key] ? "Saved!" : "Save"}
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
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset to default
                  </button>
                </div>
              </div>
            ),
          )}

          {/* ── Global action bar ── */}
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-amber-300">
                Save all changes
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Applies every field above &amp; translates to all 18 languages
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => void saveAllAbout()}
                disabled={aboutSavingAll || aboutTranslating}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {aboutSavingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : aboutAllSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {aboutAllSaved ? "All saved!" : "Save all"}
              </button>
              <button
                onClick={() => void resetAllAbout()}
                disabled={aboutSavingAll || aboutTranslating}
                className="inline-flex items-center gap-2 rounded-lg border border-red-700/60 px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:border-red-500 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore all defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Housing panel ── */}
      {subTab === "housing" && (
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

          {/* 1 ── Section label + title */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Small label (e.g. &quot;Housing&quot;)
            </label>
            <input
              type="text"
              value={housingLabel}
              onChange={(e) => setHousingLabel(e.target.value)}
              placeholder="Voor chauffeurs die verhuizen"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Main title
            </label>
            <input
              type="text"
              value={housingTitle}
              onChange={(e) => setHousingTitle(e.target.value)}
              placeholder="Tijdelijke woonruimte voor chauffeurs"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistHousing(buildHousingSource(), "housingHeading")
                }
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {housingSavingKey === "housingHeading" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : housingSectionSaved.housingHeading ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {housingSectionSaved.housingHeading ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setHousingLabel("");
                  setHousingTitle("");
                  void persistHousing(
                    { ...buildHousingSource(), label: "", title: "" },
                    "housingHeading",
                  );
                }}
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 2 ── Description */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Description
            </p>
            <textarea
              value={housingDesc}
              onChange={(e) => setHousingDesc(e.target.value)}
              rows={3}
              placeholder="Wij helpen chauffeurs die vanuit het buitenland komen…"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistHousing(
                    buildHousingSource(),
                    "housingDescription",
                  )
                }
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {housingSavingKey === "housingDescription" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : housingSectionSaved.housingDescription ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {housingSectionSaved.housingDescription ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setHousingDesc("");
                  void persistHousing(
                    { ...buildHousingSource(), description: "" },
                    "housingDescription",
                  );
                }}
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 3 ── Perks (4 items with icon pickers) */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Perks (4 items)
            </p>
            {housingPerks.map((perkText, i) => {
              const iconKey = housingPerkIcons[i];
              const PickedIcon = iconKey
                ? (HOUSING_ICON_OPTS.flat().find((o) => o.id === iconKey)
                    ?.Icon ?? Home)
                : [Home, Wifi, Utensils, MapPin][i];
              const isPickerOpen = housingIconPicker === i;
              return (
                <div key={i} className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                    Perk {i + 1}
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Icon picker button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setHousingIconPicker(isPickerOpen ? null : i)
                        }
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-700 border border-slate-600 hover:border-amber-400 transition-colors shrink-0"
                        title="Pick icon"
                      >
                        <PickedIcon className="w-4 h-4 text-amber-400" />
                      </button>
                      {isPickerOpen && (
                        <div className="absolute left-0 bottom-full mb-2 z-50 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl w-64">
                          <div className="grid grid-cols-5 gap-1.5 mb-2">
                            {HOUSING_ICON_OPTS[housingIconPages[i]].map(
                              (opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  title={opt.label}
                                  onClick={() => {
                                    setHousingPerkIcons((prev) => {
                                      const next = [...prev];
                                      next[i] = opt.id;
                                      return next;
                                    });
                                    setHousingIconPicker(null);
                                  }}
                                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-slate-700 transition-colors ${housingPerkIcons[i] === opt.id ? "bg-amber-400/20 ring-1 ring-amber-400" : ""}`}
                                >
                                  <opt.Icon className="w-4 h-4 text-slate-300" />
                                  <span className="text-[9px] text-slate-400 leading-tight truncate w-full text-center">
                                    {opt.label}
                                  </span>
                                </button>
                              ),
                            )}
                          </div>
                          {/* Pagination */}
                          <div className="flex items-center justify-between mt-1">
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
                              className="px-2 py-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                            >
                              ← Prev
                            </button>
                            <span className="text-[10px] text-slate-500">
                              {housingIconPages[i] + 1} /{" "}
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
                              className="px-2 py-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                            >
                              Next →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Text input */}
                    <input
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
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() =>
                  void persistHousing(buildHousingSource(), "housingPerks")
                }
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {housingSavingKey === "housingPerks" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : housingSectionSaved.housingPerks ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {housingSectionSaved.housingPerks ? "Saved!" : "Save"}
              </button>
              <button
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 4 ── CTA button */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              CTA Button Text
            </p>
            <input
              type="text"
              value={housingCta}
              onChange={(e) => setHousingCta(e.target.value)}
              placeholder="Neem contact op"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistHousing(buildHousingSource(), "housingCta")
                }
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {housingSavingKey === "housingCta" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : housingSectionSaved.housingCta ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {housingSectionSaved.housingCta ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setHousingCta("");
                  void persistHousing(
                    { ...buildHousingSource(), cta: "" },
                    "housingCta",
                  );
                }}
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 5 ── Photo 1 */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Photo 1 (left column)
            </p>
            <CloudinaryLogoUpload
              value={housingImg1 || "/images/living_1_webP.webp"}
              onChange={(url) => setHousingImg1(url)}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistHousing(buildHousingSource(), "housingImg1")
                }
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {housingSavingKey === "housingImg1" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : housingSectionSaved.housingImg1 ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {housingSectionSaved.housingImg1 ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setHousingImg1("");
                  void persistHousing(
                    { ...buildHousingSource(), img1: "" },
                    "housingImg1",
                  );
                }}
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 6 ── Photo 2 */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Photo 2 (right column, offset)
            </p>
            <CloudinaryLogoUpload
              value={housingImg2 || "/images/living_2_webP.webp"}
              onChange={(url) => setHousingImg2(url)}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistHousing(buildHousingSource(), "housingImg2")
                }
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {housingSavingKey === "housingImg2" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : housingSectionSaved.housingImg2 ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {housingSectionSaved.housingImg2 ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setHousingImg2("");
                  void persistHousing(
                    { ...buildHousingSource(), img2: "" },
                    "housingImg2",
                  );
                }}
                disabled={housingTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* Save all / Reset all */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => void saveAllHousing()}
                disabled={housingSavingAll || housingTranslating}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {housingSavingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : housingAllSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {housingAllSaved ? "All saved!" : "Save all"}
              </button>
              <button
                onClick={() => void resetAllHousing()}
                disabled={housingSavingAll || housingTranslating}
                className="inline-flex items-center gap-2 rounded-lg border border-red-700/60 px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:border-red-500 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore all defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Contact Section ─────────────────────────────────────────────────── */}
      {subTab === "contact" && (
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

          {/* 1 ── Section Heading */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Title
            </label>
            <input
              type="text"
              value={contactTitle}
              onChange={(e) => setContactTitle(e.target.value)}
              placeholder="Contact us"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Subtitle
            </label>
            <textarea
              value={contactSubtitle}
              onChange={(e) => setContactSubtitle(e.target.value)}
              rows={2}
              placeholder="We're here to help"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistContact(buildContactSource(), "contactHeading")
                }
                disabled={contactTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {contactSavingKey === "contactHeading" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : contactSectionSaved.contactHeading ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {contactSectionSaved.contactHeading ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setContactTitle("");
                  setContactSubtitle("");
                  void persistContact(
                    { ...buildContactSource(), title: "", subtitle: "" },
                    "contactHeading",
                  );
                }}
                disabled={contactTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 2 ── Contact Details */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Contact Details
            </p>
            <p className="text-[10px] text-slate-500">
              These values are used directly — not translated.
            </p>
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              WhatsApp number (digits only, e.g. 31685352412)
            </label>
            <input
              type="text"
              value={contactWhatsapp}
              onChange={(e) => setContactWhatsapp(e.target.value)}
              placeholder="31685352412"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Email address
            </label>
            <input
              type="text"
              value={contactEmailAddress}
              onChange={(e) => setContactEmailAddress(e.target.value)}
              placeholder="info@teamcargo.nl"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Address (shown in contact row)
            </label>
            <input
              type="text"
              value={contactMapAddress}
              onChange={(e) => setContactMapAddress(e.target.value)}
              placeholder="Poortland 146, 1046 BD Amsterdam"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistContact(buildContactSource(), "contactDetails")
                }
                disabled={contactTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {contactSavingKey === "contactDetails" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : contactSectionSaved.contactDetails ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {contactSectionSaved.contactDetails ? "Saved!" : "Save"}
              </button>
              <button
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 3 ── Row Labels & Icons */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Row Labels &amp; Icons
            </p>
            {(
              [
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
              }[]
            ).map(({ key, label, placeholder, value, setter }, i) => {
              const iconKey = contactRowIcons[i];
              const defaultIcons = [Phone, Mail, MapPin] as LucideIcon[];
              const PickedIcon =
                (iconKey
                  ? CONTACT_ICON_OPTS.flat().find((o) => o.id === iconKey)?.Icon
                  : undefined) ?? defaultIcons[i];
              const isPickerOpen = contactIconPicker === i;
              return (
                <div key={key} className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Icon picker button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setContactIconPicker(isPickerOpen ? null : i)
                        }
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-700 border border-slate-600 hover:border-amber-400 transition-colors shrink-0"
                        title="Pick icon"
                      >
                        <PickedIcon className="w-4 h-4 text-amber-400" />
                      </button>
                      {isPickerOpen && (
                        <div className="absolute left-0 bottom-full mb-2 z-50 bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl w-64">
                          <div className="grid grid-cols-5 gap-1.5 mb-2">
                            {CONTACT_ICON_OPTS[contactIconPages[i]].map(
                              (opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  title={opt.label}
                                  onClick={() => {
                                    setContactRowIcons((prev) => {
                                      const next = [...prev];
                                      next[i] = opt.id;
                                      return next;
                                    });
                                    setContactIconPicker(null);
                                  }}
                                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-slate-700 transition-colors ${contactRowIcons[i] === opt.id ? "bg-amber-400/20 ring-1 ring-amber-400" : ""}`}
                                >
                                  <opt.Icon className="w-4 h-4 text-slate-300" />
                                  <span className="text-[9px] text-slate-400 leading-tight truncate w-full text-center">
                                    {opt.label}
                                  </span>
                                </button>
                              ),
                            )}
                          </div>
                          {/* Pagination */}
                          <div className="flex items-center justify-between mt-1">
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
                              className="px-2 py-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                            >
                              ← Prev
                            </button>
                            <span className="text-[10px] text-slate-500">
                              {contactIconPages[i] + 1} /{" "}
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
                              className="px-2 py-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                            >
                              Next →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Text input */}
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() =>
                  void persistContact(buildContactSource(), "contactLabels")
                }
                disabled={contactTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {contactSavingKey === "contactLabels" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : contactSectionSaved.contactLabels ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {contactSectionSaved.contactLabels ? "Saved!" : "Save"}
              </button>
              <button
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 4 ── Form Messages */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Form Messages
            </p>
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Send button text
            </label>
            <input
              type="text"
              value={contactSend}
              onChange={(e) => setContactSend(e.target.value)}
              placeholder="Send message"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Success heading
            </label>
            <input
              type="text"
              value={contactSuccess}
              onChange={(e) => setContactSuccess(e.target.value)}
              placeholder="Message sent!"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
            <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
              Success subtitle
            </label>
            <textarea
              value={contactSuccessSubtitle}
              onChange={(e) => setContactSuccessSubtitle(e.target.value)}
              rows={2}
              placeholder="We will get back to you shortly."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistContact(buildContactSource(), "contactMessages")
                }
                disabled={contactTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {contactSavingKey === "contactMessages" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : contactSectionSaved.contactMessages ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {contactSectionSaved.contactMessages ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setContactSend("");
                  setContactSuccess("");
                  setContactSuccessSubtitle("");
                  void persistContact(
                    {
                      ...buildContactSource(),
                      send: "",
                      success: "",
                      success_subtitle: "",
                    },
                    "contactMessages",
                  );
                }}
                disabled={contactTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* 5 ── Background / Side Image */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Background / Side Image
            </p>
            <CloudinaryLogoUpload
              value={contactImg || "/images/office_webP.webp"}
              onChange={(url) => setContactImg(url)}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  void persistContact(buildContactSource(), "contactImg")
                }
                disabled={contactTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {contactSavingKey === "contactImg" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : contactSectionSaved.contactImg ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                {contactSectionSaved.contactImg ? "Saved!" : "Save"}
              </button>
              <button
                onClick={() => {
                  setContactImg("");
                  void persistContact(
                    { ...buildContactSource(), img: "" },
                    "contactImg",
                  );
                }}
                disabled={contactTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to default
              </button>
            </div>
          </div>

          {/* Save all / Restore all defaults */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => void saveAllContact()}
                disabled={contactSavingAll || contactTranslating}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {contactSavingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : contactAllSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {contactAllSaved ? "All saved!" : "Save all"}
              </button>
              <button
                onClick={() => void resetAllContact()}
                disabled={contactSavingAll || contactTranslating}
                className="inline-flex items-center gap-2 rounded-lg border border-red-700/60 px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:border-red-500 disabled:opacity-60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore all defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
