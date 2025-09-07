import { useEffect, useMemo, useState } from "react";
import { useEditorStore } from "./useEditorStore";
import FormBuilder from "./FormBuilder";
import { getThemeSingle, updateBlock } from "../api/design";

function deepEqual(a, b) {
  try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
}

export default function PropertiesPanel({ branchId = 1 }) {
  const { theme, selectedBlockId, available, applyLocalSettings } = useEditorStore();

  const block = useMemo(
    () => theme?.design_elements.find((b) => b.id === selectedBlockId),
    [theme, selectedBlockId]
  );

  const catalogItem = useMemo(
    () => (block ? available.find((a) => a.code === block.code) : null),
    [available, block]
  );

  const savedSettings = useMemo(() => {
    if (!block) return null;
    return typeof block.settings === "string" ? JSON.parse(block.settings) : block.settings;
  }, [block?.id]);

  const [customName, setCustomName] = useState("");
  const [position, setPosition] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [draft, setDraft] = useState(savedSettings || {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const defaultSettings = useMemo(() => {
    try { return catalogItem?.settings ? JSON.parse(catalogItem.settings) : {}; }
    catch { return {}; }
  }, [catalogItem]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!block) return;
      try {
        const { properties } = await getThemeSingle(block.id, branchId);
        if (!mounted) return;
        setCustomName(properties.custom_name || properties.name || "");
        setPosition(properties.position || 0);
        setIsActive(!!properties.is_active);
        setDraft(properties.settings || savedSettings || {});
      } catch {
        setCustomName(block.custom_name || block.name || "");
        setPosition(block.position || 0);
        setIsActive(!!block.is_active);
        setDraft(savedSettings || {});
      }
      setError("");
    })();
    return () => { mounted = false; };
  }, [block?.id, branchId]); // eslint-disable-line

  if (!block)
    return (
      <div className="w-96 border-l p-4 text-slate-500">
        Select a section to edit its properties.
      </div>
    );

  const schema = catalogItem?.settings_schema || null;
  const dirty =
    !deepEqual(draft, savedSettings) ||
    customName !== (block.custom_name || block.name || "") ||
    Number(position) !== Number(block.position || 0) ||
    !!isActive !== !!block.is_active;

  const onSave = async () => {
    try {
      setSaving(true);
      setError("");
      await updateBlock(block.id, {
        name: block.name,
        custom_name: customName || null,
        position: Number(position) || 0,
        is_active: isActive ? 1 : 0,
        settings: draft,
      });
      applyLocalSettings(block.id, draft);
    } catch (e) {
      const data = e?.response?.data;
      if (data?.details?.length) {
        setError(
          "Validation failed:\n" +
            data.details.map((d) => `• ${d.path}: ${d.message}`).join("\n")
        );
      } else {
        setError(String(data?.error || e.message || e));
      }
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    setCustomName(block.custom_name || block.name || "");
    setPosition(block.position || 0);
    setIsActive(!!block.is_active);
    setDraft(savedSettings || {});
    setError("");
  };

  const onResetDefaults = () => {
    setDraft(defaultSettings || {});
  };

  return (
    <div className="w-96 border-l flex flex-col">
      <div className="border-b border-slate-200 p-4">
        <div className="text-sm font-semibold">{block.custom_name || block.name}</div>
        <div className="mt-1 text-xs text-slate-500">{block.code}</div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {!!error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 whitespace-pre-line">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-600">Custom name</label>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Optional label shown in editor"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">Position</label>
            <input
              type="number"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
            />
          </div>

          <label className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={!!isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="text-sm text-slate-700">Active</span>
          </label>
        </div>

        <div>
          {schema ? (
            <FormBuilder schema={schema} value={draft} onChange={setDraft} />
          ) : (
            <div className="text-xs text-amber-700">No schema available for this block.</div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 p-4 flex items-center gap-2">
        <button
          onClick={onReset}
          disabled={!dirty}
          className={`rounded-md border px-3 py-2 text-sm ${
            !dirty ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"
          }`}
        >
          Reset
        </button>

        <button
          onClick={onResetDefaults}
          className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800"
          title="Reset fields to the component's default settings"
        >
          Reset to defaults
        </button>

        <div className="grow" />

        <button
          onClick={onSave}
          disabled={!dirty || saving}
          className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
            !dirty || saving ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
