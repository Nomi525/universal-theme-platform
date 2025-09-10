// components/AboutUsCards.tsx
import React from "react";
import {
  MapPin,
  Star,
  Truck,
  LocateFixed,
  CheckCircle2,
  FileText,
  Mail,
  ChevronDown,
} from "lucide-react";

type Bullet = { icon: React.ReactNode; text: string };
type Item = { id: string; title: string; bullets: Bullet[] };

const DEFAULT_ITEMS: Item[] = [
  {
    id: "orders",
    title: "Orders and delivery",
    bullets: [
      { icon: <Truck size={18} />, text: "Delivery across India" },
      { icon: <Star size={18} />, text: "Delivery fee will apply" },
      {
        icon: <Truck size={18} />,
        text: (
          <>
            All orders will be delivered by <b>SampleStore.co</b>
          </>
        ) as any,
      },
      {
        icon: <LocateFixed size={18} />,
        text: "Enter pincode details in home page for estimated delivery timeline",
      },
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation policy",
    bullets: [
      {
        icon: <CheckCircle2 size={18} />,
        text: "Full refund if you cancel it before the order is accepted by us. For any queries on cancellations reach out to us via chat",
      },
    ],
  },
  {
    id: "returns",
    title: "Return policy",
    bullets: [
      {
        icon: <FileText size={18} />,
        text: "For Terms & Conditions Refer to our highlights",
      },
    ],
  },
  {
    id: "reach",
    title: "How to reach us",
    bullets: [
      { icon: <MapPin size={18} />, text: "Jogeshwari West, Mumbai" },
      { icon: <Mail size={18} />, text: "XXXXXXXXXXXXXX014@gmail.com" },
    ],
  },
];

function Card({
  item,
  defaultOpen = true,
}: {
  item: Item;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-slate-200 bg-white shadow-sm transition
                 open:shadow-md open:ring-1 open:ring-slate-200"
    >
      <summary
        className="flex items-center gap-3 px-4 sm:px-6 py-4 cursor-pointer select-none list-none
                   rounded-xl"
      >
        <h3 className="text-[18px] leading-6 font-semibold text-slate-800">
          {item.title}
        </h3>

        {/* Arrow */}
        <ChevronDown
          className="ml-auto h-5 w-5 text-slate-600 transition-transform duration-200
                     group-open:rotate-180 motion-reduce:transition-none"
          strokeWidth={1.75}
          aria-hidden
        />
      </summary>

      {/* subtle divider under header */}
      <div className="h-px bg-slate-200/80 mx-4 sm:mx-6" />

      <div className="px-4 sm:px-6 py-4">
        <ul className="space-y-2.5">
          {item.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-[2px] inline-flex h-5 w-5 items-center justify-center
                           text-slate-500"
                aria-hidden
              >
                {b.icon}
              </span>
              <p className="text-[15px] leading-6 text-slate-600">{b.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export default function AboutUsCards({
  items = DEFAULT_ITEMS,
  allOpen = true,
  className = "",
}: {
  items?: Item[];
  allOpen?: boolean; // all expanded by default
  className?: string;
}) {
  return (
    <section className={`bg-transparent pb-2 ${className}`}>
      {/* Section label */}
      <div className="px-4 sm:px-6 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.18em] text-slate-500 font-semibold uppercase">
            ABOUT US
          </span>
          {/* dotted, ultra-light rule */}
          <span className="h-[1px] flex-1 border-t border-dotted border-slate-300/60 translate-y-[1px]" />
        </div>
      </div>

      {/* thin hairline on very top edge (optional) */}
      {/* <div className="border-t border-slate-900/10" /> */}

      <div className="mx-4 sm:mx-6 my-3 grid gap-3">
        {items.map((it) => (
          <Card key={it.id} item={it} defaultOpen={allOpen} />
        ))}
      </div>
    </section>
  );
}
