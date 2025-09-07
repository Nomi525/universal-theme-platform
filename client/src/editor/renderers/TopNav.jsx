// client/src/editor/renderers/TopNav.jsx
import cn from "classnames";
import { useEffect, useRef, useState } from "react";

/* ---------- helpers ---------- */

const radiusClass = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

const visibilityClass = (v) => {
  switch (v) {
    case "desktop":
      return "hidden md:block";
    case "mobile":
      return "block md:hidden";
    default:
      return "";
  }
};

const Icon = {
  // tiny inline SVGs so no icon lib needed
  menu: (props) => (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path
        d="M3 6h18M3 12h18M3 18h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  search: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <circle
        cx="11"
        cy="11"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 20l-3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  back: (props) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        d="M15 6l-6 6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
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

function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [active]);
}

/* ---------- UI bits ---------- */

const Button = ({ kind, color, onClick, branchLabel }) => {
  if (!kind || kind === "NONE") return null;

  const icon =
    kind === "MENU" ? (
      <Icon.menu />
    ) : kind === "SEARCH" ? (
      <Icon.search />
    ) : kind === "BRANCH" ? (
      <Icon.pin />
    ) : null;

  const defaultLabel = kind[0] + kind.slice(1).toLowerCase();
  const label = kind === "BRANCH" ? branchLabel || "Branch" : defaultLabel;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-md hover:bg-slate-100"
      style={{ color }}
      aria-label={label}
    >
      <span className="opacity-80">{icon}</span>
      <span
        className={
          kind === "BRANCH" ? "opacity-80" : "hidden sm:inline opacity-80"
        }
      >
        {label}
      </span>
    </button>
  );
};

const Logo = ({ type, textColor }) => {
  if (type === "none") return null;
  // Placeholder text logo. If you store a URL (settings.logo_url), swap to <img src={...} />
  return (
    <div style={{ color: textColor, fontWeight: 700, letterSpacing: 2 }}>
      LOGO
    </div>
  );
};

/** Clickable search “input” on desktop (opens modal) */
const DesktopSearchButton = ({ s, onOpen }) => {
  const style = {
    backgroundColor: s.desktop_search_bar_background_color || "#e2e8f0",
    color: s.desktop_search_bar_placeholder_text_color || "#6b7280",
    ...(s.desktop_search_bar_border
      ? {
          borderStyle: "solid",
          borderWidth: s.desktop_search_bar_border_size || "1px",
          borderColor: s.desktop_search_bar_border_color || "#e5e7eb",
        }
      : { borderWidth: 0 }),
  };

  return (
    <button
      type="button"
      className={cn(
        "hidden md:flex w-[32rem] max-w-[40vw] items-center px-3 py-2 cursor-text",
        "focus:outline-none focus:ring-2 focus:ring-slate-300/70",
        radiusClass[s.desktop_search_bar_radius || "md"]
      )}
      style={style}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      aria-label="Open search"
    >
      {s.desktop_search_bar_display_search_icon && (
        <span
          className="mr-2 opacity-70"
          style={{ color: s.desktop_search_bar_search_icon_color || "#6b7280" }}
        >
          <Icon.search />
        </span>
      )}
      <span className="w-full text-left text-sm opacity-80">
        {s.desktop_search_bar_placeholder_text || "Search for products"}
      </span>
    </button>
  );
};

/** Centered modal/dialog search */
const SearchDialog = ({ open, onClose, placeholder }) => {
  useLockBodyScroll(open);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    // autofocus a tick later so Safari focuses correctly
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 flex items-start justify-center p-4 sm:p-8"
      onMouseDown={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-5 right-0 sm:-top-6 sm:-right-6 h-10 w-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center"
        >
          <Icon.close />
        </button>

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="p-1 rounded hover:bg-slate-100 text-slate-700"
            >
              <Icon.back />
            </button>
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              placeholder={placeholder || "Search for categories or products"}
            />
            <span className="text-slate-600 opacity-80">
              <Icon.search />
            </span>
          </div>

          {/* Results area placeholder */}
          <div className="min-h-[60vh] md:min-h-[55vh]" />
        </div>
      </div>
    </div>
  );
};

/** Centered modal/dialog branch picker */
const BranchDialog = ({
  open,
  onClose,
  branches = [],
  selectedId,
  onSelect,
}) => {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const list = branches.length ? branches : [{ id: 1, name: "Ahmadabad" }];

  return (
    <div
      className="fixed inset-0 z-[1001] bg-black/60 flex items-start justify-center p-4 sm:p-8"
      onMouseDown={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-5 right-0 sm:-top-6 sm:-right-6 h-10 w-10 rounded-full bg-slate-800/80 text-white flex items-center justify-center"
        >
          <Icon.close />
        </button>

        <div className="border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Select a branch
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Choose the branch closest to your location to ensure timely delivery
          </p>
        </div>

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
                    active
                      ? "border-slate-900"
                      : "border-slate-200 hover:border-slate-900",
                    "hover:shadow-sm"
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
};

/* ---------- main component ---------- */

export default function TopNav({ settings = {} }) {
  const s = settings || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);

  // branches: try from settings, then a global, then a fallback
  const initialBranches = (() => {
    if (Array.isArray(s.branches)) return s.branches;
    if (Array.isArray(s.branch_list)) return s.branch_list;
    if (Array.isArray(s.__branches)) return s.__branches;
    if (typeof window !== "undefined" && Array.isArray(window.__BRANCHES))
      return window.__BRANCHES;
    return [{ id: 1, name: "Ahmadabad" }];
  })();

  const [branches] = useState(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("selected_branch")
          : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const classes = cn(
    "w-full",
    visibilityClass(s.visibility),
    s.sticky_header ? "sticky top-0 z-40" : "",
    s.border ? "border-b border-slate-200" : ""
  );

  const rowClass = "mx-auto max-w-6xl px-4 py-3 flex items-center gap-3";

  const openSearch = () => setSearchOpen(true);

  // Ensure label shows a valid name
  const branchLabel = selectedBranch?.name || branches[0]?.name || "Branch";

  return (
    <>
      <header
        className={classes}
        style={{ backgroundColor: s.background_color || "#fff" }}
      >
        <div className={rowClass}>
          {/* Left button (menu/search/branch/etc.) */}
          <div className="w-28">
            <Button
              kind={s.left_button}
              color={s.text_color || "#111827"}
              branchLabel={branchLabel}
              onClick={() => {
                if (s.left_button === "MENU") setMenuOpen(true);
                if (s.left_button === "SEARCH") openSearch();
                if (s.left_button === "BRANCH") setBranchOpen(true);
              }}
            />
          </div>

          {/* Center area: logo left/center */}
          <div
            className={cn(
              "flex-1 flex items-center",
              s.logo_placement === "center" ? "justify-center" : "justify-start"
            )}
          >
            <Logo
              type={s.logo_type || "default"}
              textColor={s.text_color || "#111827"}
            />
          </div>

          {/* Desktop search (clickable anywhere) */}
          <DesktopSearchButton s={s} onOpen={openSearch} />

          {/* Right button */}
          <div className="w-28 flex justify-end">
            <Button
              kind={s.right_button}
              color={s.text_color || "#111827"}
              branchLabel={branchLabel}
              onClick={() => {
                if (s.right_button === "MENU") setMenuOpen(true);
                if (s.right_button === "SEARCH") openSearch();
                if (s.right_button === "BRANCH") setBranchOpen(true);
              }}
            />
          </div>
        </div>
      </header>

      {/* Side menu drawer (opens only when MENU chosen) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-black/60"
          onMouseDown={() => setMenuOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <aside
            className="absolute left-0 top-0 h-full w-[85vw] max-w-sm bg-white shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="font-semibold">Menu</div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <Icon.close />
              </button>
            </div>

            <nav className="p-2 space-y-1 text-sm">
              {/* custom links */}
              {Array.isArray(s.menu_items) &&
                s.menu_items.map((it, i) => (
                  <a
                    key={i}
                    href={it?.href || "#"}
                    className="block rounded px-3 py-2 hover:bg-slate-50"
                  >
                    {it?.label || "Link"}
                  </a>
                ))}

              {/* categories toggle */}
              {s.display_categories_on_menu && (
                <div className="mt-3 border-t pt-3">
                  <div className="px-3 py-2 font-semibold text-slate-700">
                    Categories
                  </div>
                  {/* Populate with your real categories list */}
                  <div className="px-3 py-2 text-slate-500">…</div>
                </div>
              )}
            </nav>
          </aside>
        </div>
      )}

      {/* Centered search dialog */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        placeholder="Search for categories or products"
      />

      {/* Centered branch dialog */}
      <BranchDialog
        open={branchOpen}
        onClose={() => setBranchOpen(false)}
        branches={branches}
        selectedId={selectedBranch?.id}
        onSelect={(b) => {
          setSelectedBranch(b);
          try {
            localStorage.setItem("selected_branch", JSON.stringify(b));
          } catch { /* empty */ }
        }}
      />

      {/* Optional scoped custom CSS */}
      {s.custom_css ? <style>{s.custom_css}</style> : null}
    </>
  );
}
