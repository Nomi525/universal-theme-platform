// src/editor/renderers/ProductsInfiniteScroll.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import { api } from "../../api/http";

/* ---------- formatting ---------- */
const Price = ({ value, currency = "INR" }) => {
  const formatted = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format((value ?? 0) / 100),
    [value, currency]
  );
  return <span>{formatted}</span>;
};

/* ---------- tiny editor-friendly helpers ---------- */
const toast = (msg) => {
  try {
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111827;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;z-index:9999;box-shadow:0 6px 20px rgba(0,0,0,.25)";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  } catch {
    /* empty */
  }
};
const addToLocalCart = (item) => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const i = cart.findIndex((x) => x.id === item.id);
    if (i > -1) cart[i].qty += item.qty;
    else cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch {
    /* empty */
  }
};
const fireEvent = (name, detail) =>
  window.dispatchEvent(new CustomEvent(name, { detail }));

/* ---------- mappings (token → tailwind) ---------- */
const radiusMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};
const shadowMap = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow",
  lg: "shadow-lg",
};
const aspectMap = {
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "16/9": "aspect-video",
};
const cardStyleMap = {
  MINIMAL: "bg-white border border-slate-200",
  ELEVATED: "bg-white shadow-sm",
  OUTLINE: "bg-white border-2 border-slate-200",
  GLASS: "bg-white/60 backdrop-blur border border-white/50",
  BORDERLESS: "bg-white",
};
const hoverCardMap = {
  none: "",
  lift: "transition-transform duration-200 will-change-transform hover:-translate-y-0.5",
  glow: "transition-shadow duration-200 hover:ring-2 hover:ring-slate-200/60",
};
const imageHoverMap = {
  none: "",
  lift: "",
  glow: "",
  zoom: "group-hover:scale-[1.03] transition-transform duration-200 will-change-transform",
};

const btnSize = {
  xs: "px-2 py-1 text-[11px]",
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};
const btnShape = { rounded: "rounded-md", pill: "rounded-full" };
const btnVariant = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "border border-slate-300 hover:bg-slate-50",
  subtle: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  ghost: "hover:bg-slate-50",
};

/* ---------- reusable bits ---------- */
const Badge = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-900/90 text-white">
    {children}
  </span>
);

const CTA = ({ label, onClick, variant, size, shape, className, aria }) => (
  <button
    onClick={onClick}
    className={cn(
      btnSize[size],
      btnShape[shape],
      btnVariant[variant],
      "w-full",
      className
    )}
    aria-label={aria}
  >
    {label}
  </button>
);

/* ---------- card variants (Card / Compact / List) ---------- */
const CardShell = ({ s, children }) => {
  const r = radiusMap[s.card_radius || "lg"];
  const sh = shadowMap[s.card_shadow || "none"];
  const base = cardStyleMap[s.card_style || "MINIMAL"];
  const hover = hoverCardMap[s.hover_effect || "lift"];
  return (
    <div className={cn("group overflow-hidden", r, sh, base, hover)}>
      {children}
    </div>
  );
};

const Media = ({ s, src, alt }) => {
  const aspect = aspectMap[s.image_aspect || "4/3"];
  const r = s.media_radius_sync
    ? radiusMap[s.card_radius || "lg"]
    : "rounded-md";
  return (
    <div className={cn("overflow-hidden bg-slate-100", aspect, r)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover",
            imageHoverMap[s.image_hover || "zoom"]
          )}
          loading="lazy"
        />
      ) : null}
    </div>
  );
};

const Actions = ({ s, p, onAddToCart, onBuyNow }) => {
  const showAdd = !!s.show_add_to_cart;
  const showBuy = !!s.show_buy_now;
  if (!showAdd && !showBuy) return null;

  const layout = s.actions_layout || "inline"; // inline | stacked
  const common = {
    variant: s.actions_variant || "outline",
    size: s.actions_size || "sm",
    shape: s.actions_shape || "rounded",
  };

  return (
    <div
      className={cn(
        "mt-3 gap-2",
        layout === "inline" ? "grid grid-cols-2" : "flex flex-col"
      )}
    >
      {showAdd && (
        <CTA
          {...common}
          label={s.add_to_cart_text || "Add to cart"}
          onClick={() => onAddToCart(p)}
          aria={`Add ${p.name} to cart`}
        />
      )}
      {showBuy && (
        <CTA
          {...common}
          variant={s.actions_variant_primary || "primary"}
          label={s.buy_now_text || "Buy now"}
          onClick={() => onBuyNow(p)}
          aria={`Buy ${p.name} now`}
        />
      )}
    </div>
  );
};

const Meta = ({ p }) => (
  <>
    <div className="text-sm font-medium text-slate-900 line-clamp-1">
      {p.name}
    </div>
    <div className="text-sm text-slate-600 mt-1">
      <Price value={p.price} currency={p.currency} />
    </div>
  </>
);

const Badges = ({ p, s }) => {
  const mode = s.badge_mode || "NONE"; // NONE | NEW | POPULAR | BOTH
  const createdAt = p.createdAt ? new Date(p.createdAt) : null;
  const isNew =
    !!createdAt && Date.now() - createdAt.getTime() < 30 * 24 * 3600 * 1000;
  const isPopular = (p.popularity ?? 0) >= (s.popular_threshold ?? 60);

  if (mode === "NONE") return null;
  const wantsNew = mode === "NEW" || mode === "BOTH";
  const wantsPop = mode === "POPULAR" || mode === "BOTH";

  if (!wantsNew && !wantsPop) return null;

  return (
    <div className="absolute left-2 top-2 flex gap-2">
      {wantsNew && isNew && <Badge>New</Badge>}
      {wantsPop && isPopular && <Badge>Popular</Badge>}
    </div>
  );
};

/* CARD */
const CardView = ({ p, s, onAddToCart, onBuyNow }) => (
  <CardShell s={s} p={p}>
    <div className="relative">
      <Media s={s} src={p.image} alt={p.name} />
      <Badges p={p} s={s} />
    </div>
    <div className="p-3">
      <Meta p={p} s={s} />
      <Actions s={s} p={p} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
    </div>
  </CardShell>
);

/* COMPACT */
const CompactView = ({ p, s, onAddToCart, onBuyNow }) => (
  <CardShell s={s} p={p}>
    <div className="relative p-2">
      <Media s={s} src={p.image} alt={p.name} />
      <Badges p={p} s={s} />
    </div>
    <div className="px-2 pb-2">
      <div className="text-[13px] font-medium text-slate-900 line-clamp-1">
        {p.name}
      </div>
      <div className="text-xs text-slate-600">
        <Price value={p.price} currency={p.currency} />
      </div>
      <Actions s={s} p={p} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
    </div>
  </CardShell>
);

/* LIST */
const ListView = ({ p, s, onAddToCart, onBuyNow }) => (
  <CardShell s={s} p={p}>
    <div className="p-3 flex gap-3 items-stretch">
      <div className="relative w-28 shrink-0">
        <Media s={{ ...s, image_aspect: "1/1" }} src={p.image} alt={p.name} />
        <Badges p={p} s={s} />
      </div>
      <div className="flex-1 min-w-0">
        <Meta p={p} s={s} />
        <Actions s={s} p={p} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
      </div>
    </div>
  </CardShell>
);

export default function ProductsInfiniteScroll({ settings = {} }) {
  const s = settings || {};
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef(null);

  const take = 12;
  const order = s.product_display_order || "ALPHABETICAL";
  const layout = (s.product_layout_type || "CARD").toUpperCase(); // CARD | LIST | COMPACT

  // NEW: visibility class (all | desktop | mobile)
  const visibilityClass = useMemo(() => {
    const v = (s.visibility || "all").toLowerCase();
    if (v === "desktop") return "hidden md:block";
    if (v === "mobile") return "block md:hidden";
    return ""; // all
  }, [s.visibility]);

  const fetchPage = async () => {
    if (loading || done) return;
    setLoading(true);
    try {
      const params = { order, take, ...(cursor ? { cursor } : {}) };
      const { data } = await api.get("/products", { params });

      const list = (data.items ?? data.products ?? []).map((p) => ({
        ...p,
        image: p.image ?? p.images?.[0] ?? null,
        currency: p.currency ?? "INR",
      }));

      setItems((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        return [...prev, ...list.filter((x) => !seen.has(x.id))];
      });

      const next = data.nextCursor ?? data.next ?? null;
      setCursor(next);
      setDone(!next);
    } catch (e) {
      console.error(e);
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (p) => {
    const item = {
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image ?? null,
      qty: 1,
      currency: p.currency ?? "INR",
      slug: p.slug,
    };
    fireEvent("cart:add", { item });
    addToLocalCart(item);
    toast("Added to cart");
  };

  const handleBuyNow = (p) => {
    handleAddToCart(p);
    fireEvent("cart:open");
    toast("Ready to checkout");
  };

  useEffect(() => {
    setItems([]);
    setCursor(null);
    setDone(false);
  }, [order, layout, s.card_style, s.card_radius, s.card_shadow]);

  useEffect(() => {
    if (items.length === 0 && !loading && !done) fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, loading, done, order, layout]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || done) return;
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && fetchPage(),
      { rootMargin: "800px 0px 800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, order, layout]);

  const wrapperClass =
    layout === "LIST"
      ? "flex flex-col gap-3"
      : layout === "COMPACT"
      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
      : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4";

  const View =
    layout === "LIST"
      ? ListView
      : layout === "COMPACT"
      ? CompactView
      : CardView;

  return (
    <section
      className={cn("w-full", visibilityClass)}
      style={{
        backgroundColor: s.section_background_color || "#fff",
        marginTop: s.section_top_margin || "0rem",
        marginBottom: s.section_bottom_margin || "1.5rem",
      }}
      data-visibility={s.visibility || "all"}
    >
      <div className="mx-auto max-w-6xl px-4 py-4">
        {s.display_title && (
          <h2
            className="text-xl font-semibold"
            style={{ color: s.title_color || "#111827" }}
          >
            {s.title || "Explore all"}
          </h2>
        )}
        {s.display_subtitle && (
          <p
            className="text-sm mt-1"
            style={{ color: s.subtitle_color || "#1f2937" }}
          >
            {s.subtitle || "Discover our full collection, just for you."}
          </p>
        )}

        <div className={cn("mt-4", wrapperClass)}>
          {items.map((p) => (
            <View
              key={p.id}
              p={p}
              s={s}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ))}
          {!loading && items.length === 0 && (
            <div className="col-span-full text-slate-500">No products yet.</div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center">
          {!done ? (
            <>
              <button
                onClick={fetchPage}
                disabled={loading}
                className={cn(
                  "px-4 py-2 rounded-md border border-slate-300 text-sm",
                  loading && "opacity-60 cursor-wait"
                )}
              >
                {loading
                  ? "Loading…"
                  : s.load_more_text || "Show More Products"}
              </button>
              <span ref={sentinelRef} className="sr-only" />
            </>
          ) : (
            <span className="text-xs text-slate-400">
              {s.load_more_text || "Show More Products"} — end
            </span>
          )}
        </div>

        {s.custom_css ? <style>{s.custom_css}</style> : null}
      </div>
    </section>
  );
}
