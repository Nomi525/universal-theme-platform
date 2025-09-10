import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../api/http";
import { Link } from "react-router-dom";

/* ------------------------- tiny utilities ------------------------- */
const cn = (...v: (string | false | null | undefined)[]) =>
  v.filter(Boolean).join(" ");

const picsumFor = (seed: string, w = 800, h = 1000) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const FALLBACK_IMG =
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 360'><rect width='100%' height='100%' fill='#f3f4f6'/><g fill='#9ca3af' font-family='system-ui,Segoe UI,Roboto,sans-serif' font-size='18' text-anchor='middle'><text x='240' y='180'>Image</text></g></svg>`
  );

const normalizeUrl = (u?: string | null) => {
  if (!u) return undefined;
  const s = String(u).trim();
  if (!s) return undefined;
  if (s.startsWith("//")) return "https:" + s;
  if (/^data:|^https?:\/\//i.test(s)) return s;
  return s;
};

// rupees/paise helper
const toPaise = (v: any): number => {
  if (v == null || v === "") return 0;
  if (typeof v === "number") {
    return v >= 10000 ? Math.round(v) : Math.round(v * 100);
  }
  const s = String(v).replace(/[^\d.]/g, "");
  if (!s) return 0;
  const n = Number(s);
  return isFinite(n) ? Math.round(n * 100) : 0;
};

const pickCdnImage = (p: any) =>
  normalizeUrl(
    p?.image ?? (Array.isArray(p?.images) ? p.images[0] : undefined)
  ) || picsumFor(String(p?.id ?? p?.name ?? Math.random()));

/* ------------------------------ bits ------------------------------ */
const Price: React.FC<{
  value?: number;
  currency?: string;
  noGroup?: boolean;
}> = ({ value = 0, currency = "INR", noGroup = true }) => {
  const formatted = useMemo(() => {
    const rupees = Math.round((value ?? 0) / 100);
    if (currency === "INR") {
      const body = noGroup
        ? String(rupees)
        : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
            rupees
          );
      return "₹" + body;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      useGrouping: !noGroup ? true : false,
    }).format(rupees);
  }, [value, currency, noGroup]);

  return <span>{formatted}</span>;
};

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} width="16" height="16">
    <path
      d="M6 9l6 6 6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CTA: React.FC<{
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost";
  aria: string;
}> = ({ label, onClick, variant = "primary", aria }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full transition-all px-3 py-2 text-sm rounded-xl",
      variant === "primary"
        ? "bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300/70 shadow-sm"
        : "hover:bg-slate-50 border border-slate-200"
    )}
    aria-label={aria}
  >
    {label}
  </button>
);

/* --- inside ProductsInfiniteScroll.jsx --- */
const ProductCard = ({ p, onAddToCart }) => {
  const pricePaise = toPaise(
    p.price ?? p.salePrice ?? p.sellingPrice ?? p.finalPrice ?? p.currentPrice
  );
  let mrpPaise = toPaise(
    p.mrp ??
      p.mrpPrice ??
      p.listPrice ??
      p.compareAtPrice ??
      p.originalPrice ??
      p.strikePrice
  );
  let hasMrp = mrpPaise > pricePaise && pricePaise > 0;

  const pctFromFields =
    p.discountPct ?? p.discountPercent ?? p.offPercent ?? p.off ?? null;
  let pct: number | null = null;
  if (hasMrp)
    pct = Math.max(
      0,
      Math.min(100, Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100))
    );
  else if (pctFromFields != null) {
    const n = Number(String(pctFromFields).replace(/[^\d]/g, ""));
    pct = isFinite(n) ? Math.round(n) : null;
  }
  if (!hasMrp && pricePaise > 0) {
    const uplift = 0.3;
    mrpPaise = Math.round(pricePaise * (1 + uplift));
    hasMrp = true;
    pct = Math.max(
      0,
      Math.min(100, Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100))
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-[0_6px_24px_-12px_rgba(0,0,0,0.2)] transition-all hover:shadow-[0_16px_40px_-18px_rgba(0,0,0,0.25)]">
      {/* clickable area */}
      <Link to={`/p/${p.slug || p.id}`} className="block">
        <div className="relative aspect-square bg-slate-50">
          <img
            src={normalizeUrl(p.image) || FALLBACK_IMG}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="px-2.5 sm:px-3 pt-2.5 sm:pt-3 pb-2">
          <div className="text-[13.5px] sm:text-[15px] font-semibold text-slate-900 line-clamp-2">
            {p.name}
          </div>
          <div className="mt-1 flex items-baseline gap-2 leading-none">
            <span className="text-[16px] sm:text-[18px] font-semibold text-slate-900">
              <Price value={pricePaise} currency={p.currency} noGroup />
            </span>
            {pct !== null && (
              <span className="text-[12px] sm:text-[13px] font-semibold text-amber-600">
                ({pct}% Off)
              </span>
            )}
          </div>
          {hasMrp && (
            <div className="mt-1 text-[12px] sm:text-[13px] text-slate-400 line-through">
              <Price value={mrpPaise} currency={p.currency} noGroup />
            </div>
          )}
        </div>
      </Link>

      {/* CTA outside the link */}
      <button
        onClick={() => onAddToCart(p)}
        className="mt-auto w-full py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-semibold text-rose-600 text-center border-t border-slate-100 hover:bg-rose-50 transition-colors"
        aria-label={`Add ${p.name}`}
      >
        Add to Cart
      </button>
    </div>
  );
};

/* ---------- Skeleton: same proportions as card ---------- */
const SkeletonCard: React.FC = () => (
  <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white h-full flex flex-col shadow-[0_6px_24px_-12px_rgba(0,0,0,0.15)]">
    <div className="bg-slate-200/70 animate-pulse aspect-square" />
    <div className="px-2.5 sm:px-3 pt-2.5 sm:pt-3 pb-2 space-y-2">
      <div className="h-4 w-4/5 bg-slate-200 rounded animate-pulse" />
      <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
      <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
    </div>
    <div className="h-[42px] sm:h-[44px] border-t border-slate-100 bg-slate-100/40" />
  </div>
);

/* --------------------------- collapse helper --------------------------- */
function useAutoHeight(collapsed: boolean, deps: any[] = []) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [maxH, setMaxH] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const target = collapsed ? 0 : el.scrollHeight;
      if (!collapsed) {
        setMaxH(target);
        window.setTimeout(() => setMaxH(99999), 260);
      } else {
        setMaxH(el.scrollHeight);
        requestAnimationFrame(() => setMaxH(0));
      }
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, ...deps]);
  return { ref, maxH } as const;
}

/* -------------------- ornamental MENU heading -------------------- */
const MenuOrnament: React.FC<{
  text?: string;
  className?: string;
  color?: string;
}> = ({ text = "What I offer", className, color = "#6B7280" }) => (
  <div
    className={cn(
      "flex items-center justify-center gap-3 my-2 select-none",
      className
    )}
    style={{ color }}
  >
    <div className="flex items-center gap-2 w-24">
      <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
        <path
          d="M25 6H12c-2.2 0-3.3 1.7-3.4 3.1C8.4 10 7.4 11 6 11a5 5 0 0 1 0-10c1.4 0 2.5 .9 2.6 2C8.8 1.8 10.5 1 12.2 1H25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-px flex-1 bg-current/40" />
    </div>
    <span
      className="uppercase text-[12px] font-semibold"
      style={{ letterSpacing: "0.45em" }}
    >
      {text}
    </span>
    <div className="flex items-center gap-2 w-24">
      <span className="h-px flex-1 bg-current/40" />
      <svg
        width="26"
        height="12"
        viewBox="0 0 26 12"
        style={{ transform: "scaleX(-1)" }}
        aria-hidden="true"
      >
        <path
          d="M25 6H12c-2.2 0-3.3 1.7-3.4 3.1C8.4 10 7.4 11 6 11a5 5 0 0 1 0-10c1.4 0 2.5 .9 2.6 2C8.8 1.8 10.5 1 12.2 1H25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

/* --------------------------- main component --------------------------- */
type Props = { settings?: any };

export default function ProductsInfiniteScroll({ settings = {} }: Props) {
  const s = settings || {};

  const [cats, setCats] = useState<
    Array<{ id: string; name: string; count?: number }>
  >([]);
  const [productsByCat, setProductsByCat] = useState<Record<string, any[]>>({});
  const [loadingByCat, setLoadingByCat] = useState<Record<string, boolean>>({});
  const [doneByCat, setDoneByCat] = useState<Record<string, boolean>>({});
  const [cursorByCat, setCursorByCat] = useState<Record<string, number | null>>(
    {}
  );

  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileSheet, setMobileSheet] = useState(false);

  const take = 24;
  const order = s.product_display_order || "ALPHABETICAL";

  // Grid util
  const gridClass = "pgrid grid gap-3 sm:gap-4 lg:gap-6";

  /* --------------------- load categories with counts -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/categories", {
          params: { includeCounts: 1 },
        });
        let list: any[] = r?.data?.items ?? r?.data?.categories ?? [];
        list = list
          .map((c: any) => ({
            id: String(c.id ?? c.slug ?? c.value ?? c),
            name: String(c.name ?? c.label ?? c),
            count: Number(c.count ?? c.itemsCount ?? c.total ?? 0) || undefined,
          }))
          .filter((c) => c.id && c.name);
        setCats(list);
        if (list.length) {
          setActiveCatId(list[0].id);
          setCollapsed(Object.fromEntries(list.map((c, i) => [c.id, i !== 0])));
        }
      } catch {}
    })();
  }, []);

  /* ---------------------- fetch items for a category --------------------- */
  const fetchPage = async (catId: string) => {
    if (loadingByCat[catId] || doneByCat[catId]) return;
    setLoadingByCat((m) => ({ ...m, [catId]: true }));
    try {
      const params: Record<string, any> = { order, take, category: catId };
      const cur = cursorByCat[catId];
      if (cur) params.cursor = cur;
      const { data } = await api.get("/products", { params });
      const list = (data.items ?? data.products ?? []).map((p: any) => ({
        ...p,
        image: pickCdnImage(p),
        currency: p.currency ?? "INR",
      }));
      setProductsByCat((m) => ({
        ...m,
        [catId]: [
          ...(m[catId] || []),
          ...list.filter((x) => !(m[catId] || []).some((y) => y.id === x.id)),
        ],
      }));
      const next = data.nextCursor ?? data.next ?? null;
      setCursorByCat((m) => ({ ...m, [catId]: next }));
      setDoneByCat((m) => ({ ...m, [catId]: !next }));
    } catch {
      setDoneByCat((m) => ({ ...m, [catId]: true }));
    } finally {
      setLoadingByCat((m) => ({ ...m, [catId]: false }));
    }
  };

  useEffect(() => {
    cats.forEach((c) => {
      if (!collapsed[c.id] && !(productsByCat[c.id]?.length > 0))
        fetchPage(c.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed, cats.length]);

  /* --------------------------- sidebar highlight ------------------------- */
  useEffect(() => {
    if (!cats.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = top?.target.getAttribute("data-cat-section");
        if (id) setActiveCatId(id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    cats.forEach((c) => {
      const el = document.querySelector(`[data-cat-section="${c.id}"]`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [cats.length]);

  /* ------------------------------ handlers ------------------------------ */
  const handleAddToCart = (p: any) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const i = cart.findIndex((x: any) => x.id === p.id);
      if (i > -1) cart[i].qty += 1;
      else
        cart.push({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          qty: 1,
          currency: p.currency || "INR",
        });
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
    try {
      window.dispatchEvent(
        new CustomEvent("cart:add", { detail: { id: p.id } })
      );
    } catch {}
  };

  const handleBuyNow = (p: any) => {
    handleAddToCart(p);
    try {
      window.dispatchEvent(new CustomEvent("cart:open"));
    } catch {}
  };

  /* --------------------------- Category section ------------------------- */
  function CategorySection({
    cat,
  }: {
    cat: { id: string; name: string; count?: number };
  }) {
    const isClosed = !!collapsed[cat.id];
    const list = productsByCat[cat.id] || [];
    const { ref, maxH } = useAutoHeight(isClosed, [list.length]);

    return (
      <section
        className="mb-6 lg:mb-8"
        id={`cat-${cat.id}`}
        data-cat-section={cat.id}
      >
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
          <button
            onClick={() =>
              setCollapsed((m) => ({ ...m, [cat.id]: !m[cat.id] }))
            }
            className="w-full flex items-center justify-between px-4 py-3 sm:px-5 lg:px-6 hover:bg-slate-50 transition-colors"
            aria-expanded={!isClosed}
          >
            <div className="text-left">
              <div className="text-[15px] sm:text-lg font-semibold text-slate-900">
                {cat.name}
              </div>
              <div className="text-xs sm:text-sm text-slate-600">
                {(cat.count ?? list.length) || 0} items
              </div>
            </div>
            <span
              className={cn(
                "text-slate-600 transition-transform",
                !isClosed && "rotate-180"
              )}
              aria-hidden="true"
            >
              <ChevronDown className="w-4 h-4" />
            </span>
          </button>

          <div
            ref={ref}
            style={{
              overflow: "hidden",
              transition: "max-height 260ms ease",
              maxHeight: `${maxH}px`,
            }}
          >
            {!isClosed && (
              <div className="p-3 sm:p-4 lg:p-6 border-t border-slate-100">
                <div className={gridClass}>
                  {loadingByCat[cat.id] && list.length === 0
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))
                    : list.map((p) => (
                        <ProductCard
                          key={p.id}
                          p={p}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                  {!loadingByCat[cat.id] && list.length === 0 && (
                    <div className="col-span-full text-slate-500 text-sm">
                      No products in {cat.name}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-center">
                  {!doneByCat[cat.id] ? (
                    <button
                      onClick={() => fetchPage(cat.id)}
                      disabled={!!loadingByCat[cat.id]}
                      className={cn(
                        "px-4 py-2 rounded-xl border border-slate-300 text-sm hover:bg-slate-50 transition-all",
                        loadingByCat[cat.id] && "opacity-60 cursor-wait"
                      )}
                    >
                      {loadingByCat[cat.id] ? "Loading…" : "Show more"}
                    </button>
                  ) : list.length > 0 ? (
                    <span className="text-xs text-slate-400">
                      End of {cat.name}
                    </span>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------- Mobile category sheet -------------------------- */
  const MobileCatSheet = (
    <div
      className={cn(
        "lg:hidden fixed inset-0 z-[70] transition",
        mobileSheet ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setMobileSheet(false)}
      aria-hidden={!mobileSheet}
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
                setCollapsed((m) => ({ ...m, [c.id]: false }));
                setMobileSheet(false);
                const anchor = document.getElementById(`cat-${c.id}`);
                anchor?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {c.name}
              {typeof c.count === "number" && (
                <span className="ml-2 text-white/70">({c.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ------------------------------ render UI ------------------------------ */
  return (
    <section className="w-full bg-[#fafafa]">
      {/* Grid + separator CSS */}
      <style>{`
        /* Mobile-first: ALWAYS 2 columns on small screens */
        .pgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        /* adjust mobile gap a touch smaller if desired */
        @media (max-width: 639.98px) { .pgrid { gap: 12px; } }

        /* From sm and up, use auto-fill with min widths for a fluid enterprise layout */
        @media (min-width: 640px)  { .pgrid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); } } /* sm */
        @media (min-width: 1024px) { .pgrid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); } } /* lg */
        @media (min-width: 1536px) { .pgrid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } } /* 2xl */

        /* Vertical separator */
        .sepLine { background: rgba(15, 23, 42, 0.12); }
      `}</style>

      <div className="w-full px-3 sm:px-5 lg:px-8 xl:px-10 2xl:px-14 py-6 lg:py-8 mx-auto max-w-none">
        {/* header + mobile trigger */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl lg:text-2xl font-semibold text-slate-900">
            {s.title || "Explore all"}
            {s.display_subtitle && (
              <div className="text-sm mt-1 text-slate-500">
                {s.subtitle || "Discover our full collection, just for you."}
              </div>
            )}
          </div>
          {cats.length > 0 && (
            <button
              onClick={() => setMobileSheet(true)}
              className="lg:hidden inline-flex items-center gap-2 text-[12px] px-3 py-1.5 rounded-full bg-slate-100 text-slate-800"
            >
              <ChevronDown className="w-3 h-3 -rotate-90" />
              Explore categories
            </button>
          )}
        </div>

        {/* Layout with a 1px separator column on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px,1px,1fr] xl:grid-cols-[300px,1px,1fr] 2xl:grid-cols-[340px,1px,1fr] gap-6 xl:gap-8 2xl:gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            {cats.length > 0 && (
              <div className="sticky top-24">
                <MenuOrnament className="mb-3" />
                <div className="text-[12px] tracking-wide text-slate-500 mb-2 px-2">
                  CATEGORIES
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden max-h-[70vh] shadow-sm">
                  <div className="divide-y divide-slate-100 overflow-y-auto">
                    {cats.map((c) => (
                      <button
                        key={c.id}
                        className={cn(
                          "w-full text-left px-3 py-2.5 text-sm flex items-center justify-between hover:bg-slate-50",
                          activeCatId === c.id && "bg-slate-100 font-semibold"
                        )}
                        onClick={() => {
                          setActiveCatId(c.id);
                          setCollapsed((m) => ({ ...m, [c.id]: false }));
                          const el = document.getElementById(`cat-${c.id}`);
                          el?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                      >
                        <span className="truncate">{c.name}</span>
                        {typeof c.count === "number" && (
                          <span className="ml-3 shrink-0 text-xs text-slate-500">
                            {c.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Separator column */}
          <div
            className="hidden lg:block sepLine w-[1px] self-stretch rounded-full"
            aria-hidden="true"
          />

          {/* Sections */}
          <div>
            <div className="mb-3 hidden lg:flex gap-2 justify-end">
              {cats.length > 0 && (
                <>
                  <button
                    onClick={() =>
                      setCollapsed(
                        Object.fromEntries(cats.map((c) => [c.id, false]))
                      )
                    }
                    className="px-3 py-1.5 text-sm rounded-xl border border-slate-300 hover:bg-slate-50"
                  >
                    Expand all
                  </button>
                  <button
                    onClick={() =>
                      setCollapsed(
                        Object.fromEntries(cats.map((c) => [c.id, true]))
                      )
                    }
                    className="px-3 py-1.5 text-sm rounded-xl border border-slate-300 hover:bg-slate-50"
                  >
                    Collapse all
                  </button>
                </>
              )}
            </div>

            {cats.map((c) => (
              <CategorySection key={c.id} cat={c} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile category sheet */}
      {MobileCatSheet}
    </section>
  );
}
