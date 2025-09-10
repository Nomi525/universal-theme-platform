import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  stars?: number; // 0..5
  feedback: string;
};

type SettingsShape = {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  autoSlide?: boolean;
  slideInterval?: number; // ms
  section_background_color?: string;
};

type Props =
  | { settings?: SettingsShape } // registry-style
  | {
      title?: string;
      subtitle?: string;
      testimonials?: Testimonial[];
      autoSlide?: boolean;
      slideInterval?: number;
      section_background_color?: string;
    };

const FALLBACKS: Testimonial[] = [
  {
    name: "Stefan Jare",
    role: "Founder & CEO",
    company: "Prive Retes",
    avatar: "https://i.pravatar.cc/80?img=14",
    stars: 5,
    feedback:
      "Love the design and customisation options. Super fast support as well!",
  },
  {
    name: "Georget Kilo",
    role: "Business Manager",
    company: "Retook",
    avatar: "https://i.pravatar.cc/80?img=22",
    stars: 5,
    feedback:
      "Flexible and easy to use without requiring any CSS. Highly recommended.",
  },
  {
    name: "Marian Campoesi",
    role: "Entrepreneur",
    company: "iZettle",
    avatar: "https://i.pravatar.cc/80?img=5",
    stars: 5,
    feedback:
      "Works exactly as advertised. Leaps and bounds above any other plugin I’ve tried.",
  },
  {
    name: "Ivy Fernandez",
    role: "Ops Lead",
    company: "GlowCo",
    avatar: "https://i.pravatar.cc/80?img=48",
    stars: 5,
    feedback: "Clean UI and smooth UX — our customers love it.",
  },
  {
    name: "Akshay N.",
    role: "Owner",
    company: "CosmoMart",
    avatar: "https://i.pravatar.cc/80?img=12",
    stars: 5,
    feedback: "I’ve tried various apps before but none this flexible.",
  },
];

export default function CustomerTestimonials(rawProps: Props) {
  // Normalize props (works with registry {settings} or direct props)
  const s = (rawProps as any).settings ?? rawProps ?? {};
  const title: string = s.title ?? "What our clients say";
  const subtitle: string | undefined = s.subtitle;
  const autoSlide: boolean = s.autoSlide ?? true;
  const slideInterval: number = s.slideInterval ?? 5000;
  const bg = s.section_background_color ?? "#ffffff";

  const testimonials: Testimonial[] = useMemo(() => {
    const list = Array.isArray(s.testimonials) ? s.testimonials : [];
    return list.length ? list : FALLBACKS;
  }, [s.testimonials]);

  const total = testimonials.length;

  // How many cards per view? mobile=1, desktop(lg)=3
  const [perView, setPerView] = useState<number>(1);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setPerView(mq.matches ? 3 : 1);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Current start index
  const [index, setIndex] = useState(0);
  const lastStart = Math.max(0, total - perView);
  const pageCount = Math.max(1, Math.ceil(total / perView));

  // Keep index in safe bounds when perView or total changes
  useEffect(() => {
    setIndex((i) => Math.min(i, lastStart));
  }, [lastStart]);

  // Auto-slide
  useEffect(() => {
    if (!autoSlide || total <= perView) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i >= lastStart ? 0 : i + 1));
    }, Math.max(1500, Number(slideInterval) || 5000));
    return () => window.clearInterval(t);
  }, [autoSlide, slideInterval, total, perView, lastStart]);

  // Translate distance for each step (percentage of track)
  const stepPercent = 100 / perView;
  const trackTranslate = -(index * stepPercent);

  const prev = () => setIndex((i) => (i <= 0 ? lastStart : i - 1));
  const next = () => setIndex((i) => (i >= lastStart ? 0 : i + 1));

  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef as any}
      className="py-8 sm:py-12 pb-20 sm:pb-12" // extra bottom space for sticky footer on mobile
      style={{ backgroundColor: bg }}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">{subtitle}</p>
        )}

        <div className="relative mt-6 sm:mt-8">
          {/* viewport */}
          <div className="overflow-hidden">
            {/* track */}
            <div
              className="flex transition-transform duration-500 will-change-transform"
              style={{ transform: `translateX(${trackTranslate}%)` }}
            >
              {testimonials.map((t, i) => {
                const stars = Math.max(
                  0,
                  Math.min(5, Math.round(t.stars ?? 5))
                );
                return (
                  <div
                    key={i}
                    className="
                      w-full lg:w-1/3 flex-shrink-0 px-2 sm:px-3 lg:px-4
                    "
                    // each item is 100% (mobile) or 33.33% (desktop)
                  >
                    <div
                      className="
                        w-full bg-white rounded-2xl border border-slate-200 shadow-sm
                        p-4 sm:p-6 text-left min-h-[220px]
                      "
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <img
                          src={
                            t.avatar ||
                            `https://i.pravatar.cc/80?u=${encodeURIComponent(
                              t.name
                            )}`
                          }
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">
                            {t.name}
                          </div>
                          {(t.role || t.company) && (
                            <div className="text-xs text-slate-500">
                              {t.role}
                              {t.role && t.company ? " · " : ""}
                              {t.company}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1 text-amber-400 text-sm mb-3"
                        aria-label={`${stars} out of 5 stars`}
                      >
                        {"★".repeat(stars)}
                        {"☆".repeat(5 - stars)}
                      </div>

                      <p className="text-slate-700 leading-relaxed">
                        “{t.feedback}”
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* arrows */}
          {total > perView && (
            <>
              <button
                onClick={prev}
                aria-label="Previous testimonials"
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 z-10"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={next}
                aria-label="Next testimonials"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* dots */}
          {pageCount > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, p) => {
                const startForPage = p * perView;
                const active =
                  index >= startForPage &&
                  index < Math.min(startForPage + perView, total);
                return (
                  <button
                    key={p}
                    aria-label={`Go to testimonials page ${p + 1}`}
                    onClick={() => setIndex(startForPage)}
                    className={`h-1.5 rounded-full transition-all ${
                      active ? "w-6 bg-slate-900" : "w-2 bg-slate-300"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
