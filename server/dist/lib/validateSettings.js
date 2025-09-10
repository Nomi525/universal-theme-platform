"use strict";
// server/src/lib/validateSettings.ts
// Minimal validator for our UI schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndSanitize = validateAndSanitize;
function flatten(schema) {
    // @ts-ignore
    if (schema.fields)
        return schema.fields;
    // @ts-ignore
    return (schema.groups || []).flatMap((g) => g.fields || []);
}
function getAt(obj, path) {
    return path.split(".").reduce((a, k) => (a == null ? a : a[k]), obj);
}
function setAt(obj, path, value) {
    const out = structuredClone(obj ?? {});
    const parts = path.split(".");
    let cur = out;
    for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i];
        cur[k] = cur[k] ?? {};
        cur = cur[k];
    }
    cur[parts[parts.length - 1]] = value;
    return out;
}
function validateAndSanitize(schema, incoming, prev) {
    const fields = flatten(schema);
    const errors = [];
    let result = {};
    const isVisible = (f, snapshot) => {
        if (!f.showIf)
            return true;
        return Object.entries(f.showIf).every(([k, v]) => getAt(snapshot, k) === v);
    };
    // we need a “snapshot” to evaluate showIf against the latest values
    const snapshot = new Proxy({}, {
        get: (_t, key) => {
            const inc = getAt(incoming, key);
            if (inc !== undefined)
                return inc;
            return getAt(prev ?? {}, key);
        },
    });
    for (const f of fields) {
        if (!isVisible(f, snapshot)) {
            // keep old value if it existed
            const oldVal = getAt(prev ?? {}, f.path);
            if (oldVal !== undefined)
                result = setAt(result, f.path, oldVal);
            continue;
        }
        const v = getAt(incoming, f.path);
        if (f.required && (v === undefined || v === null || v === "")) {
            errors.push(`${f.label || f.path} is required`);
            continue;
        }
        if (v === undefined) {
            const oldVal = getAt(prev ?? {}, f.path);
            if (oldVal !== undefined)
                result = setAt(result, f.path, oldVal);
            continue;
        }
        switch (f.type) {
            case "boolean":
                if (typeof v !== "boolean")
                    errors.push(`${f.label || f.path} must be boolean`);
                break;
            case "number":
            case "range":
                if (typeof v !== "number")
                    errors.push(`${f.label || f.path} must be number`);
                if (f.min != null && v < f.min)
                    errors.push(`${f.label || f.path} ≥ ${f.min}`);
                if (f.max != null && v > f.max)
                    errors.push(`${f.label || f.path} ≤ ${f.max}`);
                break;
            case "select":
                if (v != null && !f.options?.includes(v))
                    errors.push(`${f.label || f.path} invalid option`);
                break;
            case "imageList":
            case "idList":
                if (!Array.isArray(v))
                    errors.push(`${f.label || f.path} must be an array`);
                break;
            // text / color / image / textarea: accept as-is
        }
        result = setAt(result, f.path, v);
    }
    return { ok: errors.length === 0, errors, value: result };
}
