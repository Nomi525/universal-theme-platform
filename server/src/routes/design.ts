// server/src/routes/design.ts
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { getSchemaForThemeDesignElement } from "../lib/catalog";
import { validateSettings } from "../lib/validate";

const router = Router();

/* -------------------------------- THEMES -------------------------------- */

router.get("/themes", async (req, res) => {
  const branchId = Number(req.query.branch_id || 1);
  const list = await prisma.theme.findMany({
    where: { branchId },
    orderBy: { id: "asc" },
  });
  res.json(
    list.map((t: { id: any; name: any; isCurrent: any; }) => ({
      id: t.id,
      name: t.name,
      is_current: t.isCurrent ? 1 : 0,
    }))
  );
});

/* ---------------------- CATALOG (available components) ------------------- */

router.get(
  "/admin/design/get-available-design-elements",
  async (_req, res) => {
    const elements = await prisma.designElementCatalog.findMany({
      orderBy: { id: "asc" },
    });
    res.json(
      elements.map((e: { id: any; name: any; code: any; defaultSettings: any; settingsSchema: any; canBeMultiple: any; }) => ({
        id: e.id,
        name: e.name,
        code: e.code,
        settings: JSON.stringify(e.defaultSettings),
        settings_schema: e.settingsSchema ?? null, // expose schema
        can_be_multiple: e.canBeMultiple ? 1 : 0,
        created_at: null,
        updated_at: null,
      }))
    );
  }
);

// alias to match your earlier endpoint
router.get("/get-available-design-elements", async (_req, res) => {
  const elements = await prisma.designElementCatalog.findMany({
    orderBy: { id: "asc" },
  });
  res.json(
    elements.map((e: { id: any; name: any; code: any; defaultSettings: any; settingsSchema: any; canBeMultiple: any; }) => ({
      id: e.id,
      name: e.name,
      code: e.code,
      settings: JSON.stringify(e.defaultSettings),
      settings_schema: e.settingsSchema ?? null,
      can_be_multiple: e.canBeMultiple ? 1 : 0,
      created_at: null,
      updated_at: null,
    }))
  );
});

/* ---------------------------- THEME (current) ---------------------------- */

async function getCurrentTheme(branchId: number) {
  return prisma.theme.findFirst({ where: { branchId, isCurrent: true } });
}

router.get("/get-theme", async (req, res) => {
  const branchId = Number(req.query.branch_id || 1);
  const theme = await getCurrentTheme(branchId);
  if (!theme) return res.status(404).json({ error: "No current theme" });

  const blocks = await prisma.themeDesignElement.findMany({
    where: { themeId: theme.id },
    orderBy: { position: "asc" },
  });

  res.json({
    theme_details: {
      id: theme.id,
      name: theme.name,
      description: null,
      short_description: theme.shortDesc || theme.name,
      author: theme.author || "Unknown",
      version: theme.version || "1.0.0",
      image: theme.image || null,
      branch_id: branchId,
      created_at: theme.createdAt,
      updated_at: theme.updatedAt,
    },
    design_elements: await Promise.all(
      blocks.map(async (b: { designElementId: any; code: any; id: any; name: any; customName: any; position: any; settings: any; isActive: any; isPlugin: any; }) => {
        const catalog = b.designElementId
          ? await prisma.designElementCatalog.findUnique({
              where: { id: b.designElementId },
              select: { settingsSchema: true },
            })
          : await prisma.designElementCatalog.findFirst({
              where: { code: b.code },
              select: { settingsSchema: true },
            });

        return {
          id: b.id,
          name: b.name,
          custom_name: b.customName,
          code: b.code,
          position: b.position,
          settings: JSON.stringify(b.settings),
          is_active: b.isActive ? 1 : 0,
          is_plugin: b.isPlugin ? 1 : 0,
          settings_schema: catalog?.settingsSchema ?? null, // include schema per placed block
        };
      })
    ),
  });
});

router.get("/get-theme-single-design-element/:id", async (req, res) => {
  const id = Number(req.params.id);
  const b = await prisma.themeDesignElement.findUnique({ where: { id } });
  if (!b) return res.status(404).json({ error: "Not found" });

  res.json({
    properties: {
      id: b.id,
      theme_id: b.themeId,
      name: b.name,
      custom_name: b.customName,
      branch_id:
        (await prisma.theme.findUnique({ where: { id: b.themeId } }))
          ?.branchId ?? null,
      code: b.code,
      design_element_id: b.designElementId,
      position: b.position,
      settings: b.settings, // parsed object
      is_active: b.isActive ? 1 : 0,
      is_plugin: b.isPlugin ? 1 : 0,
      design_plugin_id: null,
      created_at: b.createdAt,
      updated_at: b.updatedAt,
      source: "tenant",
    },
  });
});

/* ------------------------------ SWITCH THEME ----------------------------- */

router.post("/switch-theme", async (req, res) => {
  const { branch_id, theme_id } = req.body;
  const branchId = Number(branch_id);
  const themeId = Number(theme_id);

  await prisma.theme.updateMany({ where: { branchId }, data: { isCurrent: false } });
  await prisma.theme.update({ where: { id: themeId }, data: { isCurrent: true } });

  res.json({ ok: true });
});

/* ------------------------------ BLOCKS CRUD ------------------------------ */

/**
 * CREATE block
 * - validates incoming `settings` against the catalog schema (if present)
 */
router.post("/blocks", async (req, res) => {
  const {
    theme_id,
    design_element_id,
    name,
    custom_name,
    code,
    position,
    settings,
    is_active,
  } = req.body;

  // determine schema (by design_element_id or code)
  let schema: any = null;
  if (design_element_id) {
    const cat = await prisma.designElementCatalog.findUnique({
      where: { id: Number(design_element_id) },
      select: { settingsSchema: true },
    });
    schema = cat?.settingsSchema ?? null;
  } else if (code) {
    const cat = await prisma.designElementCatalog.findFirst({
      where: { code: String(code) },
      select: { settingsSchema: true },
    });
    schema = cat?.settingsSchema ?? null;
  }

  let finalSettings = settings || {};
  if (schema) {
    const { valid, errors } = validateSettings(schema, finalSettings);
    if (!valid) return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const block = await prisma.themeDesignElement.create({
    data: {
      themeId: Number(theme_id),
      designElementId: design_element_id ? Number(design_element_id) : null,
      name,
      customName: custom_name ?? null,
      code,
      position: Number(position),
      isActive: !!is_active,
      settings: finalSettings,
    },
  });
  res.json({ id: block.id });
});

/**
 * UPDATE block
 * - if `settings` provided, validate against the block's catalog schema
 */
router.patch("/blocks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, custom_name, position, settings, is_active } = req.body;

  const existing = await prisma.themeDesignElement.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: "Not found" });

  let dataToUpdate: any = {};
  if (name !== undefined) dataToUpdate.name = name;
  if (custom_name !== undefined) dataToUpdate.customName = custom_name;
  if (position !== undefined) dataToUpdate.position = Number(position);
  if (typeof is_active === "number" || typeof is_active === "boolean") {
    dataToUpdate.isActive = !!is_active;
  }

  if (settings !== undefined) {
    const schema = await getSchemaForThemeDesignElement(id);
    if (schema) {
      const { valid, errors } = validateSettings(schema as any, settings);
      if (!valid) return res.status(400).json({ error: "Validation failed", details: errors });
    }
    dataToUpdate.settings = settings;
  }

  const updated = await prisma.themeDesignElement.update({
    where: { id },
    data: dataToUpdate,
  });

  res.json({ ok: true, id: updated.id });
});

router.delete("/blocks/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.themeDesignElement.delete({ where: { id } });
  res.json({ ok: true });
});

/* -------------------------------- PUBLISH -------------------------------- */

router.post("/publish", async (req, res) => {
  const branchId = Number(req.body.branch_id || 1);
  const theme = await getCurrentTheme(branchId);
  if (!theme) return res.status(404).json({ error: "No current theme" });

  const blocks = await prisma.themeDesignElement.findMany({
    where: { themeId: theme.id, isActive: true },
    orderBy: { position: "asc" },
  });

  const layout = blocks.map((b: { id: any; code: any; settings: any; position: any; }) => ({
    type: "designElement",
    id: b.id,
    code: b.code,
    settings: b.settings, // parsed JSON
    data: null,
    position: b.position,
  }));

  const snapshot = await prisma.themeSnapshot.create({
    data: { branchId, themeId: theme.id, layout },
  });

  res.json({ ok: true, snapshot_id: snapshot.id });
});

export { router };
