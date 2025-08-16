// src/lib/validate.ts
type Field =
  | {
      path: string;
      type:
        | "text"
        | "textarea"
        | "number"
        | "range"
        | "boolean"
        | "color"
        | "select"
        | "image"
        | "imageList"
        | "idList";
      label?: string;
      required?: boolean;
      options?: string[];
      min?: number;
      max?: number;
      step?: number;
      showIf?: Record<string, any>;
    };

type Schema =
  | { fields: Field[] }
  | { groups: { label?: string; fields: Field[] }[] };

const get = (obj: any, path: string) =>
  path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

export function flattenFields(schema: any): Field[] {
  if (!schema) return [];
  if (schema.fields) return schema.fields as Field[];
  if (schema.groups) return (schema.groups as any[]).flatMap((g) => g.fields || []);
  return [];
}

function isColor(val: any) {
  return (
    typeof val === "string" &&
    (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val) ||
      val.startsWith("rgb(") ||
      val.startsWith("hsl("))
  );
}

export function validateSettings(schema: Schema | null | undefined, settings: any) {
  const errors: { path: string; message: string }[] = [];
  if (!schema) return { valid: true, errors };

  const fields = flattenFields(schema);

  for (const f of fields) {
    // evaluate showIf
    if (f.showIf) {
      const visible = Object.entries(f.showIf).every(([p, v]) => get(settings, p) === v);
      if (!visible) continue;
    }

    const v = get(settings, f.path);

    if (f.required && (v === undefined || v === null || v === "")) {
      errors.push({ path: f.path, message: "Required" });
      continue;
    }

    if (v === undefined || v === null) continue;

    switch (f.type) {
      case "text":
      case "textarea":
      case "image":
        if (typeof v !== "string") errors.push({ path: f.path, message: "Must be a string" });
        break;
      case "number":
      case "range":
        if (typeof v !== "number") errors.push({ path: f.path, message: "Must be a number" });
        if (typeof v === "number") {
          if (f.min != null && v < f.min) errors.push({ path: f.path, message: `Min ${f.min}` });
          if (f.max != null && v > f.max) errors.push({ path: f.path, message: `Max ${f.max}` });
        }
        break;
      case "boolean":
        if (typeof v !== "boolean") errors.push({ path: f.path, message: "Must be a boolean" });
        break;
      case "color":
        if (!isColor(v)) errors.push({ path: f.path, message: "Must be a color (hex/rgb/hsl)" });
        break;
      case "select":
        if (typeof v !== "string") errors.push({ path: f.path, message: "Must be a string" });
        if (f.options && !f.options.includes(v)) {
          errors.push({ path: f.path, message: `Must be one of: ${f.options.join(", ")}` });
        }
        break;
      case "imageList":
        if (!Array.isArray(v) || !v.every((x) => typeof x === "string"))
          errors.push({ path: f.path, message: "Must be an array of strings" });
        break;
      case "idList":
        if (!Array.isArray(v) || !v.every((x) => typeof x === "number"))
          errors.push({ path: f.path, message: "Must be an array of numbers" });
        break;
      default:
        // ignore unknowns
        break;
    }
  }

  return { valid: errors.length === 0, errors };
}
