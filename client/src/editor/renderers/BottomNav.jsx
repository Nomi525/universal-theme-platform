export default function BottomNav({ settings = {} }) {
  const {
    // MOBILE / FLOATING
    footer_type = "blur_float", // "blur_float" | "blur_bottom" | "solid"
    footer_background_color = "rgb(30,41,59)",
    footer_text_color = "rgb(248,250,252)",
    footer_text_active_color = "rgb(255,255,255)",

    // DESKTOP
    show_desktop_footer = false,
    show_desktop_footer_in_mobile_too = true, // allow mobile pill in preview when desktop footer is ON
    desktop_footer_background_color = "#f3f4f6",
    desktop_footer_text_color = "#6b7280",

    // PREVIEW HINT (set by CanvasPreview only)
    __preview = false,
  } = settings;

  const items = [
    { key: "home", label: "Home" },
    { key: "search", label: "Search" },
    { key: "cart", label: "Cart" },
    { key: "account", label: "Account" },
  ];

  /* ----------------------------- DESKTOP INLINE ----------------------------- */
  if (show_desktop_footer) {
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

        {/* If editor wants to ALSO preview mobile pill while desktop is enabled */}
        {__preview && show_desktop_footer_in_mobile_too && (
          <div className="mt-3 flex justify-center">
            <div
              className="flex items-center gap-6 rounded-2xl px-6 py-3 shadow"
              style={{
                background: footer_background_color,
                color: footer_text_color,
              }}
            >
              {items.map((it) => (
                <span key={it.key} className="text-sm opacity-90">
                  {it.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* --------------------------- PREVIEW (no desktop) -------------------------- */
  if (__preview) {
    // Desktop footer is OFF → show a contained (non-fixed) pill so it behaves like other blocks
    return (
      <div className="flex justify-center py-3">
        <div
          className="flex items-center gap-6 rounded-2xl px-6 py-3 shadow"
          style={{ background: footer_background_color, color: footer_text_color }}
        >
          {items.map((it) => (
            <span key={it.key} className="text-sm opacity-90">
              {it.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* ------------------------- STOREFRONT (REAL MOBILE) ------------------------ */
  return (
    <nav
      className={`pointer-events-none fixed left-1/2 -translate-x-1/2 ${
        footer_type === "blur_bottom" ? "bottom-4" : "bottom-6"
      } z-30`}
      aria-label="Bottom navigation"
    >
      <div
        className="pointer-events-auto flex items-center gap-6 rounded-2xl px-6 py-3 shadow-lg"
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
