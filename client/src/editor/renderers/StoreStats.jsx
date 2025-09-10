import cn from "classnames";

/** Tiny SVGs with fixed cheerful colors (like your reference) */
const I = {
  star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#F59E0B"
        d="M12 2l2.95 6 6.6.9-4.78 4.6L18 21l-6-3.2L6 21l1.23-7.5L2.45 8.9l6.6-.9L12 2z"
      />
    </svg>
  ),
  bag: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#7C3AED"
        d="M6 7h12l1 13H5L6 7zm3-2a3 3 0 016 0h-2a1 1 0 10-2 0H9z"
      />
    </svg>
  ),
  heart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#DC2626"
        d="M12 21s-7.5-4.35-9.5-8.1C.9 9.38 2.5 6 6 6c2 0 3.2 1.1 4 2 0 0 1-2 4-2 3.5 0 5.1 3.38 3.5 6.9C19.5 16.65 12 21 12 21z"
      />
    </svg>
  ),
  // generic dot if a custom Remix icon class is missing
  dot: () => (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
      <circle cx="4" cy="4" r="4" fill="#111827" />
    </svg>
  ),
};

/** Divider */
const Divider = ({ color }) => (
  <span
    aria-hidden="true"
    className="hidden md:block h-5 w-px"
    style={{ backgroundColor: color || "#E5E7EB" }}
  />
);

/** Resolve live metrics from settings or a window global */
function useMetrics(s) {
  const fallback = {
    rating_value: s.rating_value ?? 4.42,
    rating_count: s.rating_count ?? 92,
    orders_value: s.orders_value ?? "1.5k",
    loves_value: s.loves_value ?? 279,
  };
  try {
    const w = typeof window !== "undefined" ? window : {};
    const m = w.__STORE_STATS || s.metrics || {};
    return { ...fallback, ...m };
  } catch {
    return fallback;
  }
}

export default function StoreStats({ settings = {} }) {
  const s = settings || {};
  const m = useMetrics(s);

  // Build the visible items (max 5)
  const items = [];

  if (s.rating_enabled) {
    items.push({
      key: "rating",
      icon: <I.star />,
      label: `${(m.rating_value ?? 0).toFixed(2)} (${m.rating_count ?? 0})`,
    });
  }
  if (s.orders_enabled) {
    items.push({
      key: "orders",
      icon: <I.bag />,
      label: `${m.orders_value ?? ""} Orders`,
    });
  }
  if (s.loves_enabled) {
    items.push({
      key: "loves",
      icon: <I.heart />,
      label: `${m.loves_value ?? 0} Love this`,
    });
  }

  // Up to 2 custom badges
  const pushCustom = (idx) => {
    const enabled = s[`custom${idx}_enabled`];
    if (!enabled) return;
    const iconClass = s[`custom${idx}_icon`];
    const label = s[`custom${idx}_label`] || "Custom";
    const value = s[`custom${idx}_value`] || "";
    items.push({
      key: `custom${idx}`,
      icon: iconClass ? (
        <i className={cn(iconClass)} aria-hidden="true" />
      ) : (
        <I.dot />
      ),
      label: value ? `${value} ${label}` : label,
    });
  };
  pushCustom(1);
  pushCustom(2);

  const align =
    s.alignment === "left"
      ? "justify-start"
      : s.alignment === "right"
      ? "justify-end"
      : "justify-center";

  // compact spacing = tighter gaps on desktop, still nice on mobile
  const gapCls = s.compact ? "gap-4 md:gap-8" : "gap-6 md:gap-10";

  if (!items.length) return null;

  return (
    <section
      className={cn(
        "w-full",
        s.visibility === "desktop" ? "hidden md:block" : "",
        s.visibility === "mobile" ? "md:hidden" : ""
      )}
    >
      <div className={cn("flex items-center", align, gapCls, "px-4 py-3")}>
        {items.slice(0, 5).map((it, i) => (
          <div key={it.key} className="flex items-center text-sm">
            {/* left divider except first (desktop only) */}
            {i > 0 && s.show_dividers ? (
              <Divider color={s.divider_color} />
            ) : null}

            <div
              className="flex items-center gap-2 md:mx-4 mx-2"
              style={{ color: s.text_color || "#111827" }}
            >
              <span className="inline-flex items-center justify-center">
                {/* If using Remix icon class for custom, size it nicely */}
                {typeof it.icon === "object" && it.icon?.type === "i" ? (
                  <i
                    className={cn(
                      it.icon.props.className,
                      "text-base md:text-lg"
                    )}
                    aria-hidden="true"
                  />
                ) : (
                  it.icon
                )}
              </span>
              <span className="font-medium">{it.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* optional scoped CSS */}
      {s.custom_css ? <style>{s.custom_css}</style> : null}
    </section>
  );
}
