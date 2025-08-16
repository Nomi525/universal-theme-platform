import { useEditorStore } from "./useEditorStore";

export default function PublishBar() {
  const { openCatalog, publish } = useEditorStore();
  return (
    <div className="border-t p-2 flex justify-between items-center">
      <button onClick={openCatalog} className="px-3 py-2 bg-slate-200 rounded">
        + Add Section
      </button>
      <button
        onClick={publish}
        className="px-3 py-2 bg-emerald-600 text-white rounded"
      >
        Publish
      </button>
    </div>
  );
}
