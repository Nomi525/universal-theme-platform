import { useEditorStore } from "./useEditorStore";
import { RenderBlock } from "./renderers";

export default function CanvasPreview() {
  const { theme } = useEditorStore();
  if (!theme) return <div className="flex-1" />;

  const blocks = [...theme.design_elements]
    .filter((b) => b.is_active)
    .sort((a, b) => a.position - b.position)
    .map((b) => ({
      ...b,
      settings:
        typeof b.settings === "string" ? JSON.parse(b.settings) : b.settings,
    }));

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      {/* extra bottom padding so sticky mobile footer preview has room */}
      <div className="mx-auto max-w-6xl p-4 space-y-4 pb-28">
        {blocks.map((b) => {
          const settingsForPreview = { ...(b.settings || {}), __preview: true };
          return (
            <div key={b.id} className="bg-white rounded-lg shadow-sm">
              <RenderBlock code={b.code} settings={settingsForPreview} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
