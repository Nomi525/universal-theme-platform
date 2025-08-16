import React from "react";

export default function ProductsInfiniteScroll({ settings }) {
  const {
    products = [],
    section_title = "Infinite Scroll Products",
    section_background_color = "#ffffff",
  } = settings || {};

  return (
    <section
      className="p-4 border rounded-lg"
      style={{ backgroundColor: section_background_color }}
    >
      <h3 className="text-lg font-semibold mb-3">{section_title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {products.map((p, i) => (
          <div key={i} className="p-2 border rounded bg-gray-50">
            <div className="h-20 bg-gray-200 rounded mb-2" />
            <div className="text-sm">{p.name ?? `Product ${i + 1}`}</div>
          </div>
        ))}
      </div>
      {/* You can wire up real infinite scroll later */}
      <div className="mt-3 text-center text-xs text-gray-500">
        Scroll to load more…
      </div>
    </section>
  );
}
