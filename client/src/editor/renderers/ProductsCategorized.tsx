import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../api/http";

/* ------------------------- tiny utilities ------------------------- */
const cn = (...v: (string | false | null | undefined)[]) =>
  v.filter(Boolean).join(" ");

const picsumFor = (seed: string, w = 600, h = 800) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const FALLBACK_IMG =
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 360'>
      <rect width='100%' height='100%' fill='#e5e7eb'/>
      <g fill='#6b7280' font-family='system-ui,Segoe UI,Roboto,sans-serif' font-size='22' text-anchor='middle'>
        <text x='240' y='180'>Preview</text>
      </g>
    </svg>`
  );

const normalizeUrl = (u?: string | null) => {
  if (!u) return undefined;
  const s = String(u).trim();
  if (!s) return undefined;
  if (s.startsWith("//")) return "https:" + s;
  if (/^data:|^https?:\/\//i.test(s)) return s;
  return s;
};

const pickCdnImage = (p: any) => {
  const primary = normalizeUrl(
    p?.image ?? (Array.isArray(p?.images) ? p.images[0] : undefined)
  );
  if (primary) return primary;
  return picsumFor(String(p?.id ?? p?.name ?? Math.random()), 600, 800);
};

const Price: React.FC<{ value?: number; currency?: string }> = ({
  value = 0,
  currency = "INR",
}) => {
  const formatted = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(value / 100),
    [value, currency]
  );
  return <span>{formatted}</span>;
};

const toast = (msg: string) => {
  try {
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:#111827;color:#fff;padding:8px 12px;border-radius:10px;font-size:12px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.25)";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  } catch {}
};

const addToLocalCart = (item: any) => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const i = cart.findIndex((x: any) => x.id === item.id);
    if (i > -1) cart[i].qty += item.qty;
    else cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch {}
};

const fire = (name: string, detail?: any) => {
  try {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } catch {}
};

/* ------------------------- settings maps ------------------------- */
const radiusMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};
const shadowMap: Record<string, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow",
  lg: "shadow-lg",
};
const aspectMap: Record<string, string> = {
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "16/9": "aspect-video",
};
const cardStyleMap: Record<string, string> = {
  MINIMAL: "bg-white border border-slate-200",
  ELEVATED: "bg-white shadow-sm",
  OUTLINE: "bg-white border-2 border-slate-200",
  GLASS: "bg-white/60 backdrop-blur border border-white/50",
  BORDERLESS: "bg-white",
};
const hoverCardMap: Record<string, string> = {
  none: "",
  lift: "transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-lg",
  glow: "transition-shadow duration-200 hover:ring-2 hover:ring-slate-200/70",
};
const imageHoverMap: Record<string, string> = {
  none: "",
  zoom: "group-hover:scale-[1.03] transition-transform duration-200 will-change-transform",
};
const btnSize: Record<string, string> = {
  xs: "px-2 py-1 text-[11px]",
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};
const btnShape: Record<string, string> = {
  rounded: "rounded-md",
  pill: "rounded-full",
};
const btnVariant: Record<string, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300/70",
  outline:
    "border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300/70",
  subtle:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300/70",
  ghost:
    "hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300/70",
};

/* ----------------------------- bits ------------------------------ */
const CTA: React.FC<{
  label: string;
  onClick: () => void;
  variant: string;
  size: string;
  shape: string;
  aria: string;
}> = ({ label, onClick, variant, size, shape, aria }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full transition-colors",
      btnSize[size],
      btnShape[shape],
      btnVariant[variant]
    )}
    aria-label={aria}
  >
    {label}
  </button>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-900/90 text-white">
    {children}
  </span>
);

/* ------------------------ card primitives ------------------------ */
const CardShell: React.FC<{ s: any; children: React.ReactNode }> = ({
  s,
  children,
}) => {
  const r = radiusMap[s.card_radius || "lg"];
  const sh = shadowMap[s.card_shadow || "none"];
  const base = cardStyleMap[s.card_style || "ELEVATED"];
  const hover = hoverCardMap[s.hover_effect || "lift"];
  return (
    <div
      className={cn(
        "group overflow-hidden h-full flex flex-col",
        r,
        sh,
        base,
        hover
      )}
    >
      {children}
    </div>
  );
};

const Media: React.FC<{ s: any; src?: string | null; alt: string }> = ({
  s,
  src,
  alt,
}) => {
  const aspect = aspectMap[s.image_aspect || "4/3"];
  const r = s.media_radius_sync
    ? radiusMap[s.card_radius || "lg"]
    : "rounded-md";
  const imgSrc = normalizeUrl(src || undefined) || FALLBACK_IMG;
  return (
    <div className={cn("overflow-hidden bg-slate-100", aspect, r)}>
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover",
          imageHoverMap[s.image_hover || "zoom"]
        )}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement & {
            dataset: { retried?: string };
          };
          if (!el.dataset.retried) {
            el.dataset.retried = "1";
            el.src = picsumFor(alt || "product", 600, 800);
          } else if (el.src !== FALLBACK_IMG) {
            el.src = FALLBACK_IMG;
          }
        }}
      />
    </div>
  );
};

const Badges: React.FC<{ p: any; s: any }> = ({ p, s }) => {
  const mode = s.badge_mode || "NONE";
  const createdAt = p.createdAt ? new Date(p.createdAt) : null;
  const isNew =
    !!createdAt && Date.now() - createdAt.getTime() < 30 * 24 * 3600 * 1000;
  const isPopular = (p.popularity ?? 0) >= (s.popular_threshold ?? 60);
  if (mode === "NONE") return null;

  const wantsNew = mode === "NEW" || mode === "BOTH";
  const wantsPop = mode === "POPULAR" || mode === "BOTH";

  return (
    <div className="absolute left-2 top-2 flex gap-2">
      {wantsNew && isNew && <Badge>New</Badge>}
      {wantsPop && isPopular && <Badge>Popular</Badge>}
    </div>
  );
};

const Meta: React.FC<{ p: any }> = ({ p }) => (
  <>
    <div className="text-sm font-medium text-slate-900 line-clamp-1">
      {p.name}
    </div>
    <div className="text-sm text-slate-600 mt-1">
      <Price value={p.price} currency={p.currency} />
    </div>
  </>
);

const Actions: React.FC<{
  s: any;
  p: any;
  onAddToCart: (p: any) => void;
  onBuyNow: (p: any) => void;
}> = ({ s, p, onAddToCart, onBuyNow }) => {
  const showAdd = !!s.show_add_to_cart;
  const showBuy = !!s.show_buy_now;
  if (!showAdd && !showBuy) return null;

  const layout = s.actions_layout || "inline";
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

const CardView: React.FC<any> = ({ p, s, onAddToCart, onBuyNow }) => (
  <CardShell s={s}>
    <div className="relative">
      <Media s={s} src={p.image} alt={p.name} />
      <Badges p={p} s={s} />
    </div>
    <div className="p-3 flex-1 flex flex-col">
      <Meta p={p} />
      <Actions s={s} p={p} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
    </div>
  </CardShell>
);

const SkeletonCard: React.FC = () => (
  <div className="overflow-hidden rounded-lg border border-slate-200 h-full flex flex-col">
    <div className="bg-slate-200/70 animate-pulse aspect-[4/3]" />
    <div className="p-3 space-y-2">
      <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
      <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
    </div>
  </div>
);

/* -------------------- section state (per category) -------------------- */
type SectionState = {
  items: any[];
  cursor: string | null;
  loading: boolean;
  done: boolean;
};

const useCategorySection = ({
  categoryId,
  order,
  take,
}: {
  categoryId: string;
  order: string;
  take: number;
}) => {
  const [state, set] = useState<SectionState>({
    items: [],
    cursor: null,
    loading: false,
    done: false,
  });

  const fetchMore = async () => {
    set((s) => (s.loading || s.done ? s : { ...s, loading: true }));
    try {
      const params: Record<string, any> = { order, take, category: categoryId };
      if (state.cursor) params.cursor = state.cursor;

      const { data } = await api.get("/products", { params });
      const list = (data.items ?? data.products ?? []).map((p: any) => ({
        ...p,
        image: pickCdnImage(p),
        currency: p.currency ?? "INR",
      }));

      set((prev) => {
        const seen = new Set(prev.items.map((x) => x.id));
        const merged = [...prev.items, ...list.filter((x) => !seen.has(x.id))];
        const next = data.nextCursor ?? data.next ?? null;
        return {
          items: merged,
          cursor: next,
          loading: false,
          done: !next || list.length === 0,
        };
      });
    } catch (e) {
      console.error(e);
      set((prev) => ({ ...prev, loading: false, done: true }));
    }
  };

  useEffect(() => {
    set({ items: [], cursor: null, loading: false, done: false });
  }, [categoryId, order, take]);

  useEffect(() => {
    if (!state.loading && state.items.length === 0 && !state.done) fetchMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, order, take]);

  return { state, fetchMore };
};

/* --------------------------- main block --------------------------- */
type Props = { settings?: any };

export default function ProductsCategorized({ settings = {} }: Props) {
  const s = settings || {};

  const visibilityClass = useMemo(() => {
    const v = (s.visibility || "all").toLowerCase();
    if (v === "desktop") return "hidden lg:block";
    if (v === "mobile") return "block lg:hidden";
    return "";
  }, [s.visibility]);

  const [cats, setCats] = useState<
    { id: string; name: string; count?: number }[]
  >([]);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [mobileSheet, setMobileSheet] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [countMap, setCountMap] = useState<Record<string, number>>({});
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  const order = s.product_display_order || "ALPHABETICAL";
  const layout = (s.product_layout_type || "CARD").toUpperCase();
  const take = Number(s.page_size || 12);

  const View = CardView;

  const gridClass =
    layout === "COMPACT"
      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
      : layout === "LIST"
      ? "flex flex-col gap-4 lg:gap-5"
      : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6";

  // fetch categories once
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const r = await api
          .get("/categories", { params: { includeCounts: 1 } })
          .catch(() => ({ data: null }));
        let list: any[] = r?.data?.items ?? r?.data?.categories ?? [];
        list = list
          .map((c: any) => ({
            id: String(c.id ?? c.slug ?? c.value ?? c),
            name: String(c.name ?? c.label ?? c),
            count: Number(c.count ?? c.itemsCount ?? c.total ?? 0) || undefined,
          }))
          .filter((c) => c.id && c.name);
        if (on) {
          setCats(list);
          const initialCounts: Record<string, number> = {};
          list.forEach((c) => {
            if (typeof c.count === "number") initialCounts[c.id] = c.count;
          });
          setCountMap(initialCounts);
          if (!activeCatId && list.length) setActiveCatId(list[0].id);
        }
      } catch {}
    })();
    return () => {
      on = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll-spy for sidebar highlight
  useEffect(() => {
    const ids = cats.map((c) => c.id);
    if (!ids.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = vis?.target.getAttribute("data-cat-section");
        if (id) setActiveCatId(id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    ids.forEach((id) => {
      const el = document.querySelector(
        `[data-cat-section="${id}"]`
      ) as HTMLElement | null;
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [cats.length]);

  /* header (top of the page) */
  const SectionHeader = (
    <>
      {s.display_title && (
        <h2
          className="text-xl lg:text-2xl font-semibold tracking-tight"
          style={{ color: s.title_color || "#111827" }}
        >
          {s.title || "Explore all"}
        </h2>
      )}
      {s.display_subtitle && (
        <p
          className="text-sm mt-1 opacity-80"
          style={{ color: s.subtitle_color || "#1f2937" }}
        >
          {s.subtitle || "Discover our full collection, just for you."}
        </p>
      )}
    </>
  );

  /* mobile sheet for categories */
  const MobileCatSheet = (
    <div
      className={cn(
        "fixed inset-0 z-[70] transition",
        mobileSheet
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!mobileSheet}
      onClick={() => setMobileSheet(false)}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-0 w-[92%] max-w-sm",
          "bg-[#2B2F33] text-white rounded-b-2xl shadow-2xl",
          "pt-3 pb-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 pb-2 text-[11px] tracking-wide opacity-80">
          EXPLORE CATEGORIES
        </div>
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-white/10">
          {cats.map((c) => (
            <button
              key={c.id}
              className={cn(
                "w-full text-left px-4 py-3 text-[13px]",
                activeCatId === c.id
                  ? "bg-white/10 font-semibold"
                  : "hover:bg-white/5"
              )}
              onClick={() => {
                setActiveCatId(c.id);
                setMobileSheet(false);
                const anchor = document.querySelector(
                  `[data-cat-section="${c.id}"]`
                ) as HTMLElement | null;
                anchor?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {c.name}
              {typeof countMap[c.id] === "number" && (
                <span className="ml-2 text-white/70">({countMap[c.id]})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* Category Section (right column) */
  const CategorySection: React.FC<{ cat: { id: string; name: string } }> = ({
    cat,
  }) => {
    const { state, fetchMore } = useCategorySection({
      categoryId: cat.id,
      order,
      take,
    });

    // keep live counts in sync as products arrive
    useEffect(() => {
      if (state.items.length) {
        setCountMap((m) => ({
          ...m,
          [cat.id]: Math.max(state.items.length, m[cat.id] ?? 0),
        }));
      }
    }, [state.items.length]); // eslint-disable-line

    const handleAddToCart = (p: any) => {
      const item = {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image ?? null,
        qty: 1,
        currency: p.currency ?? "INR",
      };
      addToLocalCart(item);
      fire("cart:add", { item });
      toast("Added to cart");
    };
    const handleBuyNow = (p: any) => {
      handleAddToCart(p);
      fire("cart:open");
    };

    const isClosed = !!collapsed[cat.id];

    // smooth height animation container
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [h, setH] = useState<number | "auto">(0);
    useEffect(() => {
      const el = contentRef.current;
      if (!el) return;
      const target = isClosed ? 0 : el.scrollHeight;
      if (!isClosed) {
        setH(target);
        const t = setTimeout(() => setH("auto"), 220);
        return () => clearTimeout(t);
      }
      setH(target);
    }, [isClosed, state.items.length]);

    return (
      <section
        className="mb-8 lg:mb-10"
        id={`cat-${cat.id}`}
        data-cat-section={cat.id}
        ref={(el) => {
          sectionsRef.current[cat.id] = el;
        }}
      >
        {/* header with name + count + chevron */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              aria-label={isClosed ? "Expand" : "Collapse"}
              onClick={() =>
                setCollapsed((m) => ({ ...m, [cat.id]: !m[cat.id] }))
              }
              className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <i
                className={cn(
                  "ri-arrow-down-s-line text-lg transition-transform",
                  isClosed ? "" : "rotate-180"
                )}
              />
            </button>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold">{cat.name}</h3>
              <div className="text-xs text-slate-500">
                {typeof countMap[cat.id] === "number"
                  ? `${countMap[cat.id]} items`
                  : state.loading
                  ? "Loading items…"
                  : `${state.items.length} items`}
              </div>
            </div>
          </div>

          {!isClosed && state.items.length > 0 && !state.done && (
            <button
              onClick={fetchMore}
              disabled={state.loading}
              className={cn(
                "px-3 py-1.5 rounded-md border border-slate-300 text-sm",
                state.loading && "opacity-60 cursor-wait"
              )}
            >
              {state.loading ? "Loading…" : "Show more"}
            </button>
          )}
        </div>

        {/* collapsible content */}
        <div
          ref={contentRef}
          style={{
            overflow: "hidden",
            transition: "max-height 220ms ease",
            maxHeight: h === "auto" ? "9999px" : `${h}px`,
          }}
        >
          {!isClosed && (
            <>
              <div className={gridClass}>
                {state.loading && state.items.length === 0
                  ? Array.from({ length: Math.min(8, take) }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : state.items.map((p) => (
                      <View
                        key={p.id}
                        p={p}
                        s={s}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                      />
                    ))}

                {!state.loading && state.items.length === 0 && (
                  <div className="col-span-full text-slate-500 text-sm">
                    No products yet in {cat.name}.
                  </div>
                )}
              </div>

              {state.items.length > 0 && state.done && (
                <div className="mt-3 text-xs text-slate-400">
                  End of {cat.name}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  };

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
      <div className="w-full px-3 sm:px-5 lg:px-8 py-6 lg:py-8 mx-auto max-w-[1380px]">
        {/* Header + mobile category trigger */}
        <div className="flex items-center justify-between">
          <div>{SectionHeader}</div>
          {cats.length > 0 && (
            <button
              onClick={() => setMobileSheet(true)}
              className="lg:hidden inline-flex items-center gap-2 text-[12px] px-3 py-1.5 rounded-full bg-slate-100 text-slate-800"
            >
              <i className="ri-menu-2-line text-[14px]" />
              Explore categories
            </button>
          )}
        </div>

        {/* Layout: sidebar + sections */}
        <div className="mt-4 lg:mt-6 grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-4 lg:gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            {cats.length > 0 && (
              <div className="sticky top-24">
                <div className="text-[12px] tracking-wide text-slate-500 mb-2 px-2">
                  WHAT I OFFER
                </div>
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden max-h-[70vh]">
                  <div className="divide-y divide-slate-100 overflow-y-auto">
                    {cats.map((c) => (
                      <button
                        key={c.id}
                        className={cn(
                          "w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 flex items-center justify-between",
                          activeCatId === c.id && "bg-slate-100 font-semibold"
                        )}
                        onClick={() => {
                          setActiveCatId(c.id);
                          const el = document.getElementById(`cat-${c.id}`);
                          el?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                      >
                        <span className="truncate">{c.name}</span>
                        {typeof countMap[c.id] === "number" && (
                          <span className="ml-3 shrink-0 text-xs text-slate-500">
                            {countMap[c.id]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Sections */}
          <div>
            {cats.map((c) => (
              <CategorySection key={c.id} cat={c} />
            ))}
          </div>
        </div>
      </div>

      {/* mobile sheet */}
      {MobileCatSheet}

      {/* custom CSS */}
      {s.custom_css ? <style>{String(s.custom_css)}</style> : null}
    </section>
  );
}
