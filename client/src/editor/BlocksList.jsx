import { useEditorStore } from "./useEditorStore";
import cn from "classnames";

export default function BlocksList() {
  const { theme, selectBlock, selectedBlockId, reorder, remove, toggleActive } =
    useEditorStore();
  if (!theme) return null;
  const blocks = [...theme.design_elements].sort(
    (a, b) => a.position - b.position
  );

  return (
    <div className="border-r w-80 p-3 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Blocks</h3>
      </div>
      {blocks.map((b) => (
        <div
          key={b.id}
          className={cn(
            "rounded border p-2 text-sm cursor-pointer",
            selectedBlockId === b.id
              ? "ring-2 ring-indigo-500"
              : "hover:bg-slate-50"
          )}
          onClick={() => selectBlock(b.id)}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{b.custom_name || b.name}</div>
              <div className="text-xs text-slate-500">{b.code}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-1"
                onClick={(e) => {
                  e.stopPropagation();
                  reorder(b.id, "up");
                }}
              >
                ↑
              </button>
              <button
                className="px-1"
                onClick={(e) => {
                  e.stopPropagation();
                  reorder(b.id, "down");
                }}
              >
                ↓
              </button>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              className="text-xs px-2 py-1 bg-slate-200 rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleActive(b.id, b.is_active ? 0 : 1);
              }}
            >
              {b.is_active ? "Deactivate" : "Activate"}
            </button>
            <button
              className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded"
              onClick={(e) => {
                e.stopPropagation();
                remove(b.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
