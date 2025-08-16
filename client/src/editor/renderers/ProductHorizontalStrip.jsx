import React from "react";

export default function ProductHorizontalStrip({ settings }) {
  const { section_title = "Products", products = [] } = settings || {};

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{section_title}</h3>
      <div className="flex gap-3 overflow-x-auto">
        {products.map((p, i) => (
          <div key={i} className="min-w-[140px] p-3 rounded border">
            <div className="h-20 bg-gray-100 rounded mb-2" />
            <div className="text-xs">{p.name ?? `Product ${i + 1}`}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
