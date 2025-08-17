import { useEffect, useState } from "react";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const m = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

export default function BottomNav({ settings = {} }) {
  const {
    // mobile footer
    footer_type = "blur_float", // "blur_float" | "blur_bottom" | "solid"
    footer_background_color = "rgb(30,41,59)",
    footer_text_color = "rgb(248,250,252)",
    footer_text_active_color = "rgb(255,255,255)",

    // desktop
    show_desktop_footer = false,
    show_desktop_footer_in_mobile_too = false,
    desktop_footer_background_color = "#f3f4f6",
    desktop_footer_text_color = "#6b7280",

    // preview hint (CanvasPreview injects this)
    __preview = false,
  } = settings;

  const isMobile = useIsMobile();

  const items = [
    { key: "home", label: "Home" },
    { key: "search", label: "Search" },
    { key: "cart", label: "Cart" },
    { key: "account", label: "Account" },
  ];

  /* --------------------- DESKTOP BRANCH --------------------- */
  if (!isMobile) {
    // only show desktop footer if toggled on
    if (!show_desktop_footer) return null;

    return (
      <div
        className="rounded-2xl p-3"
        style={{ background: desktop_footer_background_color }}
      >
        <div
          className="flex items-center justify-center gap-6 text-sm"
          style={{ color: desktop_footer_text_color }}
        >
          {items.map((it) => (
            <span key={it.key} className="px-3 py-1">
              {it.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------------- MOBILE BRANCH --------------------- */
  // if desktop footer is enabled but NOT allowed on mobile — hide footer on mobile
  if (show_desktop_footer && !show_desktop_footer_in_mobile_too) {
    return null;
  }

  // EDITOR PREVIEW: simulate bottom pill without overlaying the editor UI
  if (__preview) {
    return (
      <div className="sticky bottom-4 z-10 flex justify-center">
        <div
          className={`flex items-center gap-6 rounded-2xl px-6 py-3 shadow ${
            footer_type === "solid" ? "" : "backdrop-blur"
          }`}
          style={{ background: footer_background_color, color: footer_text_color }}
        >
          {items.map((it) => (
            <span
              key={it.key}
              className="text-sm opacity-90"
              style={{ color: footer_text_color }}
            >
              {it.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // STOREFRONT (real page): fixed pill
  return (
    <nav
      className={`pointer-events-none fixed left-1/2 -translate-x-1/2 ${
        footer_type === "blur_bottom" ? "bottom-4" : "bottom-6"
      } z-30`}
      aria-label="Bottom navigation"
    >
      <div
        className={`pointer-events-auto flex items-center gap-6 rounded-2xl px-6 py-3 shadow-lg ${
          footer_type === "solid" ? "" : "backdrop-blur"
        }`}
        style={{ background: footer_background_color, color: footer_text_color }}
      >
        {items.map((it) => (
          <button
            key={it.key}
            className="text-sm opacity-90 hover:opacity-100"
            style={{ color: footer_text_color }}
          >
            {it.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
