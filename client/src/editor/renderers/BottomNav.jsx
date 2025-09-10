// client/src/editor/renderers/BottomNav.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/* ---------- helpers ---------- */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setIsMobile(m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, [breakpoint]);
  return isMobile;
}

function useCartCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const compute = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCount(cart.reduce((n, i) => n + (i.qty || 1), 0));
      } catch {
        setCount(0);
      }
    };
    const rerun = () => compute();
    compute();
    window.addEventListener("cart:add", rerun);
    window.addEventListener("cart:update", rerun);
    window.addEventListener("cart:remove", rerun);
    window.addEventListener("cart:clear", rerun);
    window.addEventListener("storage", rerun);
    return () => {
      window.removeEventListener("cart:add", rerun);
      window.removeEventListener("cart:update", rerun);
      window.removeEventListener("cart:remove", rerun);
      window.removeEventListener("cart:clear", rerun);
      window.removeEventListener("storage", rerun);
    };
  }, []);
  return count;
}

const fire = (name, detail) =>
  window.dispatchEvent(new CustomEvent(name, { detail }));

/* ---------- Inline SVG icons (no external font needed) ---------- */
function SvgIcon({ id, className }) {
  const common = {
    stroke: "currentColor",
    fill: "none",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (id === "home")
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...common} d="M3 10.5 12 3l9 7.5" />
        <path {...common} d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" />
        <path {...common} d="M9 21v-6h6v6" />
      </svg>
    );
  if (id === "search")
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle {...common} cx="11" cy="11" r="7" />
        <path {...common} d="M20 20l-3.5-3.5" />
      </svg>
    );
  if (id === "cart")
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          {...common}
          d="M3 4h2l2.2 10.4A2 2 0 0 0 9.2 16h6.9a2 2 0 0 0 2-1.6L20 8H6"
        />
        <circle cx="9.5" cy="20" r="1.6" fill="currentColor" />
        <circle cx="16.5" cy="20" r="1.6" fill="currentColor" />
      </svg>
    );
  // account
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        {...{
          stroke: "currentColor",
          fill: "none",
          strokeWidth: 1.8,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"
      />
      <path
        {...{
          stroke: "currentColor",
          fill: "none",
          strokeWidth: 1.8,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        d="M3.5 21a8.5 8.5 0 0 1 17 0"
      />
    </svg>
  );
}

/* ---------- desktop “links” panel ---------- */
function LinksFooter({ s }) {
  const links = Array.isArray(s.desktop_footer_links)
    ? s.desktop_footer_links
    : [];
  const getLabel = (it) => it?.label ?? it?.title ?? "Link";
  const getHref = (it) => it?.href ?? it?.url ?? "#";

  return (
    <section
      className="w-full"
      style={{ background: s.desktop_footer_background_color }}
      aria-label="Desktop footer"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3
              className="text-base font-semibold"
              style={{ color: s.desktop_footer_title_color }}
            >
              {s.desktop_footer_about_us_title || "About Us"}
            </h3>
            <p
              className="mt-2 text-sm leading-6 whitespace-pre-line"
              style={{ color: s.desktop_footer_text_color }}
            >
              {s.desktop_footer_about_us_content ||
                "Welcome to our store! We're here to bring you quality products and services with convenience, care, and trust."}
            </p>
          </div>
          <div>
            <h3
              className="text-base font-semibold"
              style={{ color: s.desktop_footer_title_color }}
            >
              {s.desktop_footer_links_title || "Links"}
            </h3>
            <ul className="mt-2 space-y-2">
              {links.length ? (
                links.map((it, i) => (
                  <li key={i}>
                    <a
                      href={getHref(it)}
                      className="text-sm hover:underline"
                      style={{ color: s.desktop_footer_link_color }}
                    >
                      {getLabel(it)}
                    </a>
                  </li>
                ))
              ) : (
                <li
                  className="text-sm opacity-60"
                  style={{ color: s.desktop_footer_text_color }}
                >
                  No links added yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- main component ---------- */
export default function BottomNav({ settings = {} }) {
  const s = settings || {};

  // settings
  const {
    visibility = "all",

    // mobile bar
    footer_background_color = "#ffffff",
    footer_text_color = "#4b5563",
    footer_text_active_color = "#030712",

    // desktop footer panel
    show_desktop_footer = true,
    show_desktop_footer_in_mobile_too = false,
    desktop_footer_background_color = "#f3f4f6",
    desktop_footer_title_color = "#111827",
    desktop_footer_text_color = "#6b7280",
    desktop_footer_link_color = "#111827",
    desktop_footer_about_us_title = "About Us",
    desktop_footer_about_us_content = "",
    desktop_footer_links_title = "Links",
    desktop_footer_links = [],

    custom_css = null,
  } = s;

  // hooks
  const isMobile = useIsMobile();
  const cartCount = useCartCount();
  const navRef = useRef(null);

  const items = useMemo(
    () => [
      {
        key: "home",
        onClick: () => {
          fire("nav:home");
          try {
            if (window?.location) window.location.href = "/";
          } catch { /* empty */ }
        },
        isActive: () =>
          window?.location?.pathname === "/" ||
          window?.location?.pathname === "/home",
      },
      {
        key: "search",
        onClick: () => fire("search:open"),
        isActive: () => false,
      },
      { key: "cart", onClick: () => fire("cart:open"), isActive: () => false },
      {
        key: "account",
        onClick: () => fire("account:open"),
        isActive: () => false,
      },
    ],
    []
  );

  /* reserve space beneath the fixed bar on the real scroll container */
  useLayoutEffect(() => {
    const restore = () => {
      if (typeof document === "undefined") return;
      const scrollEl =
        document.querySelector("[data-scroll-container]") ||
        document.scrollingElement ||
        document.body;
      document.documentElement.style.removeProperty("--bottom-nav-height");
      scrollEl.style.paddingBottom = "";
    };

    if (!isMobile) {
      restore();
      return;
    }

    const el = navRef.current;
    if (!el || typeof document === "undefined") return;

    const setPad = () => {
      const h = el.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty(
        "--bottom-nav-height",
        `${h}px`
      );
      const scrollEl =
        document.querySelector("[data-scroll-container]") ||
        document.scrollingElement ||
        document.body;
      scrollEl.style.paddingBottom =
        "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + 8px)";
    };

    setPad();
    window.addEventListener("resize", setPad);
    const ro = new (window.ResizeObserver ||
      class {
        observe() {}
        disconnect() {}
      })(setPad);
    try {
      ro.observe(el);
    } catch { /* empty */ }

    return () => {
      window.removeEventListener("resize", setPad);
      try {
        ro.disconnect();
      } catch { /* empty */ }
      restore();
    };
  }, [isMobile, cartCount]);

  // visibility
  const hiddenByVisibility =
    (visibility === "desktop" && isMobile) ||
    (visibility === "mobile" && !isMobile);
  if (hiddenByVisibility) return null;

  /* ---------- MOBILE ICON-ONLY BAR (inline SVGs, full width) ---------- */
  const MobileBar = (
    <nav
      ref={navRef}
      aria-label="Bottom navigation"
      style={{
        position: "fixed",
        zIndex: 1000,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        maxWidth: "100%",
        borderTop: "1px solid rgba(100,116,139,0.15)",
        background: footer_background_color,
        WebkitTapHighlightColor: "transparent",
        boxSizing: "border-box",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          padding: "10px 14px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
          color: footer_text_color,
          margin: 0,
          maxWidth: "100%",
        }}
      >
        {items.map((it) => {
          const active = it.isActive();
          const color = active ? footer_text_active_color : footer_text_color;
          return (
            <button
              key={it.key}
              onClick={it.onClick}
              aria-label={it.key}
              className="relative flex items-center justify-center"
              style={{
                color,
                height: 44, // tap target
                width: 44,
                borderRadius: 10,
                outline: "none",
              }}
            >
              {/* INLINE SVG ICON (always visible) */}
              <SvgIcon id={it.key} className="w-[22px] h-[22px]" />

              {/* Cart badge */}
              {it.key === "cart" && cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center rounded-full bg-rose-600 text-white"
                  style={{
                    minWidth: 18,
                    height: 18,
                    padding: "0 4px",
                    fontSize: 10,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );

  const showLinksPanel =
    !!show_desktop_footer && (!isMobile || !!show_desktop_footer_in_mobile_too);

  return (
    <>
      {showLinksPanel && (
        <LinksFooter
          s={{
            desktop_footer_background_color,
            desktop_footer_title_color,
            desktop_footer_text_color,
            desktop_footer_link_color,
            desktop_footer_about_us_title,
            desktop_footer_about_us_content,
            desktop_footer_links_title,
            desktop_footer_links,
          }}
        />
      )}

      {/* Spacer so last content never hides behind the fixed bar (mobile only) */}
      {isMobile && (
        <div
          className="md:hidden"
          style={{ height: "var(--bottom-nav-height)" }}
        />
      )}

      {/* Mobile bar only on mobile */}
      {isMobile ? MobileBar : null}

      {custom_css ? <style>{custom_css}</style> : null}
    </>
  );
}
