// client/src/editor/renderers/BottomNav.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";

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

const Icon = ({ name, className }) => (
  <i className={cn(name, className)} aria-hidden="true" />
);

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

  // read settings first (not hooks)
  const {
    visibility = "all",

    // mobile
    footer_type = "blur_float",
    footer_background_color = "#ffffff",
    footer_text_color = "#4b5563",
    footer_text_active_color = "#030712",

    // desktop links panel
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

    // icons
    home_icon = "ri-home-5-line",
    search_icon = "ri-search-line",
    cart_icon = "ri-shopping-cart-line",
    account_icon = "ri-user-line",

    custom_css = null,
  } = s;

  // hooks — always in the same order
  const isMobile = useIsMobile();
  const cartCount = useCartCount();
  const navRef = useRef(null);

  const items = useMemo(
    () => [
      {
        key: "home",
        label: "Home",
        icon: home_icon,
        onClick: () => {
          fire("nav:home");
          try {
            if (window?.location) window.location.href = "/";
          } catch {
            /* empty */
          }
        },
        isActive: () =>
          window?.location?.pathname === "/" ||
          window?.location?.pathname === "/home",
      },
      {
        key: "search",
        label: "Search",
        icon: search_icon,
        onClick: () => fire("search:open"),
        isActive: () => false,
      },
      {
        key: "cart",
        label: "Cart",
        icon: cart_icon,
        onClick: () => fire("cart:open"),
        isActive: () => false,
      },
      {
        key: "account",
        label: "Account",
        icon: account_icon,
        onClick: () => fire("account:open"),
        isActive: () => false,
      },
    ],
    [home_icon, search_icon, cart_icon, account_icon]
  );

  useLayoutEffect(() => {
    // reserve space under fixed mobile bar
    if (!isMobile) {
      if (typeof document !== "undefined") {
        document.body.style.paddingBottom = "";
        document.documentElement.style.removeProperty("--bottom-nav-height");
      }
      return;
    }
    const el = navRef.current;
    if (!el || typeof document === "undefined") return;
    const setPad = () => {
      const h = el.offsetHeight || 0;
      document.documentElement.style.setProperty(
        "--bottom-nav-height",
        `${h}px`
      );
      document.body.style.paddingBottom = `calc(var(--bottom-nav-height) + 8px)`;
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
    } catch {
      /* empty */
    }
    return () => {
      window.removeEventListener("resize", setPad);
      try {
        ro.disconnect();
      } catch {
        /* empty */
      }
    };
  }, [isMobile, footer_type, cartCount]);

  // visibility after hooks
  const hiddenByVisibility =
    (visibility === "desktop" && isMobile) ||
    (visibility === "mobile" && !isMobile);
  if (hiddenByVisibility) return null;

  // mobile bottom nav (only shown on mobile)
  const isDock = footer_type === "blur_bottom" || footer_type === "solid";
  const MobileBar = (
    <nav
      ref={navRef}
      style={
        isDock
          ? {
              position: "fixed",
              zIndex: 1000,
              left: 0,
              right: 0,
              bottom: "env(safe-area-inset-bottom)",
            }
          : {
              position: "fixed",
              zIndex: 1000,
              left: "max(12px, env(safe-area-inset-left))",
              right: "max(12px, env(safe-area-inset-right))",
              bottom: "calc(env(safe-area-inset-bottom) + 12px)",
            }
      }
      aria-label="Bottom navigation"
    >
      <div
        className={cn(
          "flex items-center justify-around shadow-lg",
          isDock ? "rounded-none border-t" : "rounded-2xl"
        )}
        style={{
          background: footer_background_color,
          color: footer_text_color,
          width: "100%",
          maxWidth: isDock ? undefined : 560,
          margin: "0 auto",
          padding: isDock ? "10px 10px" : "10px 18px",
          paddingBottom: isDock
            ? "calc(10px + env(safe-area-inset-bottom))"
            : "10px",
          backdropFilter: footer_type.includes("blur")
            ? "saturate(180%) blur(12px)"
            : undefined,
        }}
      >
        {items.map((it) => {
          const active = it.isActive();
          const color = active ? footer_text_active_color : footer_text_color;
          return (
            <button
              key={it.key}
              onClick={it.onClick}
              className="relative flex flex-col items-center gap-1 px-3 py-1"
              style={{ color }}
              aria-label={it.label}
            >
              <Icon name={it.icon} className="text-xl leading-none" />
              <span className={cn("text-xs", active ? "font-semibold" : "")}>
                {it.label}
              </span>
              {it.key === "cart" && cartCount > 0 && (
                <span className="absolute -top-1.5 right-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
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

      {/* show the icon bar ONLY on mobile */}
      {isMobile ? MobileBar : null}

      {custom_css ? <style>{custom_css}</style> : null}
    </>
  );
}
