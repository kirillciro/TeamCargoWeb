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
  PersonStanding,
  Plane,
  Rocket,
  Route,
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

// ── LocalStorage keys ─────────────────────────────────────────────────────
export const LS_COLORS = "tc_brand_colors";
export const LS_HERO = "tc_hero_overrides";
export const LS_HEADER = "tc_header_settings";
export const LS_SERVICES = "tc_services_overrides";
export const LS_ABOUT = "tc_about_overrides";
export const LS_HOUSING = "tc_housing_overrides";
export const LS_FONT = "tc_brand_font";
export const LS_CONTACT = "tc_contact_overrides";
export const LS_FOOTER = "tc_footer_overrides";

// ── Color defaults & map ──────────────────────────────────────────────────
export const COLOR_DEFAULTS = {
  brandGreen: "#36b347",
  brandMid: "#079441",
  brandDark: "#006637",
  brandBtnText: "#ffffff",
  trustBg: "#0d3d1e",
  headerBg: "#040f08",
  footerBg: "#040f08",
};

export const CSS_VAR_MAP: Record<keyof typeof COLOR_DEFAULTS, string> = {
  brandGreen: "--brand-green",
  brandMid: "--brand-mid",
  brandDark: "--brand-dark",
  brandBtnText: "--brand-btn-text",
  trustBg: "--brand-trust-bg",
  headerBg: "--brand-header-bg",
  footerBg: "--brand-footer-bg",
};

// ── Types ─────────────────────────────────────────────────────────────────
export type ColorKey = keyof typeof COLOR_DEFAULTS;

export type SubTab =
  | "colors"
  | "fonts"
  | "header"
  | "hero"
  | "services"
  | "about"
  | "housing"
  | "contact"
  | "footer";

export type SectionKey =
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

export type ServicesSectionKey =
  | "svcHeading"
  | "svcCard0"
  | "svcCard1"
  | "svcCard2"
  | "svcCard3"
  | "svcCard4"
  | "svcCard5";

export type AboutSectionKey =
  | "aboutHeading"
  | "aboutDescriptions"
  | "aboutValues"
  | "aboutBadges"
  | "aboutImgLeft"
  | "aboutImgTopRight"
  | "aboutImgBottomRight";

export type HousingSectionKey =
  | "housingHeading"
  | "housingDescription"
  | "housingPerks"
  | "housingCta"
  | "housingImg1"
  | "housingImg2"
  | "housingBg";

export type ContactSectionKey =
  | "contactHeading"
  | "contactDetails"
  | "contactLabels"
  | "contactMapPin"
  | "contactImg";

// ── Default data ──────────────────────────────────────────────────────────
export const DEFAULT_SVC_IMGS = [
  "/images/gls_vans_webP.webp",
  "/images/fedex_courier_2_webP.webp",
  "/images/dpd_courier_2_webP.webp",
  "/images/dpd_courier_webP.webp",
  "/images/fedex_courier_webP.webp",
  "/images/gls_courier_webP.webp",
];

export const DEFAULT_SVC_CARDS = DEFAULT_SVC_IMGS.map((img) => ({
  title: "",
  desc: "",
  img,
}));

// ── Permanently pinned partner — only changeable via code ──────────────────
export const PINNED_PARTNER = {
  name: "Strunix Tech",
  logo: "/partners/strunix_tech_logo.svg",
} as const;

export const DEFAULT_PARTNERS = [
  { name: "Amazon", logo: "/partners/amazon_logo.svg" },
  { name: "FedEx", logo: "/partners/fedex_logo.svg" },
  { name: "DPD", logo: "/partners/dpd_logo.svg" },
  { name: "GLS", logo: "/partners/gls_logo.svg" },
  { name: "Transmission", logo: "/partners/transmission_logo.svg" },
];

// ── Font options ──────────────────────────────────────────────────────────
export type FontOption = {
  id: string;
  label: string;
  family: string;
  google: string | null;
};

export const FONT_OPTIONS: FontOption[] = [
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

// ── Icon option arrays ────────────────────────────────────────────────────
export const HOUSING_ICON_OPTS: {
  id: string;
  Icon: LucideIcon;
  label: string;
}[][] = [
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

export const CONTACT_ICON_OPTS: {
  id: string;
  Icon: LucideIcon;
  label: string;
}[][] = [
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

export const BADGE_ICON_OPTS: Record<
  "drivers" | "location",
  { id: string; Icon: LucideIcon; label: string }[][]
> = {
  drivers: [
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

export const TRUST_ICON_OPTS: {
  id: string;
  Icon: LucideIcon;
  label: string;
}[][] = [
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
