import { useEffect, useState } from "react";
import { getAvailable, createBlock } from "../api/design";

export default function AddSectionModal({ branchId = 1, themeId, onClose, onAdded }) {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getAvailable(branchId);
        if (!mounted) return;
        setCatalog(list);
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [branchId]);

  if (!themeId) return null;

  const withSchema = catalog.filter(c => !!c.settings_schema);
  const withoutSchema = catalog.filter(c => !c.settings_schema);

  const handleAdd = async (item) => {
    const settings = item.settings ? JSON.parse(item.settings) : {};
    const payload = {
      theme_id: themeId,
      design_element_id: item.id,
      name: item.name,
      code: item.code,
      position: 999, // append (drag/drop later will reorder)
      settings,
      is_active: 1
    };
    const res = await createBlock(payload);
    onAdded?.(res.id);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-3xl rounded-lg bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Section</h3>
          <button className="text-slate-500" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-slate-500">Loading…</div>
        ) : (
          <>
            <h4 className="mb-2 text-xs font-semibold uppercase text-slate-500">Supported</h4>
            <div className="grid grid-cols-2 gap-3">
              {withSchema.map((it) => (
                <button
                  key={it.id}
                  className="rounded-lg border border-slate-200 p-3 text-left hover:border-indigo-400"
                  onClick={() => handleAdd(it)}
                >
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-slate-500">{it.code}</div>
                </button>
              ))}
            </div>

            {withoutSchema.length > 0 && (
              <>
                <h4 className="mt-6 mb-2 text-xs font-semibold uppercase text-slate-500">
                  Missing form schema
                </h4>
                <div className="grid grid-cols-2 gap-3 opacity-60">
                  {withoutSchema.map((it) => (
                    <div key={it.id} className="rounded-lg border border-amber-200 p-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-white">!</span>
                        <div className="font-medium">{it.name}</div>
                      </div>
                      <div className="text-xs text-slate-500">{it.code}</div>
                      <div className="mt-1 text-xs text-amber-600">Add settings_schema in catalog to enable</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
