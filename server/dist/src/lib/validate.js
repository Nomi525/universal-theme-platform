"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenFields = flattenFields;
exports.validateSettings = validateSettings;
const get = (obj, path) => path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
function flattenFields(schema) {
    if (!schema)
        return [];
    if (schema.fields)
        return schema.fields;
    if (schema.groups)
        return schema.groups.flatMap((g) => g.fields || []);
    return [];
}
function isColor(val) {
    return (typeof val === "string" &&
        (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val) ||
            val.startsWith("rgb(") ||
            val.startsWith("hsl(")));
}
function isSpacing(val) {
    return typeof val === "string" && /^(?:\d*\.?\d+)(?:rem|px|%)$/.test(val);
}
function validateSettings(schema, settings) {
    const errors = [];
    if (!schema)
        return { valid: true, errors };
    const fields = flattenFields(schema);
    for (const f of fields) {
        if (f.showIf) {
            const visible = Object.entries(f.showIf).every(([p, v]) => get(settings, p) === v);
            if (!visible)
                continue;
        }
        const v = get(settings, f.path);
        if (f.required && (v === undefined || v === null || v === "")) {
            errors.push({ path: f.path, message: "Required" });
            continue;
        }
        if (v === undefined || v === null)
            continue;
        switch (f.type) {
            case "text":
            case "textarea":
            case "image":
            case "code":
                if (typeof v !== "string")
                    errors.push({ path: f.path, message: "Must be a string" });
                break;
            case "number":
            case "range":
                if (typeof v !== "number")
                    errors.push({ path: f.path, message: "Must be a number" });
                if (typeof v === "number") {
                    if (f.min != null && v < f.min)
                        errors.push({ path: f.path, message: `Min ${f.min}` });
                    if (f.max != null && v > f.max)
                        errors.push({ path: f.path, message: `Max ${f.max}` });
                }
                break;
            case "boolean":
                if (typeof v !== "boolean")
                    errors.push({ path: f.path, message: "Must be a boolean" });
                break;
            case "color":
                if (!isColor(v))
                    errors.push({
                        path: f.path,
                        message: "Must be a color (hex/rgb/hsl)",
                    });
                break;
            case "spacing":
                if (!isSpacing(v))
                    errors.push({ path: f.path, message: "Must be like 0rem/8px/50%" });
                break;
            case "select":
                if (typeof v !== "string")
                    errors.push({ path: f.path, message: "Must be a string" });
                if (f.options && !f.options.includes(v)) {
                    errors.push({
                        path: f.path,
                        message: `Must be one of: ${f.options.join(", ")}`,
                    });
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
            case "linkList":
                if (!Array.isArray(v) ||
                    !v.every((x) => x && typeof x.label === "string" && typeof x.href === "string")) {
                    errors.push({
                        path: f.path,
                        message: "Must be array of {label, href}",
                    });
                }
                break;
            default:
                // ignore unknowns
                break;
        }
    }
    return { valid: errors.length === 0, errors };
}
