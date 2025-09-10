/*************************************************
 * OffersCollections.tsx
 * - Mobile: snap carousel + dots
 * - Desktop: equal-height 3-up grid
 * - Works with images: string[] OR items: { image,... }[]
 * - Added: full-bleed section background image + optional tint
 *************************************************/
import React, { useEffect, useMemo, useRef, useState } from "react";

type RichItem = {
  image: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  ctaLabel?: string;
  href?: string;
  gradient?: string; // overlay CSS
};

type Props = { settings: any };

export default function OffersCollections({ settings }: Props) {
  // ---- Settings with safe defaults -----------------------------------------
  const {
    enabled = true,

    // header
    show_header = true,
    title = "Explore offers",
    subtitle = "Handpicked promos & popular collections",
    align = "left", // "left" | "center" | "right"

    // content (either one is fine)
    images = [] as string[],
    items = [] as unknown[],

    // card look
    radius = 16, // px
    height_mobile_px = 160,
    height_desktop_px = 180,
    overlay_gradient = "linear-gradient(180deg, rgba(0,0,0,0) 20%, rgba(0,0,0,0.65) 100%)",
    show_cta = true,
    cta_label_default = "Explore",

    // section
    section_background_color = "#ffffff",
    section_background_image = "", // <-- NEW (URL)
    section_background_tint = "rgba(255,255,255,0.88)", // <-- NEW (set to 'transparent' to disable)

    // mobile dots
    show_dots_mobile = true,

    custom_css,
  } = (settings || {}) as Record<string, any>;

  if (!enabled) return null;

  // ---- Normalize input to RichItem[] ---------------------------------------
  const richItems: RichItem[] = useMemo(() => {
    const base: any[] =
      (Array.isArray(items) && items.length > 0 ? items : images) || [];

    return base
      .map((raw) => {
        if (typeof raw === "string") {
          return { image: raw } as RichItem;
        }
        if (
          raw &&
          typeof raw === "object" &&
          typeof (raw as any).image === "string"
        ) {
          const r = raw as Partial<RichItem>;
          return {
            image: r.image!,
            title: r.title,
            subtitle: r.subtitle,
            badge: r.badge,
            ctaLabel: r.ctaLabel,
            href: r.href,
            gradient: r.gradient,
          } as RichItem;
        }
        return null;
      })
      .filter((x): x is RichItem => !!x && typeof x.image === "string");
  }, [images, items]);

  if (richItems.length === 0) return null;

  // ---- State for mobile dots -----------------------------------------------
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;

    const slideEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-slide]")
    );
    if (slideEls.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .map((e) => {
            const el = e.target as HTMLElement;
            const idx = Number(el.dataset.slide || 0);
            return { idx, ratio: e.intersectionRatio };
          })
          .sort((a, b) => b.ratio - a.ratio)[0];

        if (best && best.ratio > 0.5) setActive(best.idx);
      },
      { root, threshold: [0.25, 0.5, 0.75, 1] }
    );

    slideEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [richItems.length]);

  // ---- Helpers --------------------------------------------------------------
  const alignCls =
    align === "center"
      ? "items-center text-center"
      : align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  const Card = (it: RichItem, i: number) => {
    const inner = (
      <div
        className="relative w-full overflow-hidden bg-gray-100"
        style={{
          height: "100%",
          borderRadius: radius,
          boxShadow: "0 6px 18px rgba(17,24,39,0.06)",
        }}
      >
        <img
          src={it.image}
          alt={it.title || `Offer ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />

        {it.badge && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full"
            style={{ background: "rgba(255,255,255,0.95)", color: "#111827" }}
          >
            {it.badge}
          </div>
        )}

        <div
          className="absolute inset-x-0 bottom-0 p-4 md:p-5"
          style={{ background: it.gradient || overlay_gradient }}
        >
          {(it.title || it.subtitle || show_cta) && (
            <div className="space-y-1">
              {it.title && (
                <div className="text-white font-bold text-base md:text-lg leading-tight">
                  {it.title}
                </div>
              )}
              {it.subtitle && (
                <div className="text-white/85 text-xs md:text-sm">
                  {it.subtitle}
                </div>
              )}
              {show_cta && (
                <div>
                  <span
                    className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      color: "#111827",
                    }}
                  >
                    {it.ctaLabel || cta_label_default}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );

    return it.href ? (
      <a key={i} href={it.href} className="block h-full" data-slide={`${i}`}>
        {inner}
      </a>
    ) : (
      <div key={i} className="h-full" data-slide={`${i}`}>
        {inner}
      </div>
    );
  };

  // ---- Render ---------------------------------------------------------------
  return (
    <section
      className="w-full relative"
      style={{ background: section_background_color }}
    >
      {/* Background image + optional tint (fills the whole section) */}
      {section_background_image ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 -z-[1] bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url("${section_background_image}")` }}
          />
          {section_background_tint &&
            section_background_tint !== "transparent" && (
              <div
                aria-hidden
                className="absolute inset-0 -z-[1]"
                style={{ background: section_background_tint }}
              />
            )}
        </>
      ) : null}

      {/* optional custom CSS from settings */}
      <style>
        {custom_css || ""}
        {`
          .no-scrollbar::-webkit-scrollbar{display:none}
          .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 relative">
        {/* Header */}
        {show_header && (
          <div className={`flex flex-col ${alignCls} mb-3 md:mb-4`}>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm md:text-base text-gray-600">{subtitle}</p>
            )}
          </div>
        )}

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div
            ref={trackRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar"
            role="region"
            aria-label="Offers carousel"
          >
            {richItems.map((it, i) => (
              <div
                key={i}
                className="shrink-0 snap-center"
                style={{ width: "88vw", height: height_mobile_px }}
              >
                {Card(it, i)}
              </div>
            ))}
          </div>

          {show_dots_mobile && (
            <div className="mt-3 flex justify-center gap-2">
              {richItems.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === active ? 28 : 10,
                    background: i === active ? "#111827" : "#D1D5DB",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop: 3-up grid, equal height */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {richItems.slice(0, 6).map((it, i) => (
            <div
              key={i}
              className="h-full"
              style={{ height: height_desktop_px }}
            >
              {Card(it, i)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
