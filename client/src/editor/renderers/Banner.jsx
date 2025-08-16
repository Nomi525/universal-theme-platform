// client/src/editor/renderers/Banner.jsx
import React from "react";

export default function Banner({ settings }) {
  const {
    title = "Fresh Fruits & Vegetables",
    subtitle = "Get handpicked fresh fruits and vegetables",
    section_background_color = "#ffffff",
  } = settings || {};

  return (
    <section
      className="p-4 rounded-lg border"
      style={{ backgroundColor: section_background_color }}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
    </section>
  );
}
