import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ImageCarousel({
  images = [],
  alt = "",
  className = "",
  radius = "rounded-2xl",
}) {
  const list = useMemo(
    () => (images?.length ? images : ["/no-image.svg"]),
    [images]
  );
  const railRef = useRef(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIdx(Math.max(0, Math.min(i, list.length - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [list.length]);

  const scrollTo = (i) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={railRef}
        className="w-full overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {list.map((src, i) => (
          <div key={i} className={`shrink-0 w-full snap-start ${radius}`}>
            <div
              className={`relative bg-slate-50 ${radius}`}
              style={{ paddingTop: "100%" }}
            >
              <img
                src={src}
                alt={alt || `Image ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-1.5">
        {list.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to image ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === idx ? "bg-white shadow ring-1 ring-black/10" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
