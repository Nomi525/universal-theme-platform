import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/http";
import ImageCarousel from "./ImageCarousel";
import PriceRow from "./PriceRow";

const normalizeUrl = (u) => {
  if (!u) return undefined;
  const s = String(u).trim();
  if (!s) return undefined;
  if (s.startsWith("//")) return "https:" + s;
  if (/^data:|^https?:\/\//i.test(s)) return s;
  return s;
};

export default function ProductDetails() {
  const { idOrSlug } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyMsg, setCopyMsg] = useState("");

  // ---- Safe back helper: go -1 if possible, else go home
  const goBack = () => {
    // HashRouter can report 1–2 entries when deep-linked; be generous.
    if (window.history.length > 2) nav(-1);
    else nav("/", { replace: true });
  };

  // Esc to go back
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/products/${idOrSlug}`);
        const images = (data?.images || [])
          .map((u) => normalizeUrl(u))
          .filter(Boolean);
        setP({ ...data, images });
      } finally {
        setLoading(false);
      }
    })();
  }, [idOrSlug]);

  const coupons = useMemo(
    () => [
      {
        pct: 20,
        title: "On orders above ₹5000 | Up to ₹2000",
        code: "FESTIVEOFFER",
      },
      { pct: 10, title: "On orders above ₹2000 | Up to ₹800", code: "10OFF" },
    ],
    []
  );

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyMsg("Copied!");
      setTimeout(() => setCopyMsg(""), 1200);
    } catch {
      /* noop */
    }
  };

  const share = () => {
    const url = location.href;
    if (navigator.share) {
      navigator.share({ title: p?.name ?? "Product", url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).then(() => {
        setCopyMsg("Link copied!");
        setTimeout(() => setCopyMsg(""), 1200);
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="h-8 w-48 bg-slate-200 rounded mb-4 animate-pulse" />
        <div className="grid lg:grid-cols-[1fr,420px] gap-6">
          <div className="aspect-square rounded-2xl bg-slate-200 animate-pulse" />
          <div className="rounded-2xl bg-white border border-slate-200 p-4 h-[420px] animate-pulse" />
        </div>
      </div>
    );
  }
  if (!p) return <div className="p-6">Not found</div>;

  return (
    <div className="w-full bg-white">
      {/* MOBILE top app bar (like your screenshot) */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-3 py-2 flex items-center gap-3">
          <button onClick={goBack} aria-label="Back" className="p-2 -m-2">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="text-sm font-semibold truncate">{p.name}</div>
          <div className="ml-auto flex items-center gap-2 opacity-80">
            {/* placeholder icons to match the look; only Share is wired */}
            <button aria-label="Search" className="p-2 -m-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 20l-3.5-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button aria-label="Chat" className="p-2 -m-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 1 1 18 0Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button aria-label="Share" onClick={share} className="p-2 -m-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP breadcrumb-like back link */}
      <div className="hidden lg:block">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid lg:grid-cols-[1fr,420px] gap-6 lg:gap-10">
          {/* left: carousel + title */}
          <div>
            <ImageCarousel
              images={p.images}
              alt={p.name}
              radius="rounded-2xl"
            />
            <div className="mt-3 sm:mt-4">
              <div className="text-rose-700 text-[13px] font-semibold">
                Pick-a-Perfume India
              </div>
              <h1 className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900">
                {p.name}
              </h1>
            </div>
          </div>

          {/* right: sticky purchase panel */}
          <aside className="lg:sticky lg:top-20">
            <div className="rounded-2xl border border-slate-200 shadow-sm bg-white p-4 sm:p-5">
              <div className="flex items-end justify-between gap-3">
                <PriceRow
                  price={p.price}
                  mrp={p.mrp}
                  discountPct={p.discountPct}
                  currency={p.currency}
                />
                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("cart:add", { detail: { id: p.id } })
                    )
                  }
                  className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-500 transition"
                >
                  Add to Cart
                </button>
              </div>

              {/* coupons accordion */}
              <details className="mt-5 group">
                <summary className="list-none cursor-pointer select-none">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">
                      Coupons & discounts
                    </div>
                    <svg
                      className="w-4 h-4 transition group-open:rotate-180"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-slate-500">
                    Special discounts from Pick-a-Perfume India
                  </div>
                </summary>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {coupons.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-rose-200 bg-rose-50 p-3"
                    >
                      <div className="text-rose-700 text-sm font-bold">
                        {c.pct}% OFF
                      </div>
                      <div className="text-[13px] text-rose-900/80 mt-1">
                        {c.title}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="px-2 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs font-mono">
                          {c.code}
                        </div>
                        <button
                          onClick={() => copy(c.code)}
                          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500"
                        >
                          Copy coupon code
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {copyMsg && (
                  <div className="text-xs text-emerald-600 mt-2">{copyMsg}</div>
                )}
              </details>
            </div>
          </aside>
        </div>

        <RelatedProducts currentId={p.id} />
      </div>
    </div>
  );
}

function RelatedProducts({ currentId }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await api.get("/products", {
        params: { order: "POPULAR", take: 12 },
      });
      setItems((data?.items || []).filter((x) => x.id !== currentId));
    })();
  }, [currentId]);

  if (!items.length) return null;

  return (
    <div className="mt-8">
      <div className="text-lg font-semibold mb-3">Recommended</div>
      <div
        className="grid gap-3 sm:gap-4 lg:gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
      >
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/p/${p.slug || p.id}`}
            className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] transition-all"
          >
            <div
              className="relative bg-slate-50"
              style={{ paddingTop: "100%" }}
            >
              <img
                src={p.image}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <div className="text-[15px] font-semibold line-clamp-1">
                {p.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
