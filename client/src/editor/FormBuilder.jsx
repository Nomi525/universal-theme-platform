function Field({ type, label, value, onChange, options }) {
  if (type === "text")
    return (
      <input
        className="border rounded px-2 py-1 w-full"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  if (type === "color")
    return (
      <input
        type="color"
        className="w-10 h-10"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  if (type === "boolean")
    return (
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  if (type === "number")
    return (
      <input
        type="number"
        className="border rounded px-2 py-1 w-full"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  if (type === "select")
    return (
      <select
        className="border rounded px-2 py-1 w-full"
        value={value || options?.[0]}
        onChange={(e) => onChange(e.target.value)}
      >
        {options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  return <div className="text-xs text-slate-500">Unsupported: {type}</div>;
}

export default function FormBuilder({ schema, value, onChange }) {
  const fields = schema?.fields || [];
  const onPathChange = (path, newVal) => {
    const next = structuredClone(value || {});
    // shallow dotted path (e.g. "style.color" supported too)
    const parts = path.split(".");
    let cur = next;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = cur[parts[i]] ?? {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = newVal;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {fields.map((f, i) => {
        // read current
        const parts = f.path.split(".");
        let cur = value || {};
        for (const p of parts) cur = cur?.[p];
        return (
          <div key={i}>
            <div className="text-xs font-medium mb-1">{f.label}</div>
            <Field
              type={f.type}
              label={f.label}
              value={cur}
              options={f.options}
              onChange={(v) => onPathChange(f.path, v)}
            />
          </div>
        );
      })}
    </div>
  );
}
