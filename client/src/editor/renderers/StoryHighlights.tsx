/******************************************************
 * StoryHighlights.tsx — neutral ring, no fancy effects
 ******************************************************/
import React, { useEffect, useMemo, useRef, useState } from "react";

type Highlight = {
  name: string;
  cover: string;
  images?: string[];
  seen?: boolean;
};

type Settings = {
  enabled?: boolean;
  section_background_color?: string;

  size_px?: number;
  gap_px?: number;

  show_labels?: boolean;
  label_color?: string;
  label_size?: "text-xs" | "text-sm";

  ring_width?: number;
  ring_gap?: number;
  ring_from?: string;
  ring_via?: string;
  ring_to?: string;
  seen_ring?: string;
  ring_pulse_unseen?: boolean;

  shadow?: string;
  highlights?: Highlight[];

  show_row_arrows_desktop?: boolean;
  show_row_arrows_mobile?: boolean;
  arrows_bg?: string;
  arrows_fg?: string;

  modal_backdrop?: string;
  modal_nav_bg?: string;
  modal_nav_color?: string;
  autoplay?: boolean;
  autoplay_ms?: number;

  /** Center row (mobile) when content fits within viewport */
  center_mobile_when_fits?: boolean;

  custom_css?: string | null;
};

export default function StoryHighlights({ settings }: { settings: Settings }) {
  const {
    enabled = true,
    section_background_color = "#ffffff",

    size_px = 92,
    gap_px = 18,

    show_labels = true,
    label_color = "#111827",
    label_size = "text-xs",

    // === Neutral, thin ring like screenshot ===
    ring_width = 2,
    ring_gap = 2,
    ring_from = "#E5E7EB",
    ring_via = "#E5E7EB",
    ring_to = "#E5E7EB",
    seen_ring = "#E5E7EB",
    ring_pulse_unseen = false,

    // No shadow
    shadow = "none",

    highlights = [],

    show_row_arrows_desktop = true,
    show_row_arrows_mobile = true,
    arrows_bg = "#F3F4F6",
    arrows_fg = "#111827",

    modal_backdrop = "rgba(0,0,0,0.85)",
    modal_nav_bg = "rgba(255,255,255,0.92)",
    modal_nav_color = "#111827",
    autoplay = false,
    autoplay_ms = 5000,

    center_mobile_when_fits = true,

    custom_css,
  } = settings || {};

  if (!enabled) return null;

  const items = useMemo(
    () =>
      (highlights || []).map((h) => ({
        ...h,
        images: Array.isArray(h.images) ? h.images.slice(0, 3) : [],
      })),
    [highlights]
  );

  // ---- row/rail refs & state
  const railRef = useRef<HTMLDivElement>(null);
  const firstChipRef = useRef<HTMLButtonElement>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [pads, setPads] = useState({ left: 0, right: 0 });

  const fade = 22;

  // size responsive
  const sizeCss = `clamp(60px, 16vw, ${Math.max(
    64,
    Math.min(120, size_px)
  )}px)`;

  const updateArrowsAndOverflow = () => {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    setOverflowing(el.scrollWidth > el.clientWidth + 1);
  };

  const centerMobileIfFits = () => {
    const rail = railRef.current;
    const first = firstChipRef.current;
    if (!rail || !first) return;

    // only care about small screens
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile || !center_mobile_when_fits) {
      setPads({ left: 0, right: 0 });
      return;
    }

    const n = items.length || 0;
    const itemW = Math.round(first.getBoundingClientRect().width);
    const contentW = n * itemW + Math.max(0, n - 1) * gap_px;
    const viewportW = rail.clientWidth;

    if (contentW < viewportW) {
      const side = Math.max(0, Math.floor((viewportW - contentW) / 2));
      setPads({ left: side, right: side });
    } else {
      setPads({ left: 0, right: 0 });
    }
  };

  useEffect(() => {
    updateArrowsAndOverflow();
    centerMobileIfFits();

    const el = railRef.current;
    if (!el) return;

    const onScroll = () => updateArrowsAndOverflow();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      updateArrowsAndOverflow();
      centerMobileIfFits();
    });
    ro.observe(el);

    // also recalc on orientation change
    const onResize = () => {
      updateArrowsAndOverflow();
      centerMobileIfFits();
    };
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, gap_px, center_mobile_when_fits]);

  const scrollBy = (dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.9, 560);
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  // ---- lightbox state
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (openIdx === null || !autoplay) return;
    const t = setTimeout(() => {
      const imgs = items[openIdx!].images?.length || 1;
      setSlide((s) => (s + 1 < imgs ? s + 1 : 0));
    }, Math.max(1500, autoplay_ms));
    return () => clearTimeout(t);
  }, [openIdx, slide, autoplay, autoplay_ms, items]);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setSlide((s) => s + 1);
      if (e.key === "ArrowLeft") setSlide((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIdx]);

  return (
    <section
      className="w-full"
      style={{ background: section_background_color }}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        @keyframes ringPulse{0%{transform:scale(1);filter:saturate(1)}60%{transform:scale(1.02);filter:saturate(1.15)}100%{transform:scale(1);filter:saturate(1)}}
        .skeleton{background:linear-gradient(90deg,#eee 25%,#f7f7f7 37%,#eee 63%);background-size:400% 100%;animation:skeleton 1.2s ease-in-out infinite}
        @keyframes skeleton{0%{background-position:100% 0}100%{background-position:0 0}}
        ${custom_css || ""}
      `}</style>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4">
        <div className="relative">
          {/* Row arrows (enable only when useful) */}
          {(show_row_arrows_mobile || show_row_arrows_desktop) && (
            <>
              <button
                aria-label="Previous highlights"
                onClick={() => scrollBy("left")}
                disabled={!canLeft}
                className={`absolute left-1 top-1/2 -translate-y-1/2 z-10 grid place-items-center rounded-full h-8 w-8 md:h-9 md:w-9 shadow-sm transition-opacity
                  ${show_row_arrows_mobile ? "inline-flex" : "hidden"}
                  ${show_row_arrows_desktop ? "md:inline-flex" : "md:hidden"}
                  ${!canLeft ? "opacity-40 cursor-not-allowed" : ""}`}
                style={{ background: arrows_bg, color: arrows_fg }}
              >
                ‹
              </button>
              <button
                aria-label="Next highlights"
                onClick={() => scrollBy("right")}
                disabled={!canRight}
                className={`absolute right-1 top-1/2 -translate-y-1/2 z-10 grid place-items-center rounded-full h-8 w-8 md:h-9 md:w-9 shadow-sm transition-opacity
                  ${show_row_arrows_mobile ? "inline-flex" : "hidden"}
                  ${show_row_arrows_desktop ? "md:inline-flex" : "md:hidden"}
                  ${!canRight ? "opacity-40 cursor-not-allowed" : ""}`}
                style={{ background: arrows_bg, color: arrows_fg }}
              >
                ›
              </button>
            </>
          )}

          {/* Horizontal rail */}
          <div
            ref={railRef}
            role="listbox"
            aria-label="Story highlights"
            className="no-scrollbar flex flex-nowrap md:flex-wrap md:justify-center snap-x snap-mandatory"
            style={{
              gap: gap_px,
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              padding: "2px 0",
              paddingLeft: pads.left,
              paddingRight: pads.right,
              // Only show fade when overflowing; avoids “cut” look when centered
              maskImage: overflowing
                ? `linear-gradient(to right, transparent 0, black ${fade}px, black calc(100% - ${fade}px), transparent 100%)`
                : "none",
              WebkitMaskImage: overflowing
                ? `linear-gradient(to right, transparent 0, black ${fade}px, black calc(100% - ${fade}px), transparent 100%)`
                : "none",
            }}
          >
            {items.map((h, i) => (
              <Chip
                key={`${h.name}-${i}`}
                data={h}
                sizeCss={sizeCss}
                ring_width={ring_width}
                ring_gap={ring_gap}
                ring_from={ring_from}
                ring_via={ring_via}
                ring_to={ring_to}
                seen_ring={seen_ring}
                ringPulse={ring_pulse_unseen}
                shadow={shadow}
                show_label={show_labels}
                label_color={label_color}
                label_size={label_size}
                onOpen={() => {
                  setOpenIdx(i);
                  setSlide(0);
                }}
                // give me width of a single item for centering math
                buttonRef={i === 0 ? firstChipRef : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {openIdx !== null && (
        <Lightbox
          name={items[openIdx].name}
          images={
            items[openIdx].images && items[openIdx].images!.length > 0
              ? items[openIdx].images!
              : [items[openIdx].cover]
          }
          slide={slide}
          setSlide={(n) => {
            const max = Math.max(0, (items[openIdx!].images?.length || 1) - 1);
            setSlide(n < 0 ? max : n > max ? 0 : n);
          }}
          onClose={() => setOpenIdx(null)}
          backdrop={modal_backdrop}
          navBg={modal_nav_bg}
          navColor={modal_nav_color}
          dots
        />
      )}
    </section>
  );
}

/* Chip */
function Chip({
  data,
  sizeCss,
  ring_width,
  ring_gap,
  ring_from,
  ring_via,
  ring_to,
  seen_ring,
  ringPulse, // unused now but kept for API compatibility
  shadow,
  show_label,
  label_color,
  label_size,
  onOpen,
  buttonRef,
}: {
  data: Highlight;
  sizeCss: string;
  ring_width: number;
  ring_gap: number;
  ring_from: string;
  ring_via: string;
  ring_to: string;
  seen_ring: string;
  ringPulse: boolean;
  shadow: string;
  show_label: boolean;
  label_color: string;
  label_size: string;
  onOpen: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  const [loaded, setLoaded] = useState(false);
  const [src, setSrc] = useState(data.cover);

  // Always neutral ring (no gradient, no pulse)
  const ringStyle: React.CSSProperties = {
    background: seen_ring, // e.g., #E5E7EB
    padding: ring_width,
    borderRadius: 9999,
    display: "inline-block",
  };

  const gapStyle: React.CSSProperties = {
    background: "#ffffff",
    padding: ring_gap,
    borderRadius: 9999,
    display: "inline-block",
  };

  const imgWrap: React.CSSProperties = {
    width: sizeCss,
    height: sizeCss,
    borderRadius: "50%",
    overflow: "hidden",
    boxShadow: shadow,
    display: "block",
    background: "#fff",
    position: "relative",
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      // removed hover/active scaling to match the static look
      className="shrink-0 snap-start outline-none focus-visible:ring-2 focus-visible:ring-black/10"
      style={{ width: sizeCss }}
      aria-label={`Open ${data.name}`}
    >
      <div className="flex flex-col items-center">
        <span style={ringStyle}>
          <span style={gapStyle}>
            <span style={imgWrap}>
              {!loaded && (
                <span
                  className="skeleton absolute inset-0"
                  aria-hidden="true"
                  style={{ borderRadius: "50%" }}
                />
              )}
              <img
                src={src}
                alt={data.name}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => {
                  setLoaded(true);
                  // Plain white circle with initial (no gradient)
                  setSrc(
                    "data:image/svg+xml;utf8," +
                      encodeURIComponent(
                        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                          <rect fill='#ffffff' width='100' height='100' rx='50' ry='50'/>
                          <text x='50' y='58' text-anchor='middle' font-size='44' fill='#111827' font-family='system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'>
                            ${(data.name || "?").charAt(0).toUpperCase()}
                          </text>
                        </svg>`
                      )
                  );
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  display: "block",
                }}
              />
            </span>
          </span>
        </span>

        {show_label && (
          <span
            className={`mt-2 ${label_size} text-center truncate w-full`}
            style={{ color: label_color, maxWidth: `calc(${sizeCss} + 8px)` }}
            title={data.name}
          >
            {data.name}
          </span>
        )}
      </div>
    </button>
  );
}

/* Lightbox (unchanged) */
function Lightbox({
  name,
  images,
  slide,
  setSlide,
  onClose,
  backdrop,
  navBg,
  navColor,
  dots = true,
}: {
  name: string;
  images: string[];
  slide: number;
  setSlide: (n: number) => void;
  onClose: () => void;
  backdrop: string;
  navBg: string;
  navColor: string;
  dots?: boolean;
}) {
  const startX = useRef<number | null>(null);
  const max = images.length - 1;

  useEffect(() => {
    const i1 = new Image();
    const i2 = new Image();
    i1.src = images[(slide + 1) % images.length];
    i2.src = images[(slide - 1 + images.length) % images.length];
  }, [slide, images]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3"
      style={{ background: backdrop }}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} story viewer`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchMove={(e) => {
        if (startX.current == null) return;
        const dx = e.touches[0].clientX - startX.current;
        if (dx > 50) {
          setSlide(slide - 1);
          startX.current = null;
        } else if (dx < -50) {
          setSlide(slide + 1);
          startX.current = null;
        }
      }}
      onTouchEnd={() => (startX.current = null)}
    >
      <div className="relative w-full max-w-xl">
        <button
          className="absolute -top-10 right-0 md:-top-12 rounded-full px-3 py-1 text-sm font-semibold"
          style={{ background: navBg, color: navColor }}
          onClick={onClose}
        >
          Close ✕
        </button>

        <div className="relative overflow-hidden rounded-xl bg-black/5">
          <img
            src={images[slide]}
            alt={`${name} – ${slide + 1}`}
            className="block w-full h-[64vh] md:h-[70vh] object-contain bg-white"
            draggable={false}
          />

          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 font-bold"
            style={{ background: navBg, color: navColor }}
            onClick={() => setSlide(slide - 1)}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 font-bold"
            style={{ background: navBg, color: navColor }}
            onClick={() => setSlide(slide + 1)}
            aria-label="Next"
          >
            ›
          </button>

          {dots && (
            <div className="absolute inset-x-0 top-2 flex justify-center gap-1.5">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: idx === slide ? 28 : 10,
                    background:
                      idx === slide
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 text-center text-white/90">
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs opacity-80">
            {slide + 1} / {max + 1}
          </div>
        </div>
      </div>
    </div>
  );
}
