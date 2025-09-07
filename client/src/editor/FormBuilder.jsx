import React, { useMemo } from "react";

/**
 * Supported schema:
 * { fields: FieldDef[] } OR { groups: { label?, fields: FieldDef[] }[] }
 * FieldDef.type: "text" | "textarea" | "number" | "range" | "boolean" | "color"
 *                | "select" | "image" | "imageList" | "idList" | "linkList"
 *                | "spacing" | "code"
 */

function LinkListField({ value = [], onChange }) {
  const add = () => onChange([...(value || []), { label: "", href: "" }]);
  const update = (idx, key, val) => {
    const next = [...(value || [])];
    next[idx] = { ...(next[idx] || {}), [key]: val };
    onChange(next);
  };
  const remove = (idx) => {
    const next = [...(value || [])];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {(value || []).map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="w-40 rounded-md border border-slate-200 px-2 py-1 text-sm"
            placeholder="Label"
            value={it?.label ?? ""}
            onChange={(e) => update(i, "label", e.target.value)}
          />
          <input
            className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm"
            placeholder="https://example.com"
            value={it?.href ?? ""}
            onChange={(e) => update(i, "href", e.target.value)}
          />
          <button
            type="button"
            className="text-rose-600 text-sm"
            onClick={() => remove(i)}
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="mt-1 rounded border px-2 py-1 text-sm"
        onClick={add}
      >
        Add a Link
      </button>
    </div>
  );
}

const get = (obj, path) =>
  path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

const clone = (x) =>
  typeof structuredClone === "function"
    ? structuredClone(x)
    : JSON.parse(JSON.stringify(x));

const set = (obj, path, value) => {
  const out = clone(obj ?? {});
  const parts = path.split(".");
  let cur = out;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] ?? {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
  return out;
};

const looksLikeColor = (s) =>
  typeof s === "string" &&
  (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s) ||
    s.startsWith("rgb(") ||
    s.startsWith("hsl("));

// eslint-disable-next-line react-refresh/only-export-components
export function inferSchemaFromValue(value, prefix = "") {
  const fields = [];
  const visit = (obj, pathPrefix) => {
    if (obj == null || typeof obj !== "object") return;
    Object.entries(obj).forEach(([k, v]) => {
      const path = pathPrefix ? `${pathPrefix}.${k}` : k;
      if (v == null) fields.push({ path, type: "text", label: k });
      else if (typeof v === "boolean")
        fields.push({ path, type: "boolean", label: k });
      else if (typeof v === "number")
        fields.push({ path, type: "number", label: k });
      else if (typeof v === "string") {
        if (looksLikeColor(v)) fields.push({ path, type: "color", label: k });
        else if (v.length > 60)
          fields.push({ path, type: "textarea", label: k });
        else fields.push({ path, type: "text", label: k });
      } else if (Array.isArray(v)) {
        if (v.every((x) => typeof x === "string")) {
          const allUrls = v.every((x) => /^https?:\/\//.test(x) || x === "");
          fields.push({
            path,
            type: allUrls ? "imageList" : "idList",
            label: k,
          });
        } else if (v.every((x) => typeof x === "number")) {
          fields.push({ path, type: "idList", label: k });
        }
      } else if (typeof v === "object") {
        visit(v, path);
      }
    });
  };
  visit(value, prefix);
  return { fields };
}

const SPACING_OPTIONS = [
  "0rem",
  "0.25rem",
  "0.5rem",
  "0.75rem",
  "1rem",
  "1.25rem",
  "1.5rem",
  "2rem",
  "3rem",
];

function Field({ def, value, onChange }) {
  const label = def.label || def.path;

  switch (def.type) {
    case "text":
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <textarea
            rows={4}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "code":
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <textarea
            rows={8}
            spellCheck={false}
            className="w-full font-mono rounded-md border border-slate-200 px-3 py-2 text-xs leading-5"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "number":
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <input
            type="number"
            min={def.min}
            max={def.max}
            step={def.step}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={value ?? ""}
            onChange={(e) =>
              onChange(e.target.value === "" ? null : Number(e.target.value))
            }
          />
        </div>
      );

    case "range":
      return (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-600">
              {label}
            </label>
            <span className="text-xs text-slate-500">{value ?? ""}</span>
          </div>
          <input
            type="range"
            min={def.min ?? 0}
            max={def.max ?? 100}
            step={def.step ?? 1}
            className="w-full"
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      );

    case "boolean":
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-sm text-slate-700">{label}</span>
        </label>
      );

    case "color":
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="h-8 w-10 rounded-md border border-slate-200"
              value={value ?? "#ffffff"}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm"
              value={value ?? "#ffffff"}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      );

    case "select":
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <select
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>
              Select…
            </option>
            {(def.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "spacing":
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <select
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={value ?? "0rem"}
            onChange={(e) => onChange(e.target.value)}
          >
            {SPACING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "image":
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="https://…"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "imageList":
    case "idList": {
      const arr = Array.isArray(value) ? value : [];
      const isId = def.type === "idList";
      return (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-600">
              {label}
            </label>
            <button
              type="button"
              className="rounded-md bg-slate-100 px-2 py-1 text-xs"
              onClick={() => onChange([...arr, isId ? 0 : ""])}
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {arr.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  type={isId ? "number" : "text"}
                  value={v}
                  onChange={(e) => {
                    const next = [...arr];
                    next[i] = isId ? Number(e.target.value) : e.target.value;
                    onChange(next);
                  }}
                />
                <button
                  type="button"
                  className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600"
                  onClick={() => onChange(arr.filter((_, idx) => idx !== i))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "linkList":
      return (
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <LinkListField
            value={Array.isArray(value) ? value : []}
            onChange={onChange}
          />
        </div>
      );

    default:
      return (
        <div className="text-xs text-amber-700">
          Unsupported field type: <b>{def.type}</b> ({def.path})
        </div>
      );
  }
}

export default function FormBuilder({ schema, value, onChange }) {
  const effectiveSchema = useMemo(
    () => (schema ? schema : inferSchemaFromValue(value || {})),
    [schema, value]
  );

  const allFields = useMemo(() => {
    const flat = effectiveSchema?.fields
      ? effectiveSchema.fields
      : effectiveSchema?.groups?.flatMap((g) => g.fields || []) || [];
    return flat.filter((f) => {
      if (!f.showIf) return true;
      return Object.entries(f.showIf).every(([p, v]) => get(value, p) === v);
    });
  }, [effectiveSchema, value]);

  const groups = effectiveSchema?.groups?.length
    ? effectiveSchema.groups
    : [{ label: undefined, fields: allFields }];

  const handlePath = (path, v) => onChange(set(value || {}, path, v));

  return (
    <div className="space-y-6">
      {groups.map((g, gi) => (
        <div key={gi} className="space-y-3">
          {g.label && (
            <h4 className="text-xs font-semibold uppercase text-slate-500">
              {g.label}
            </h4>
          )}
          {(g.fields || []).map((def) => {
            const visible = allFields.find((f) => f.path === def.path);
            if (!visible) return null;
            const current = get(value, def.path);
            return (
              <Field
                key={def.path}
                def={def}
                value={current}
                onChange={(v) => handlePath(def.path, v)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
