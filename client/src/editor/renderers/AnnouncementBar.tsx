import React, { useMemo } from "react";

type JsonRecord = Record<string, any>;
type Props = { settings: JsonRecord };

/**
 * Minimal, clean Announcement Bar
 * - Neutral defaults (white bg, black text)
 * - No dismiss / no "X"
 * - Marquee OFF by default (can be toggled via settings.marquee_enabled)
 * - Left / Right buttons OFF by default (toggle with left_button_show / right_button_show)
 * - Few, predictable settings only
 */
export default function AnnouncementBar({ settings }: Props) {
  const s = useMemo(
    () => ({
      // ON/OFF
      enabled: true,

      // Layout / style
      align: "center" as "left" | "center" | "right",
      height: "3rem",
      padding_x: "1rem",
      section_background_color: "#ffffff",
      text_color: "#111827",

      // Content
      message: "Your announcement here",

      // Marquee
      marquee_enabled: false,
      marquee_speed: 40, // px/s (bigger = faster)
      marquee_direction: "left" as "left" | "right",

      // Left pill/button
      left_button_show: false,
      left_button_label: "FREE SHIPPING",
      left_button_href: "",
      left_button_text_color: "#111827",
      left_button_bg_color: "#ffffff",
      left_button_border: true,
      left_button_border_color: "#111827",
      left_button_radius: "full",
      left_button_padding_x: "0.75rem",
      left_button_padding_y: "0.25rem",

      // Right CTA
      right_button_show: false,
      right_button_label: "Shop Now",
      right_button_href: "/collections/all",
      right_button_text_color: "#ffffff",
      right_button_bg_color: "#111827",
      right_button_radius: "md",
      right_button_padding_x: "0.75rem",
      right_button_padding_y: "0.5rem",

      // Visibility
      visibility: "all" as "all" | "desktop" | "mobile",

      // Advanced
      custom_css: null as string | null,

      // merge incoming
      ...settings,
    }),
    [settings]
  );

  if (!s.enabled) return null;

  // helpers
  const radiusToClass = (r: string) =>
    ((
      {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      } as Record<string, string>
    )[r] || "rounded-md");

  const alignClass =
    s.align === "left"
      ? "justify-start"
      : s.align === "right"
      ? "justify-end"
      : "justify-center";

  const visibilityClass =
    s.visibility === "desktop"
      ? "hidden md:block"
      : s.visibility === "mobile"
      ? "md:hidden"
      : "";

  const centerText =
    typeof s.message === "string" && !s.marquee_enabled && s.message.length > 35
      ? s.message.slice(0, 35) + "…"
      : s.message;

  // marquee
  const marqueeId = useMemo(
    () => "ab_marquee_" + Math.random().toString(36).slice(2),
    []
  );
  const marqueeDurationSec = Math.max(
    1,
    Math.round(600 / Number(s.marquee_speed || 40))
  );

  const ButtonLike = ({
    label,
    href,
    textColor,
    bgColor,
    border,
    borderColor,
    radius,
    px,
    py,
    className,
    ariaLabel,
  }: {
    label: string;
    href?: string;
    textColor: string;
    bgColor: string;
    border?: boolean;
    borderColor?: string;
    radius: string;
    px: string;
    py: string;
    className?: string;
    ariaLabel?: string;
  }) => {
    const base = (
      <span
        className={`inline-flex items-center text-sm font-medium ${radiusToClass(
          radius
        )} ${className || ""}`}
        style={{
          color: textColor,
          background: bgColor,
          paddingInline: px,
          paddingBlock: py,
          border: border ? `1px solid ${borderColor || textColor}` : undefined,
        }}
      >
        {label}
      </span>
    );

    return href ? (
      <a href={href} aria-label={ariaLabel || label} className="shrink-0">
        {base}
      </a>
    ) : (
      base
    );
  };

  const CenterContent = s.marquee_enabled ? (
    <div className="relative overflow-hidden w-full">
      <style>{`
        @keyframes ${marqueeId} {
          0% { transform: translateX(${
            s.marquee_direction === "right" ? "-100%" : "0"
          }); }
          100% { transform: translateX(${
            s.marquee_direction === "right" ? "0" : "-100%"
          }); }
        }
      `}</style>
      <div
        className="whitespace-nowrap will-change-transform"
        style={{
          animation: `${marqueeId} ${marqueeDurationSec}s linear infinite`,
          color: s.text_color,
        }}
      >
        <span className="mx-6">{s.message}</span>
        <span className="mx-6">{s.message}</span>
        <span className="mx-6">{s.message}</span>
      </div>
    </div>
  ) : (
    <div
      className="text-sm sm:text-base font-medium text-center"
      style={{ color: s.text_color, textAlign: s.align as any }}
    >
      {centerText}
    </div>
  );

  return (
    <div
      className={`${visibilityClass}`}
      style={{ background: s.section_background_color, height: s.height }}
      role="region"
      aria-label="Store announcement"
    >
      <div
        className={`relative h-full w-full flex items-center ${alignClass} gap-3 sm:gap-4`}
        style={{ paddingInline: s.padding_x }}
      >
        {s.left_button_show && s.left_button_label ? (
          <div className="block">
            <ButtonLike
              label={s.left_button_label}
              href={s.left_button_href}
              textColor={s.left_button_text_color}
              bgColor={s.left_button_bg_color}
              border={!!s.left_button_border}
              borderColor={s.left_button_border_color}
              radius={s.left_button_radius}
              // tighter padding on mobile, normal from sm up
              px="0.5rem"
              py="0.125rem"
              className="sm:px-3 sm:py-1 tracking-tight"
            />
          </div>
        ) : null}

        <div className="flex-1 min-w-0">{CenterContent}</div>

        {s.right_button_show && s.right_button_label ? (
          <ButtonLike
            label={s.right_button_label}
            href={s.right_button_href}
            textColor={s.right_button_text_color}
            bgColor={s.right_button_bg_color}
            border={false}
            radius={s.right_button_radius}
            px={s.right_button_padding_x}
            py={s.right_button_padding_y}
            ariaLabel={s.right_button_label}
          />
        ) : null}
      </div>

      {s.custom_css ? <style>{String(s.custom_css)}</style> : null}
    </div>
  );
}
