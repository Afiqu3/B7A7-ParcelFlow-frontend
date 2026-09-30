import type { SVGProps } from "react";
import type { SocialPlatform } from "@/constants";

// lucide-react v1 dropped brand icons, so the social glyphs live here.
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  focusable: false,
} as const;

export function FacebookIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} fill="currentColor" {...props}>
      <path d="M13.6 21v-6.5h2.7l.5-3.5h-3.2V9c0-.6.4-1 1-1H17V4.6c-.6-.1-1.6-.2-2.6-.2C11.8 4.4 10 6 10 8.8V11H7.5v3.5H10V21z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      {...base}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} fill="currentColor" {...props}>
      <rect x="3.5" y="9" width="3.5" height="11.5" rx="0.5" />
      <circle cx="5.25" cy="5.25" r="2" />
      <path d="M10 9h3.3v1.6c.6-1 1.9-1.9 3.7-1.9 3 0 4 1.9 4 4.9v6.9h-3.5v-6.1c0-1.5-.4-2.6-1.8-2.6-1.5 0-2.2 1.1-2.2 2.6v6.1H10z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8A27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15V9l5.2 3z"
      />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} fill="currentColor" {...props}>
      <path d="M4 4h4.6l11.4 16h-4.6z" />
      <path
        d="M19.3 4l-5.9 6.7M10.6 13.3 4.7 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<
  SocialPlatform,
  (props: IconProps) => React.JSX.Element
> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  x: XIcon,
};
