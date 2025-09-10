import React, { useMemo } from "react";

// rupees/paise/“₹7,400” → paise
const toPaise = (v) => {
  if (v == null || v === "") return 0;
  if (typeof v === "number")
    return v >= 10000 ? Math.round(v) : Math.round(v * 100);
  const s = String(v).replace(/[^\d.]/g, "");
  if (!s) return 0;
  const n = Number(s);
  return isFinite(n) ? Math.round(n * 100) : 0;
};

const Price = ({ value = 0, currency = "INR", noGroup = true }) => {
  const formatted = useMemo(() => {
    const rupees = Math.round((value ?? 0) / 100);
    if (currency === "INR")
      return "₹" + (noGroup ? String(rupees) : rupees.toLocaleString("en-IN"));
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(rupees);
  }, [value, currency, noGroup]);
  return <span>{formatted}</span>;
};

export default function PriceRow({
  price,
  mrp,
  discountPct,
  currency = "INR",
}) {
  const p = toPaise(price);
  let strike = toPaise(mrp);
  let pct = null;

  if (strike > p && p > 0) {
    pct = Math.round(((strike - p) / strike) * 100);
  } else if (discountPct != null) {
    const n = Number(String(discountPct).replace(/[^\d]/g, ""));
    if (isFinite(n) && n > 0 && n < 95) {
      pct = Math.round(n);
      if (p > 0 && strike <= p) strike = Math.round(p / (1 - pct / 100));
    }
  }

  return (
    <div>
      <div className="flex items-baseline gap-2 leading-none">
        <span className="text-[18px] font-semibold text-slate-900">
          <Price value={p} currency={currency} />
        </span>
        {pct != null && (
          <span className="text-[13px] font-semibold text-amber-600">
            ({pct}% Off)
          </span>
        )}
      </div>
      {strike > p && (
        <div className="mt-1 text-[13px] text-slate-400 line-through">
          <Price value={strike} currency={currency} />
        </div>
      )}
    </div>
  );
}
