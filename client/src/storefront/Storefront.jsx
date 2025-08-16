import { useEffect, useState } from "react";
import { getData } from "../api/design";
import { RenderBlock } from "../editor/renderers";

export default function Storefront() {
  const [payload, setPayload] = useState(null);
  useEffect(() => {
    getData(1).then(setPayload);
  }, []);
  if (!payload) return <div className="p-6">Loading…</div>;

  const layout = (payload.layout || []).sort((a, b) => a.position - b.position);
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-4 space-y-4">
        {layout.map((item) => (
          <div key={item.id} className="bg-white rounded shadow-sm">
            <RenderBlock code={item.code} settings={item.settings} />
          </div>
        ))}
      </div>
    </div>
  );
}
