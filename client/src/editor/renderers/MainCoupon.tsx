import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import clsx from "clsx";

type CouponItem = {
  enabled?: boolean;
  badge_text?: string;
  badge_bg?: string;
  badge_color?: string;
  title?: string;
  subtitle?: string;
  href?: string;
};

type Settings = {
  enabled?: boolean;

  // header
  display_title?: boolean;
  title?: string;
  title_color?: string;
  align?: "left" | "center" | "right";

  // items
  items?: CouponItem[];

  // card UI
  card_radius?: number;
  card_border?: boolean;
  card_border_color?: string;
  card_text_color?: string;
  card_subtle_text_color?: string;
  card_bg?: string;
  card_shadow?: boolean;
  card_height_px?: number;
  card_horizontal_pad_px?: number;
  gap_px?: number;

  // arrows
  show_arrows_desktop?: boolean;
  show_arrows_mobile?: boolean; // mobile overlay arrows (now default OFF)
  arrows_bg?: string;
  arrows_fg?: string;

  // rail centering
  center_rail_ends?: boolean;

  // section
  section_background_color?: string;
  section_top_margin?: string;
  section_bottom_margin?: string;

  custom_css?: string | null;
  visibility?: "all" | "desktop" | "mobile";
};

export default function MainCoupon({ settings }: { settings: Settings }) {
  const s = settings || {};
  if (s.enabled === false) return null;

  const items = useMemo(
    () => (s.items || []).filter((i) => i?.enabled !== false),
    [s.items]
  );

  const align =
    s.align === "center" ? "center" : s.align === "right" ? "right" : "left";
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";

  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  // ✅ collect refs for all cards (to detect current page on mobile)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setCardRef = (idx: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[idx] = el;
    if (idx === 0 && el) firstCardRef.current = el;
  };

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [padding, setPadding] = useState({ left: 0, right: 0 });

  // ✅ active card index (for "1/5" and dots)
  const [activeIdx, setActiveIdx] = useState(0);

  const GAP = s.gap_px ?? 12;
  const fade = 18;

  const computeArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  const computeCenterPads = useCallback(() => {
    const wrap = wrapRef.current;
    const first = firstCardRef.current;
    if (s.center_rail_ends && align === "center" && wrap && first) {
      const containerW = wrap.clientWidth;
      const firstW = first.getBoundingClientRect().width;
      const side = Math.max(
        0,
        Math.round(containerW / 2 - firstW / 2 - GAP / 2)
      );
      setPadding({ left: side, right: side });
    } else {
      setPadding({ left: 0, right: 0 });
    }
  }, [GAP, align, s.center_rail_ends]);

  useEffect(() => {
    computeCenterPads();
    computeArrows();

    const el = railRef.current;
    if (!el) return;

    const onScroll = () => computeArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      computeCenterPads();
      computeArrows();
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [computeCenterPads, computeArrows]);

  // ✅ which card is most visible (mobile pager)
  useEffect(() => {
    const root = railRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the entry with the highest intersection ratio
        let max = -1;
        let idx = activeIdx;
        entries.forEach((e) => {
          const i = Number((e.target as HTMLElement).dataset.idx || 0);
          if (e.intersectionRatio > max) {
            max = e.intersectionRatio;
            idx = i;
          }
        });
        setActiveIdx(idx);
      },
      {
        root,
        threshold: [0.25, 0.5, 0.75, 1],
      }
    );

    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
    // re-run if items length changes
  }, [items.length]);

  const scrollBy = (dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.8, 520);
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy("right");
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy("left");
    }
  };

  const showDesktopArrows = s.show_arrows_desktop ?? true;
  // ✅ default OFF on mobile (screenshot design uses pager instead)
  const showMobileArrows = s.show_arrows_mobile ?? false;

  return (
    <section
      style={{
        background: s.section_background_color || "#fff",
        marginTop: s.section_top_margin || "0rem",
        marginBottom: s.section_bottom_margin || "1rem",
      }}
      className="w-full"
    >
      <div ref={wrapRef} className="mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl">
        {/* Header */}
        {(s.display_title ?? true) && (
          <div
            className={clsx(
              "mb-2 grid items-center",
              align === "center"
                ? "grid-cols-[1fr_auto_1fr]"
                : "grid-cols-[auto_1fr_auto]"
            )}
          >
            {align === "center" ? <div /> : null}

            <h2
              className={clsx(
                "text-lg sm:text-xl font-semibold tracking-tight",
                alignClass
              )}
              style={{ color: s.title_color || "#111827" }}
            >
              {s.title || "Deals for you"}
            </h2>

            {/* Desktop arrows (header, right) */}
            <div
              className={clsx(
                "justify-self-end shrink-0 gap-2",
                showDesktopArrows ? "hidden md:flex" : "hidden"
              )}
            >
              <ArrowBtn
                dir="left"
                onClick={() => scrollBy("left")}
                disabled={!canLeft}
                bg={s.arrows_bg}
                fg={s.arrows_fg}
              />
              <ArrowBtn
                dir="right"
                onClick={() => scrollBy("right")}
                disabled={!canRight}
                bg={s.arrows_bg}
                fg={s.arrows_fg}
              />
            </div>
          </div>
        )}

        {/* Rail + (optional) MOBILE overlay arrows */}
        <div className="relative">
          <div
            ref={railRef}
            role="listbox"
            aria-label="Available deals"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className={clsx(
              "overflow-x-auto overscroll-x-contain no-scrollbar",
              "scroll-smooth focus:outline-none"
            )}
            style={
              {
                WebkitOverflowScrolling: "touch",
                // ✅ stronger snapping: one full card per screen on mobile
                scrollSnapType: "x mandatory",
                paddingBottom: 2,
                paddingLeft: padding.left,
                paddingRight: padding.right,
                maskImage: `linear-gradient(to right, transparent 0, black ${fade}px, black calc(100% - ${fade}px), transparent 100%)`,
                WebkitMaskImage: `linear-gradient(to right, transparent 0, black ${fade}px, black calc(100% - ${fade}px), transparent 100%)`,
              } as React.CSSProperties
            }
          >
            <div className="flex" style={{ gap: `${GAP}px` }}>
              {items.map((it, idx) => {
                const Tag: any = it.href ? "a" : "div";
                const isActive = idx === activeIdx;
                return (
                  <Tag
                    key={idx}
                    ref={setCardRef(idx)}
                    data-idx={idx}
                    href={it.href}
                    role="option"
                    aria-label={`${it.title ?? "Offer"}`}
                    className={clsx(
                      // ✅ relative for in-card pager; full-width on mobile
                      "relative flex items-center shrink-0 select-none",
                      "w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] md:w-auto",
                      // ✅ center snap on mobile, start on desktop
                      "[scroll-snap-align:center] md:[scroll-snap-align:start]",
                      s.card_border ? "border" : "border border-transparent",
                      s.card_shadow ? "shadow-sm" : "",
                      "transition-transform hover:-translate-y-0.5"
                    )}
                    style={{
                      height: (s.card_height_px ?? 72) + "px",
                      borderColor: s.card_border
                        ? s.card_border_color || "#E5E7EB"
                        : "transparent",
                      background: s.card_bg || "#ffffff",
                      paddingLeft: (s.card_horizontal_pad_px ?? 16) + "px",
                      // keep a bit of breathing room near the pager on mobile
                      paddingRight: (s.card_horizontal_pad_px ?? 16) + "px",
                      borderRadius: (s.card_radius ?? 18) + "px",
                    }}
                  >
                    <span
                      className="inline-grid place-items-center text-[10px] font-extrabold uppercase tracking-wide"
                      style={{
                        background: it.badge_bg || "#F97316",
                        color: it.badge_color || "#ffffff",
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                      }}
                    >
                      {it.badge_text || "DEAL\nOF DAY"}
                    </span>

                    <div className="ml-3 min-w-0 whitespace-nowrap">
                      <div
                        className="text-sm sm:text-[15px] font-extrabold tracking-tight truncate"
                        style={{ color: s.card_text_color || "#111827" }}
                      >
                        {it.title || ""}
                      </div>
                      {it.subtitle ? (
                        <div
                          className="text-[11px] sm:text-xs uppercase tracking-wide truncate"
                          style={{
                            color: s.card_subtle_text_color || "#6B7280",
                          }}
                        >
                          {it.subtitle}
                        </div>
                      ) : null}
                    </div>

                    {/* ✅ Mobile pager inside the active card (matches screenshot) */}
                    {isActive && (
                      <MobilePager index={activeIdx} total={items.length} />
                    )}
                  </Tag>
                );
              })}
            </div>
          </div>

          {/* Optional: Mobile overlay arrows (kept, but default OFF now) */}
          {showMobileArrows && (
            <div
              className="md:hidden absolute inset-y-0 left-0 right-0 pointer-events-none"
              aria-hidden
            >
              <div className="absolute left-1 top-1/2 -translate-y-1/2">
                <ArrowBtn
                  dir="left"
                  onClick={() => scrollBy("left")}
                  disabled={!canLeft}
                  bg={s.arrows_bg}
                  fg={s.arrows_fg}
                  className="pointer-events-auto shadow-sm ring-1 ring-black/5"
                />
              </div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <ArrowBtn
                  dir="right"
                  onClick={() => scrollBy("right")}
                  disabled={!canRight}
                  bg={s.arrows_bg}
                  fg={s.arrows_fg}
                  className="pointer-events-auto shadow-sm ring-1 ring-black/5"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {s.custom_css ? (
        <style dangerouslySetInnerHTML={{ __html: String(s.custom_css) }} />
      ) : null}
    </section>
  );
}

/* ———————————————————————————————————————————————— */
/* Small helper for arrow buttons                    */
/* ———————————————————————————————————————————————— */
function ArrowBtn({
  dir,
  onClick,
  disabled,
  bg,
  fg,
  className,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  bg?: string;
  fg?: string;
  className?: string;
}) {
  return (
    <button
      aria-label={dir === "left" ? "Previous" : "Next"}
      onClick={onClick}
      disabled={!!disabled}
      className={clsx(
        "h-9 w-9 rounded-full grid place-items-center transition-opacity",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      style={{ background: bg || "#F3F4F6", color: fg || "#111827" }}
    >
      {dir === "left" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6z" />
        </svg>
      )}
    </button>
  );
}

/* ———————————————————————————————————————————————— */
/* Mobile pager (1/5 + three tiny dots)              */
/* ———————————————————————————————————————————————— */
function MobilePager({ index, total }: { index: number; total: number }) {
  // show compact 3-dot style like the screenshot
  const slot = index === 0 ? 0 : index === total - 1 ? 2 : 1; // 0: start, 1: middle, 2: end
  return (
    <div
      className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 text-right pointer-events-none select-none"
      role="status"
      aria-live="polite"
    >
      <div className="text-[12px] font-semibold" style={{ color: "#F97316" }}>
        {index + 1}/{total}
      </div>
      <div className="mt-0.5 flex items-center justify-end gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={clsx(
              "inline-block rounded-full",
              "w-1.5 h-1.5",
              i === slot ? "bg-[#F97316]" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}
