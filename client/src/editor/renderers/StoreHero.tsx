import { Share2 } from "lucide-react";
import * as React from "react";

function cx(...p: Array<string | false | null | undefined>) {
  return p.filter(Boolean).join(" ");
}

type Props = {
  backgroundUrl?: string;
  logoUrl?: string;
  title?: string;
  subtitle?: string;
  tagline?: string | string[];
  heightDesktop?: number;
  heightMobile?: number;
  initialFollowing?: boolean;
  onFollowChange?: (following: boolean) => void;

  /** optional click handler for Share */
  onShare?: () => void;
};

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop";
const FALLBACK_LOGO =
  "https://minis-media-assets.swiggy.com/swiggymini/image/upload/h_256,c_fit,fl_lossy,q_auto:eco,f_auto/IMAGE/847486d0-db3e-4d54-bee7-b537747c7ecd/0gZi8UlkP9cWIQrrlQF1u-B63F0C50-8D0C-4529-AC08-1613096E9E43.png";

/** Inline SVG share icon (similar to your screenshot) */
function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* arrow pointing up-right (enterprise-style share/export) */}
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export default function StoreHero({
  backgroundUrl = FALLBACK_BG,
  logoUrl = FALLBACK_LOGO,
  title = "Faasos' Signature Wraps & Rolls",
  subtitle = "Extraordinarily Indulgent Wraps",
  tagline = [
    "Crafting delicious, homemade treats daily.",
    "Specialising in artisanal breads, cakes, and pastries that bring a touch of sweetness to your life. 🧁",
  ],
  heightDesktop = 400,
  heightMobile = 240,
  initialFollowing = false,
  onFollowChange,
  onShare,
}: Props) {
  const BADGE = {
    size: 80,
    overlap: 40,
    shadow: "0 8px 20px rgba(0,0,0,0.15)",
    ring: "0 0 0 4px #fff",
  };

  const [bg, setBg] = React.useState(backgroundUrl);
  const [logo, setLogo] = React.useState(logoUrl);
  const [following, setFollowing] = React.useState<boolean>(initialFollowing);

  const toggleFollow = () => {
    const next = !following;
    setFollowing(next);
    onFollowChange?.(next);
  };

  return (
    <section className="w-full font-sans">
      <style>{`
        @media (min-width: 768px){ .sh-hero-h { height: ${heightDesktop}px; } }
      `}</style>

      {/* HERO */}
      <div
        className={cx(
          "relative sh-hero-h",
          "border border-neutral-200/60 shadow-sm"
        )}
        style={{ height: heightMobile }}
      >
        {/* background mask */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: "inherit" }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        </div>
      </div>

      {/* CARD */}
      <div className="relative z-30" style={{ marginTop: -BADGE.overlap }}>
        {/* Logo Badge */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex items-center justify-center z-30"
          style={{
            top: 0,
            width: BADGE.size,
            height: BADGE.size,
            borderRadius: 20,
            boxShadow: `${BADGE.shadow}, ${BADGE.ring}`,
          }}
        >
          <img
            src={logo}
            onError={() => setLogo(FALLBACK_LOGO)}
            alt="brand"
            className="w-3/4 h-3/4 object-contain"
            draggable={false}
            loading="lazy"
          />
        </div>

        <div className="bg-white border border-neutral-200 rounded-t-3xl shadow-sm">
          <div className="px-6 md:px-10 pt-12 pb-8">
            {/* Title */}
            <h2 className="text-center text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
              {title}
            </h2>

            {/* Subtitle + Actions row */}
            <div className="mt-2 flex items-center justify-center gap-3">
              <p className="text-sm md:text-base text-neutral-500">
                {subtitle}
              </p>

              {/* Actions: Follow + Share (stick together) */}
              {/* Actions: Follow + Share */}
              <div className="flex items-center gap-2 md:gap-2.5">
                <button
                  type="button"
                  onClick={toggleFollow}
                  className={cx(
                    "rounded-full font-medium text-white shadow-sm",
                    "transition-colors duration-150",
                    following
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700",
                    "px-3.5 py-1 text-[12px] sm:px-4 sm:py-1.5 sm:text-[13px] md:px-4.5 md:py-1.5 md:text-[14px]"
                  )}
                  aria-pressed={following}
                >
                  {following ? "Following" : "Follow"}
                </button>

                {/* light, icon-only share */}
                <button
                  type="button"
                  onClick={onShare}
                  aria-label="Share"
                  className="inline-flex items-center justify-center 
             text-neutral-400 hover:text-neutral-600 active:text-neutral-800
             focus:outline-none transition-colors duration-150"
                >
                  {/* 👇 smaller size + thinner stroke */}
                  <Share2
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4"
                    strokeWidth={1.6}
                  />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-4 border-t border-neutral-100" />

            {/* Tagline block */}
            {tagline && (
              <div className="mt-4 space-y-2 text-center">
                {Array.isArray(tagline) ? (
                  tagline.map((line, i) => (
                    <p
                      key={i}
                      className="text-sm md:text-base text-neutral-600 leading-relaxed"
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    {tagline}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* preloaders */}
      <img
        src={bg}
        onError={() => setBg(FALLBACK_BG)}
        alt=""
        className="hidden"
      />
      <img
        src={logo}
        onError={() => setLogo(FALLBACK_LOGO)}
        alt=""
        className="hidden"
      />
    </section>
  );
}
