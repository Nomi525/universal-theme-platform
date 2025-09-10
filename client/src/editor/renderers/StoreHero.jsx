import cn from "classnames";

const radius = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const visibilityClass = (v) =>
  v === "desktop" ? "hidden md:block" : v === "mobile" ? "block md:hidden" : "";

function getStoreLogoFallback() {
  try {
    if (typeof window !== "undefined" && window.__STORE_LOGO)
      return window.__STORE_LOGO;
  } catch {
    /* empty */
  }
  return "https://cdn.zepio.io/website/images/brand/store-logo-fallback.png";
}

export default function StoreHero({ settings = {} }) {
  const s = settings || {};
  const hDesktop = Number.isFinite(+s.height_desktop_px)
    ? +s.height_desktop_px
    : 420;
  const hMobile = Number.isFinite(+s.height_mobile_px)
    ? +s.height_mobile_px
    : 280;
  const r = s.border_radius || "lg";
  const pad = Number.isFinite(+s.inset_padding) ? +s.inset_padding : 14;

  const bg =
    s.background_image_url ||
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop";

  const overlayColor = s.overlay_color || "#000000";
  const overlayOpacity =
    Math.min(100, Math.max(0, +s.overlay_opacity || 25)) / 100;

  const logoUrl = s.logo_image_url || getStoreLogoFallback();
  const logoSize = Number.isFinite(+s.logo_badge_size)
    ? +s.logo_badge_size
    : 88;
  const logoPad = Number.isFinite(+s.logo_badge_inner_padding)
    ? +s.logo_badge_inner_padding
    : 6;

  return (
    <section className={cn("w-full", visibilityClass(s.visibility))}>
      <div
        className={cn("relative overflow-hidden", radius[r])}
        style={{ height: hMobile }}
      >
        {/* override height on md+ */}
        <style>{`
          @media (min-width: 768px){ .store-hero-h { height: ${hDesktop}px; } }
        `}</style>

        {/* background */}
        <div
          className={cn("absolute inset-0 store-hero-h")}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: s.background_object_position || "center",
          }}
          aria-hidden="true"
        />

        {/* overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
        />

        {/* bottom-left: logo badge */}
        {s.show_logo_badge && (
          <div className="absolute" style={{ left: pad, bottom: pad }}>
            <div
              className={cn(
                "bg-white flex items-center justify-center overflow-hidden",
                s.logo_badge_shadow ? "shadow-lg" : "",
                s.logo_badge_shape === "circle"
                  ? "rounded-full"
                  : s.logo_badge_shape === "square"
                  ? "rounded-none"
                  : "rounded-xl" // a bit softer
              )}
              style={{ width: logoSize, height: logoSize, padding: logoPad }}
            >
              <img
                src={logoUrl}
                alt="Store logo"
                className="h-full w-full object-contain"
                draggable={false}
              />
            </div>
          </div>
        )}

        {/* bottom-right: “Made with Zepio” */}
        {s.show_made_with && (
          <a
            href={s.made_with_link || "#"}
            target="_blank"
            rel="noreferrer"
            className="absolute flex items-center gap-2 bg-black/55 text-white text-xs rounded-full pl-2 pr-2 py-1 hover:bg-black/65 transition"
            style={{ right: pad, bottom: pad }}
          >
            {s.show_made_with_icon && s.made_with_icon_url ? (
              <img
                src={s.made_with_icon_url}
                alt=""
                className="h-4 w-4 rounded-full"
                draggable={false}
              />
            ) : null}
            <span className="whitespace-nowrap">
              {s.made_with_text || "StoreMins"}
            </span>
          </a>
        )}
      </div>

      {s.custom_css ? <style>{s.custom_css}</style> : null}
    </section>
  );
}
