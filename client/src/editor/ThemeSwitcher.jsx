import { useEffect, useState } from "react";
import { useEditorStore } from "./useEditorStore";
import { api } from "../api/http";

export default function ThemeSwitcher() {
  const { theme, switchTheme } = useEditorStore();
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    // tiny helper route to list themes (create quickly below)
    api.get("/admin/design/themes?branch_id=1").then((r) => setThemes(r.data));
  }, []);

  if (!theme) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">Theme:</span>
      <select
        className="border rounded px-2 py-1"
        value={theme.theme_details.id}
        onChange={(e) => switchTheme(Number(e.target.value))}
      >
        {themes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
