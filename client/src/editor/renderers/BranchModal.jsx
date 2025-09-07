import React, { useEffect } from "react";
import cn from "classnames";

/* Icons (tiny inline SVGs) */
const Icon = {
  close: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        d="M6 6l12 12M18 6l-12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  pin: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
      />
    </svg>
  ),
};

/* Lock/unlock scroll while modal is open */
function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

/**
 * Branch selection modal
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - branches: { id:number|string, name:string, imageUrl?:string }[]
 * - selectedId?: number|string
 * - onSelect?: (branch) => void
 */
export default function BranchModal({
  open,
  onClose,
  branches = [],
  selectedId,
  onSelect,
}) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // fallback so the UI always shows something
  const list = branches.length > 0 ? branches : [{ id: 1, name: "Ahmadabad" }];

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center p-4 sm:p-8"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Select a branch
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Choose the branch closest to your location to ensure timely
              delivery
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
          >
            <Icon.close />
          </button>
        </div>

        {/* content */}
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {list.map((b) => {
              const active = String(selectedId) === String(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onSelect?.(b);
                    onClose();
                  }}
                  className={cn(
                    "group flex flex-col items-center gap-3 rounded-lg border p-4 transition",
                    "hover:border-slate-900 hover:shadow-sm",
                    active ? "border-slate-900" : "border-slate-200"
                  )}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-50 text-slate-400 overflow-hidden">
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt={b.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      /* simple placeholder */
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M7 16l3-3 2 2 4-4 2 2v3H7z"
                          fill="currentColor"
                          opacity=".25"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <span className="text-slate-500">
                      <Icon.pin />
                    </span>
                    <span className="font-medium">{b.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
