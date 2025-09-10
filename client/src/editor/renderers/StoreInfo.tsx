/******************************************************
 * StoreInfo.tsx — Left flush enterprise section
 ******************************************************/
import React, { useEffect, useRef, useState } from "react";

type Settings = {
  enabled?: boolean;
  section_background_color?: string;
  max_width_px?: number;
  section_top_margin?: string;
  section_bottom_margin?: string;

  use_card?: boolean;
  card_background?: string;
  card_border_color?: string;
  card_radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  card_shadow?: "none" | "sm" | "md";
  card_padding_y?: number;
  card_padding_x?: number;

  show_accent_bar?: boolean;
  accent_bar_color?: string;
  accent_bar_width_px?: number;

  text?: string;
  text_color?: string;
  font_size?: "text-xs" | "text-sm" | "text-base" | "text-lg";
  line_height?: "leading-5" | "leading-6" | "leading-7";

  reveal_from_left?: boolean;
  custom_css?: string | null;
};

const radiusToClass: Record<NonNullable<Settings["card_radius"]>, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const shadowToClass: Record<NonNullable<Settings["card_shadow"]>, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
};

export default function StoreInfo({ settings }: { settings: Settings }) {
  const {
    enabled = true,
    section_background_color = "#ffffff",
    max_width_px = 720,
    section_top_margin = "0rem",
    section_bottom_margin = "0.75rem",

    use_card = true,
    card_background = "#ffffff",
    card_border_color = "#E5E7EB",
    card_radius = "md",
    card_shadow = "none",
    card_padding_y = 12,
    card_padding_x = 16,

    show_accent_bar = true,
    accent_bar_color = "#D1D5DB",
    accent_bar_width_px = 4,

    text = "",
    text_color = "#374151",
    font_size = "text-base",
    line_height = "leading-6",

    reveal_from_left = true,
    custom_css,
  } = settings || {};

  if (!enabled) return null;

  const parts = String(text).split("\n");

  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!reveal_from_left);
  useEffect(() => {
    if (!reveal_from_left) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [reveal_from_left]);

  return (
    <section
      className="w-full"
      style={{ background: section_background_color }}
    >
      <style>{`
        .flush-left {
          margin-left: 0;
          margin-right: 0;
          max-width: 100vw;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        @media (min-width: 768px) {
          .flush-left { padding-left: 2rem; padding-right: 2rem; }
        }
        .store-info-enter { transform: translateX(-14px); opacity: 0; }
        .store-info-enter.store-info-enter-active {
          transform: translateX(0); opacity: 1;
          transition: transform 320ms ease, opacity 320ms ease;
        }
        ${custom_css || ""}
      `}</style>

      <div
        className="w-full flush-left"
        style={{
          marginTop: section_top_margin,
          marginBottom: section_bottom_margin,
        }}
      >
        <div
          ref={ref}
          className={[
            reveal_from_left ? "store-info-enter" : "",
            visible ? "store-info-enter-active" : "",
            "flex items-stretch",
          ].join(" ")}
        >
          {use_card && show_accent_bar && (
            <div
              className="shrink-0"
              style={{
                width: accent_bar_width_px,
                background: accent_bar_color,
              }}
            />
          )}

          <div
            className={[
              use_card ? "border" : "",
              use_card ? radiusToClass[card_radius] : "",
              use_card ? shadowToClass[card_shadow] : "",
              "w-full",
            ].join(" ")}
            style={{
              background: use_card ? card_background : "transparent",
              borderColor: use_card ? card_border_color : "transparent",
              padding: use_card ? `${card_padding_y}px ${card_padding_x}px` : 0,
            }}
          >
            <div className="text-left">
              <p
                className={`${font_size} ${line_height}`}
                style={{ color: text_color, margin: 0, maxWidth: max_width_px }}
              >
                {parts.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < parts.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
