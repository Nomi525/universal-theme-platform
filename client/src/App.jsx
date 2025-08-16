import { useState } from "react";
import EditorApp from "./editor/EditorApp";
import Storefront from "./storefront/Storefront";

export default function App() {
  const [mode, setMode] = useState("editor"); // 'editor' | 'storefront'
  return (
    <div className="h-screen">
      <div className="fixed top-2 left-2 z-50 bg-white rounded shadow px-2 py-1 flex gap-2 text-sm">
        <button
          className={mode === "editor" ? "font-semibold" : ""}
          onClick={() => setMode("editor")}
        >
          Editor
        </button>
        <button
          className={mode === "storefront" ? "font-semibold" : ""}
          onClick={() => setMode("storefront")}
        >
          Storefront
        </button>
      </div>
      {mode === "editor" ? <EditorApp /> : <Storefront />}
    </div>
  );
}
