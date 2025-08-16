// /src/editor/renderers/SearchBlock.jsx
import React from "react";

export default function SearchBlock({ settings = {} }) {
  const {
    outer_background_color = "#ffffff",
    background_color = "#e2e8f0",
    placeholder_text = "Search for products",
    placeholder_text_color = "#6b7280",
    display_search_icon = true,
    search_icon_color = "#6b7280",
    border = false,
    border_size = "1px",
    border_color = "#111827",
    radius = "md",
    sticky_search_bar = true,
  } = settings;

  const radiusClass =
    radius === "sm"
      ? "rounded-sm"
      : radius === "md"
      ? "rounded-md"
      : radius === "lg"
      ? "rounded-lg"
      : "rounded";

  return (
    <div
      className={`w-full px-4 py-3 ${
        sticky_search_bar ? "sticky top-0 z-10" : ""
      }`}
      style={{ backgroundColor: outer_background_color }}
    >
      <div
        className={`flex items-center gap-2 ${radiusClass} px-3 py-2`}
        style={{
          backgroundColor: background_color,
          border: border ? `${border_size} solid ${border_color}` : "none",
        }}
      >
        {display_search_icon && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: search_icon_color }}
          >
            <path
              d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <input
          className="w-full bg-transparent outline-none placeholder:opacity-80"
          placeholder={placeholder_text}
          style={{ color: placeholder_text_color }}
        />
      </div>
    </div>
  );
}
