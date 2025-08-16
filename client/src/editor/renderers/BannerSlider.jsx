// client/src/editor/renderers/BannerSlider.jsx
import React from "react";

export default function BannerSlider({ settings }) {
  const {
    images = [],
    animation_style = "SLIDE",
    slideshow_delay = 3000,
    show_dots = true,
    section_background_color = "#ffffff",
  } = settings || {};

  return (
    <section
      className="p-4 rounded-lg border overflow-hidden"
      style={{ backgroundColor: section_background_color }}
    >
      {/* super-minimal rendering while you wire things up */}
      <div className="text-sm mb-2">
        Slider ({animation_style}, {slideshow_delay}ms)
      </div>
      <div className="grid grid-cols-2 gap-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={typeof img === "string" ? img : img?.src}
            alt={img?.alt || `slide-${i}`}
            className="w-full h-24 object-cover rounded"
          />
        ))}
      </div>
      {show_dots && <div className="mt-2 text-center">• • •</div>}
    </section>
  );
}
