// client/src/storefront/Storefront.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getData } from "../api/design";
import ProductDetails from "../editor/renderers/ProductDetails";
import { RenderBlock } from "../editor/renderers";

/* Detect editor vs storefront */
function useIsEditorPage() {
  const [isEditor, setIsEditor] = useState(false);
  useEffect(() => {
    try {
      const p = window.location.pathname || "";
      const q = window.location.search || "";
      const inEditor =
        /(^|\/)(editor|admin)(\/|$)/i.test(p) ||
        /[?&](editor|preview)=1\b/i.test(q);
      setIsEditor(inEditor);
    } catch {
      setIsEditor(false);
    }
  }, []);
  return isEditor;
}

/** Home renderer used for the "/" route */
function StorefrontHome() {
  const [payload, setPayload] = useState(null);
  const isEditor = useIsEditorPage();

  useEffect(() => {
    getData(1).then(setPayload);
  }, []);

  const layout = useMemo(() => {
    const list = (payload?.layout ?? []).slice();
    list.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));
    return list;
  }, [payload?.layout]);

  if (!payload) return <div className="p-6">Loading…</div>;

  // Tight page look: no inter-block spacing on storefront
  const shellClass = isEditor
    ? "mx-auto max-w-6xl p-4 space-y-4"
    : "w-full max-w-none p-0 space-y-0";

  const cardClass = isEditor ? "bg-white rounded shadow-sm" : "bg-transparent";

  return (
    <div className="min-h-screen bg-white">
      <div className={shellClass}>
        {layout.map((item) => (
          <div key={item.id} className={cardClass}>
            <RenderBlock code={item.code} settings={item.settings} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Export routes (Router is provided in main.jsx) */
export default function Storefront() {
  return (
    <Routes>
      <Route path="/" element={<StorefrontHome />} />
      <Route path="/p/:idOrSlug" element={<ProductDetails />} />
    </Routes>
  );
}
