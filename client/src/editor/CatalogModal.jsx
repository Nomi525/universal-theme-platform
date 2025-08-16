import { useEditorStore } from "./useEditorStore";

export default function CatalogModal() {
  const { catalogOpen, closeCatalog, available, addFromCatalog } =
    useEditorStore();
  if (!catalogOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[720px] max-h-[80vh] overflow-auto rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Add Section</h3>
          <button onClick={closeCatalog} className="text-slate-500">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {available.map((it) => (
            <button
              key={it.id}
              onClick={() => addFromCatalog(it)}
              className="text-left border rounded p-3 hover:bg-slate-50"
            >
              <div className="font-medium">{it.name}</div>
              <div className="text-xs text-slate-500">{it.code}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
