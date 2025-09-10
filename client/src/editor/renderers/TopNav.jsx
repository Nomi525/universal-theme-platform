// client/src/editor/renderers/TopNav.jsx
import cn from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";

/* ----------------- helpers ----------------- */

const radiusClass = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

const visibilityClass = (v) => {
  switch (v) {
    case "desktop":
      return "hidden md:block";
    case "mobile":
      return "block md:hidden";
    default:
      return "";
  }
};

/** Detect Editor vs Storefront. */
function useIsEditorPage() {
  const [isEditor, setIsEditor] = useState(false);
  useEffect(() => {
    try {
      const p = window.location.pathname || "";
      const q = window.location.search || "";
      const inEditor =
        /(^|\/)(editor|admin)(\/|$)/i.test(p) ||
        /[?&](editor|preview)=1\b/i.test(q);
      setIsEditor(inEditor);
    } catch {
      setIsEditor(false);
    }
  }, []);
  return isEditor;
}

function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [active]);
}

/** Responsive breakpoint hook: returns true when viewport >= md. */
function useIsMdUp() {
  const [mdUp, setMdUp] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setMdUp(mq.matches);
    update();
    mq.addEventListener
      ? mq.addEventListener("change", update)
      : mq.addListener(update);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener("change", update)
        : mq.removeListener(update);
    };
  }, []);
  return mdUp;
}

/* ----------------- icons ----------------- */

/**
 * All icons accept { size=22, className, ...rest }.
 * We avoid hard-coded width/height so we can shrink on small devices.
 */
const Svg = ({ size = 22, className, children, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

const Icon = {
  menu: ({ size = 22, ...p }) => (
    <Svg size={size} {...p}>
      <path
        d="M3 6h18M3 12h18M3 18h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  ),
  search: ({ size = 22, ...p }) => (
    <Svg size={size} {...p}>
      <circle
        cx="11"
        cy="11"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 20l-3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  ),
  back: ({ size = 20, ...p }) => (
    <Svg size={size} {...p}>
      <path
        d="M15 6l-6 6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  close: ({ size = 20, ...p }) => (
    <Svg size={size} {...p}>
      <path
        d="M6 6l12 12M18 6l-12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  ),
  pin: ({ size = 20, ...p }) => (
    <Svg size={size} {...p}>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
      />
    </Svg>
  ),
  cart: ({ size = 22, ...p }) => (
    <Svg size={size} {...p}>
      <path
        d="M3 4h2l2 12h10l2-8H7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="9" cy="20" r="1.8" fill="currentColor" />
      <circle cx="17" cy="20" r="1.8" fill="currentColor" />
    </Svg>
  ),
  heart: ({ size = 18, ...p }) => (
    <Svg size={size} {...p}>
      <path
        d="M12 21s-7.5-4.35-9.5-8.6C1.4 8.9 3.2 6 6.2 6c2 0 3.1 1.1 3.8 2 0.7-0.9 1.8-2 3.8-2 3 0 4.8 2.9 3.7 6.4C19.5 16.65 12 21 12 21z"
        fill="currentColor"
      />
    </Svg>
  ),
  whatsapp: ({ size = 22, ...p }) => (
    <Svg size={size} {...p}>
      <path
        fill="currentColor"
        d="M20 3.9A10 10 0 0 0 3.9 20L3 21l3.1-.8A10 10 0 1 0 20 3.9Zm-8 1.9a7.1 7.1 0 0 1 5.1 12.2c-.9.8-2 .1-2.9-.3-2.2-.9-3.6-1.9-5-3.8-1.4-1.9-1.7-3.5-1.1-4.1.5-.6 1.2-1.5 1.9-1.3.7.1.9 1.4 1 1.7.1.4-.2.6-.4.8-.3.2-.6.5-.3 1.1.3.6 1.2 1.9 2.6 2.7.5.3.9.4 1.2.1.3-.2.9-.9 1.3-.8.3 0 .9.3 1.2.5.3.2.5.3.6.5.1.3-.1 1.1-.7 1.6-.7.6-1.6.7-2.6.5A7.1 7.1 0 0 1 12 5.8Z"
      />
    </Svg>
  ),
  user: ({ size = 22, ...p }) => (
    <Svg size={size} {...p}>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" opacity=".3" />
    </Svg>
  ),
  bagHeart: ({ size = 24, ...p }) => (
    <Svg size={size} {...p}>
      <path
        d="M7 9V7a5 5 0 0 1 10 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="9"
        width="16"
        height="11"
        rx="2"
        ry="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 14c1.4-2 5-1.2 5 1.1 0 2-2.8 3.5-5 5.4-2.2-1.9-5-3.4-5-5.4C7 12.8 10.6 12 12 14z"
        fill="currentColor"
      />
    </Svg>
  ),
};

/* ----------------- small UI bits ----------------- */

function getBrandFromSettings(s) {
  const win = typeof window !== "undefined" ? window : {};
  const name = s.brand_name || win.__STORE_NAME || "SampleStore.co";

  const subtitle =
    s.brand_subtitle ||
    s.business_category ||
    s.store_category ||
    win.__STORE_TAGLINE ||
    "Beauty"; // sensible default for demo

  return { name, subtitle };
}

const Logo = ({ type, textColor, name, subtitle }) => {
  if (type === "none") return null;

  return (
    <div className="inline-flex flex-col leading-tight min-w-0">
      <span className="font-semibold truncate" style={{ color: textColor }}>
        {name}
      </span>
      {subtitle ? (
        <span className="text-xs text-slate-500 truncate">{subtitle}</span>
      ) : null}
    </div>
  );
};

const PillSearchButton = ({ s, onOpen }) => {
  const style = {
    backgroundColor: s.desktop_search_bar_background_color || "#ffffff",
    color: s.desktop_search_bar_placeholder_text_color || "#6b7280",
    ...(s.desktop_search_bar_border
      ? {
          borderStyle: "solid",
          borderWidth: s.desktop_search_bar_border_size || "1px",
          borderColor: s.desktop_search_bar_border_color || "#e5e7eb",
        }
      : { borderWidth: 0 }),
  };

  return (
    <button
      type="button"
      className={cn(
        "hidden md:flex w-[34rem] max-w-[42vw] items-center px-4 py-2 cursor-text",
        "focus:outline-none focus:ring-2 focus:ring-slate-300/70",
        radiusClass[s.desktop_search_bar_radius || "full"]
      )}
      style={style}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      aria-label="Open search"
    >
      {s.desktop_search_bar_display_search_icon && (
        <span
          className="mr-2 opacity-80"
          style={{ color: s.desktop_search_bar_search_icon_color || "#6b7280" }}
        >
          <Icon.search />
        </span>
      )}
      <span className="w-full text-left text-sm opacity-80 truncate">
        {s.desktop_search_bar_placeholder_text || "Search products"}
      </span>
    </button>
  );
};

const IconTap = ({ label, onClick, children, color }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center justify-center px-1.5 md:px-2"
    style={{ color }}
    aria-label={label}
  >
    <div className="h-8 md:h-9 flex items-center">{children}</div>
    <span className="mt-0.5 text-[10px] md:text-[11px] leading-none md:hidden opacity-80">
      {label}
    </span>
  </button>
);

/* ----------------- dialogs ----------------- */

const SearchDialog = ({ open, onClose, placeholder }) => {
  useLockBodyScroll(open);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center p-3 sm:p-4 md:p-8"
      onMouseDown={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-5 right-0 sm:-top-6 sm:-right-6 h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center"
        >
          <Icon.close size={18} />
        </button>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 md:px-3 py-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="p-1 rounded hover:bg-slate-100 text-slate-700"
            >
              <Icon.back size={18} />
            </button>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base"
              placeholder={placeholder || "Search for categories or products"}
            />
            <span className="text-slate-600 opacity-80">
              <Icon.search size={20} />
            </span>
          </div>
          <div className="min-h-[55vh] md:min-h-[55vh]" />
        </div>
      </div>
    </div>
  );
};

const Drawer = ({ title = "Menu", open, onClose, children }) => {
  useLockBodyScroll(open);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <aside
        className="absolute left-0 top-0 h-full w-[92vw] sm:w-[85vw] max-w-sm bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="font-semibold text-sm sm:text-base">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"
            aria-label="Close"
          >
            <Icon.close size={18} />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
};

/* ----------------- main component ----------------- */

export default function TopNav({ settings = {} }) {
  const isEditor = useIsEditorPage();
  const s = settings || {};

  const mdUp = useIsMdUp();

  // Allow optional override from settings
  const sizes = useMemo(() => {
    const sm = Number(s.icon_size_sm) || 18; // small screens
    const md = Number(s.icon_size_md) || 22; // md and up
    const lg = Number(s.icon_size_lg) || 24; // for few bigger glyphs
    return { sm, md, lg };
  }, [s.icon_size_sm, s.icon_size_md, s.icon_size_lg]);

  const iconSize = mdUp ? sizes.md : sizes.sm;
  const bigIconSize = mdUp ? sizes.lg : sizes.md; // for bagHeart, cart etc

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const classes = cn(
    "w-full",
    visibilityClass(s.visibility),
    s.sticky_header ? "sticky top-0 z-40" : "",
    s.border ? "border-b border-slate-200" : ""
  );

  const rowClass = isEditor
    ? "mx-auto max-w-6xl px-3 md:px-4 py-2 md:py-3 flex items-center gap-2 md:gap-3"
    : "w-full max-w-none px-2.5 sm:px-4 md:px-6 lg:px-8 py-2 md:py-3 flex items-center gap-2 md:gap-3";

  const openSearch = () => setSearchOpen(true);

  const waHref = (() => {
    const raw = (s.whatsapp_number || "").trim();
    if (!raw) return "https://wa.me/";
    if (/^https?:\/\//i.test(raw)) return raw;
    const digits = raw.replace(/[^\d]/g, "");
    return digits ? `https://wa.me/${digits}` : "https://wa.me/";
  })();

  const textColor = s.text_color || "#111827";
  const showSearch = s.show_search !== false;
  const showCart = s.show_cart !== false;
  const showWishlist = s.show_wishlist !== false;
  const showWhatsApp = s.show_whatsapp !== false;
  const showProfile = s.show_profile !== false;

  const brand = getBrandFromSettings(s);

  return (
    <>
      <header
        className={classes}
        style={{ backgroundColor: s.background_color || "#fff" }}
      >
        <div className={rowClass}>
          {/* Left button (legacy) */}
          <div className="w-12 sm:w-16 md:w-24">
            {s.left_button && s.left_button !== "NONE" && (
              <button
                type="button"
                onClick={() => {
                  if (s.left_button === "MENU") setMenuOpen(true);
                  if (s.left_button === "SEARCH") openSearch();
                }}
                className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm px-2 py-1 rounded-md hover:bg-slate-100"
                style={{ color: textColor }}
              >
                {s.left_button === "MENU" ? (
                  <Icon.menu size={iconSize} />
                ) : s.left_button === "SEARCH" ? (
                  <Icon.search size={iconSize} />
                ) : null}
                <span className="hidden sm:inline opacity-80">
                  {s.left_button?.[0] + s.left_button?.slice(1).toLowerCase()}
                </span>
              </button>
            )}
          </div>

          {/* Logo + business category (subtitle) */}
          <div
            className={cn(
              "flex-1 flex items-center min-w-0",
              s.logo_placement === "center" ? "justify-center" : "justify-start"
            )}
          >
            <Logo
              type={s.logo_type || "default"}
              textColor={textColor}
              name={brand.name}
              subtitle={brand.subtitle}
            />
          </div>

          {/* Desktop search pill */}
          {showSearch && <PillSearchButton s={s} onOpen={openSearch} />}

          {/* Right: icon row */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {showSearch && (
              <IconTap color={textColor} label="Search" onClick={openSearch}>
                <Icon.search size={iconSize} />
              </IconTap>
            )}

            {(showCart || showWishlist) && (
              <IconTap
                color={textColor}
                label="Cart/Wishlist"
                onClick={() => (window.location.href = "/cart")}
              >
                <Icon.bagHeart size={bigIconSize} />
              </IconTap>
            )}

            {showWhatsApp && (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="no-underline"
              >
                <IconTap color={textColor} label="WhatsApp">
                  <Icon.whatsapp size={iconSize} />
                </IconTap>
              </a>
            )}

            {showProfile && (
              <IconTap
                color={textColor}
                label="Profile"
                onClick={() => (window.location.href = "/account")}
              >
                <Icon.user size={iconSize} />
              </IconTap>
            )}

            {s.right_button && s.right_button !== "NONE" && (
              <IconTap
                color={textColor}
                label={
                  s.right_button?.[0] + s.right_button?.slice(1).toLowerCase()
                }
                onClick={() => {
                  if (s.right_button === "MENU") setMenuOpen(true);
                  if (s.right_button === "SEARCH") openSearch();
                }}
              >
                {s.right_button === "MENU" ? (
                  <Icon.menu size={iconSize} />
                ) : s.right_button === "SEARCH" ? (
                  <Icon.search size={iconSize} />
                ) : null}
              </IconTap>
            )}
          </div>
        </div>
      </header>

      {/* Menu drawer */}
      <Drawer title="Menu" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <nav className="p-2 space-y-1 text-sm">
          {Array.isArray(s.menu_items) &&
            s.menu_items.map((it, i) => (
              <a
                key={i}
                href={it?.href || "#"}
                className="block rounded px-3 py-2 hover:bg-slate-50"
              >
                {it?.label || "Link"}
              </a>
            ))}

          {s.display_categories_on_menu && (
            <div className="mt-3 border-t pt-3">
              <div className="px-3 py-2 font-semibold text-slate-700">
                Categories
              </div>
              <div className="px-3 py-2 text-slate-500">…</div>
            </div>
          )}
        </nav>
      </Drawer>

      {/* Search dialog */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        placeholder={s.desktop_search_bar_placeholder_text || "Search products"}
      />

      {s.custom_css ? <style>{s.custom_css}</style> : null}
    </>
  );
}
