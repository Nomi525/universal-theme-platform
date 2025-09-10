import { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";

/* ---------- tiny helpers ---------- */
const vis = (v) =>
  v === "desktop" ? "hidden md:block" : v === "mobile" ? "block md:hidden" : "";

const clampInt = (v, lo, hi, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, lo), hi) : d;
};

/* ---------- icons ---------- */
const PinIcon = ({ className, color = "#7c3aed" }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="gradPin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#b794f4" />
      </linearGradient>
    </defs>
    <path
      fill="url(#gradPin)"
      d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 10.5A3.5 3.5 0 1 1 12 5.5a3.5 3.5 0 0 1 0 7Z"
    />
  </svg>
);

/* ---------- modal ---------- */
function Modal({ open, onClose, onApply, accent = "#7c3aed" }) {
  const [pin, setPin] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  const valid = /^\d{5,6}$/.test((pin || "").trim());

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const apply = () => {
    if (valid) onApply(pin.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pincode_title"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-5"
        onMouseDown={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center">
            <PinIcon color={accent} />
          </div>
          <div>
            <h2
              id="pincode_title"
              className="text-lg font-semibold text-slate-900"
            >
              Enter pincode
            </h2>
            <p className="text-slate-500 -mt-0.5">
              to view delivery information
            </p>
          </div>
        </div>

        <label className="sr-only" htmlFor="pincode_input">
          Pincode
        </label>
        <input
          id="pincode_input"
          ref={inputRef}
          className={cn(
            "w-full rounded-2xl px-4 py-3 text-[15px] outline-none",
            "border transition-colors",
            valid
              ? "border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/40"
              : "border-slate-300 focus:ring-2 focus:ring-slate-200"
          )}
          placeholder="Pincode"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />

        {!valid && touched && (
          <p className="mt-2 text-xs text-slate-500">
            Enter a valid 5–6 digit code.
          </p>
        )}

        <button
          onClick={apply}
          disabled={!valid}
          className="mt-4 w-full rounded-2xl px-4 py-3 text-[15px] font-semibold text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: valid ? accent : "#9ca3af" }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

/* ---------- main ---------- */
export default function StoreDeliveryInfo({ settings = {} }) {
  const s = settings || {};
  const accent = s.accent_color || "#7c3aed";
  const textColor = s.text_color || "#111827";
  const visibility = s.visibility || "all";
  const storeName =
    s.store_name ||
    (typeof window !== "undefined" && window.__STORE_NAME) ||
    "Your Store";

  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [days, setDays] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("delivery_info") || "{}");
      if (saved.pin) setPin(saved.pin);
      if (saved.days) setDays(saved.days);
    } catch {
      /* ignore */
    }
  }, []);

  const minDays = clampInt(s.min_days, 1, 10, 1);
  const maxDays = Math.max(minDays, clampInt(s.max_days, 1, 30, 5));

  const handleApply = (p) => {
    const base = p.split("").reduce((a, c) => a + (c.charCodeAt(0) % 10), 0);
    const range = maxDays - minDays + 1;
    const d = minDays + (base % range);

    setPin(p);
    setDays(d);
    try {
      localStorage.setItem(
        "delivery_info",
        JSON.stringify({ pin: p, days: d })
      );
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const leftText = useMemo(() => {
    if (!pin || !days) return `Direct delivery by ${storeName}`;
    return `${storeName} delivers in ${days} ${days > 1 ? "days" : "day"}`;
  }, [pin, days, storeName]);

  const rowClass = cn("w-full", "backdrop-blur-[1px]", vis(visibility));

  return (
    <>
      {/* OUTER wrapper: prevents any theme borders/overflow */}
      <div
        className={cn(
          rowClass,
          "overflow-x-clip max-w-full border-0 rounded-none shadow-none"
        )}
        style={{ backgroundColor: s.background_color || "#ffffff" }}
      >
        {/* INNER card with a 2-column grid (icon | text). 
            Button sits in the text column on the next row — EXACT left alignment under the first line. */}
        <div
          className="px-4 md:px-6 py-4 md:py-5 w-full max-w-full
                     bg-white rounded-xl ring-1 ring-slate-200/80 shadow-sm"
          style={{ color: textColor }}
        >
          <div className="grid grid-cols-[28px,1fr] gap-x-3 gap-y-2 items-start">
            {/* Icon column spans both rows */}
            <div className="row-span-2 h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
              <PinIcon color={accent} />
            </div>

            {/* Row 1, col 2: main line */}
            <div className="text-sm md:text-base font-medium text-slate-900">
              {leftText}
            </div>

            {/* Row 2, col 2: CTA aligned LEFT (inside the red area) */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="justify-self-start text-sm md:text-base font-semibold hover:underline focus:outline-none"
              style={{ color: accent }}
              aria-label="Get delivery information"
            >
              Get delivery information <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onApply={handleApply}
        accent={accent}
      />

      {s.custom_css ? <style>{s.custom_css}</style> : null}
    </>
  );
}
