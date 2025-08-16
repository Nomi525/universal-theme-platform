import { useMemo, useState } from "react";
import { useEditorStore } from "./useEditorStore";
import FormBuilder from "./FormBuilder";

export default function PropertiesPanel() {
  const { theme, selectedBlockId, available, updateSelectedSettings } =
    useEditorStore();
  const block = useMemo(
    () => theme?.design_elements.find((b) => b.id === selectedBlockId),
    [theme, selectedBlockId]
  );
  const catalogItem = useMemo(
    () => available.find((a) => a.code === block?.code),
    [available, block?.code]
  );

  const [text, setText] = useState(() =>
    block ? JSON.stringify(block.settings, null, 2) : ""
  );
  useMemo(() => {
    setText(block ? JSON.stringify(block.settings, null, 2) : "");
  }, [block?.id]);

  if (!block)
    return (
      <div className="w-96 border-l p-4 text-slate-500">
        Select a block to edit settings
      </div>
    );

  const parsed =
    typeof block.settings === "string"
      ? JSON.parse(block.settings)
      : block.settings;

  return (
    <div className="w-96 border-l p-3 flex flex-col gap-3">
      <div className="font-semibold">{block.custom_name || block.name}</div>

      {catalogItem?.settings_schema ? (
        <>
          <FormBuilder
            schema={catalogItem.settings_schema}
            value={parsed}
            onChange={(next) => updateSelectedSettings(next)}
          />
          <details className="mt-3">
            <summary className="cursor-pointer text-sm text-slate-600">
              Advanced JSON
            </summary>
            <textarea
              className="w-full h-48 font-mono text-xs border rounded p-2 mt-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={() => {
                try {
                  updateSelectedSettings(JSON.parse(text));
                } catch {
                  alert("Invalid JSON");
                }
              }}
              className="mt-2 bg-slate-200 rounded px-2 py-1 text-sm"
            >
              Save JSON
            </button>
          </details>
        </>
      ) : (
        <>
          <div className="text-xs text-slate-500">
            No form schema for this block (using JSON editor).
          </div>
          <textarea
            className="flex-1 font-mono text-xs border rounded p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={() => {
              try {
                updateSelectedSettings(JSON.parse(text));
              } catch {
                alert("Invalid JSON");
              }
            }}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-2 text-sm"
          >
            Save Settings
          </button>
        </>
      )}
    </div>
  );
}
