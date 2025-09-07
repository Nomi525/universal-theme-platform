import { useEffect } from "react";
import { useEditorStore } from "./useEditorStore";
import ThemeSwitcher from "./ThemeSwitcher";
import BlocksList from "./BlocksList";
import CanvasPreview from "./CanvasPreview";
import PropertiesPanel from "./PropertiesPanel";
import CatalogModal from "./CatalogModal";
import PublishBar from "./PublishBar";

export default function EditorApp() {
  const { load, loading, error } = useEditorStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="h-screen flex flex-col">
      <div className="px-4 py-2 border-b flex items-center justify-between bg-white">
        <div className="font-semibold">Theme Editor</div>
        <ThemeSwitcher />
      </div>
      <PublishBar />

      {loading ? (
        <div className="p-4">Loading…</div>
      ) : error ? (
        <div className="p-4 text-rose-600">{error}</div>
      ) : (
        <div className="flex flex-1">
          <BlocksList />
          <CanvasPreview />
          <PropertiesPanel />
        </div>
      )}

      <CatalogModal />
    </div>
  );
}
