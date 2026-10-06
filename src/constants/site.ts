// Site-wide routes, section anchors and contact details used by the
// public header, footer and landing page. Update values here, not inline.

export const ROUTES = {
  home: "/",
  howItWorks: "/how-it-works",
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  register: "/register",
  verifyAccount: "/register/verify-account",
  pricing: "/pricing",
  rideWithUs: "/ride-with-us",
  riderApply: "/apply-rider",
  riderEmailVerify: "/apply-rider/verify",
  about: "/about",
  contact: "/contact",
  dashboard: "/dashboard",
  changePassword: "/dashboard/change-password",
  terms: "/",
  privacy: "/",
} as const;

// Anchor ids for the landing page sections.
export const SECTION_IDS = {
  howItWorks: "how-it-works",
  features: "features",
  riders: "riders",
  // Pricing page
  rates: "rates",
  estimator: "estimator",
} as const;


export const SUPPORT = {
  email: "suuport.parcelflow@gmail.com",
  phone: "01712345678",
} as const;

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "x";

export const SOCIAL_LINKS: {
  platform: SocialPlatform;
  label: string;
  href: string;
}[] = [
  {
    platform: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/",
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
  },
  { platform: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
  { platform: "x", label: "X", href: "https://x.com/" },
];
