import { Router } from "express";
import { prisma } from "../lib/prisma";
const router = Router();

router.get("/themes", async (req, res) => {
  const branchId = Number(req.query.branch_id || 1);
  const list = await prisma.theme.findMany({
    where: { branchId },
    orderBy: { id: "asc" },
  });
  res.json(
    list.map((t) => ({
      id: t.id,
      name: t.name,
      is_current: t.isCurrent ? 1 : 0,
    }))
  );
});

router.get("/admin/design/get-available-design-elements", async (req, res) => {
  const elements = await prisma.designElementCatalog.findMany();
  const payload = elements.map((e) => ({
    id: e.id,
    name: e.name,
    code: e.code,
    settings: JSON.stringify(e.defaultSettings),
    settings_schema: e.settingsSchema ?? null, // <-- expose to FE
    can_be_multiple: e.canBeMultiple ? 1 : 0,
    created_at: null,
    updated_at: null,
  }));
  res.json(payload);
});

// GET /api/admin/design/get-available-design-elements?branch_id=1
router.get("/get-available-design-elements", async (req, res) => {
  const elements = await prisma.designElementCatalog.findMany({
    orderBy: { id: "asc" },
  });
  const payload = elements.map(
    (e: {
      id: any;
      name: any;
      code: any;
      defaultSettings: any;
      canBeMultiple: any;
      settingsSchema: any;
    }) => ({
      id: e.id,
      name: e.name,
      code: e.code,
      settings: JSON.stringify(e.defaultSettings), // stringified like your payload
      settings_schema: e.settingsSchema ?? null, // <-- add this
      can_be_multiple: e.canBeMultiple ? 1 : 0,
      created_at: null,
      updated_at: null,
    })
  );
  res.json(payload);
});

// helper: current theme for branch
async function getCurrentTheme(branchId: number) {
  const theme = await prisma.theme.findFirst({
    where: { branchId, isCurrent: true },
  });
  return theme;
}

// GET /api/admin/design/get-theme?branch_id=1
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
    design_elements: blocks.map(
      (b: {
        id: any;
        name: any;
        customName: any;
        code: any;
        position: any;
        settings: any;
        isActive: any;
        isPlugin: any;
      }) => ({
        id: b.id,
        name: b.name,
        custom_name: b.customName,
        code: b.code,
        position: b.position,
        settings: JSON.stringify(b.settings), // stringified like your example
        is_active: b.isActive ? 1 : 0,
        is_plugin: b.isPlugin ? 1 : 0,
      })
    ),
  });
});

// GET /api/admin/design/get-theme-single-design-element/:id?branch_id=1
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
      settings: b.settings, // parsed object here (matches your example)
      is_active: b.isActive ? 1 : 0,
      is_plugin: b.isPlugin ? 1 : 0,
      design_plugin_id: null,
      created_at: b.createdAt,
      updated_at: b.updatedAt,
      source: "tenant",
    },
  });
});

// POST /api/admin/design/switch-theme { branch_id, theme_id }
router.post("/switch-theme", async (req, res) => {
  const { branch_id, theme_id } = req.body;
  const branchId = Number(branch_id),
    themeId = Number(theme_id);

  await prisma.theme.updateMany({
    where: { branchId },
    data: { isCurrent: false },
  });
  await prisma.theme.update({
    where: { id: themeId },
    data: { isCurrent: true },
  });

  res.json({ ok: true });
});

// CRUD blocks (minimal)
router.post("/blocks", async (req, res) => {
  const {
    theme_id,
    design_element_id,
    name,
    custom_name,
    code,
    position,
    settings,
  } = req.body;
  const block = await prisma.themeDesignElement.create({
    data: {
      themeId: Number(theme_id),
      designElementId: design_element_id ? Number(design_element_id) : null,
      name,
      customName: custom_name ?? null,
      code,
      position: Number(position),
      settings: settings || {},
    },
  });
  res.json({ id: block.id });
});

router.patch("/blocks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, custom_name, position, settings, is_active } = req.body;
  const updated = await prisma.themeDesignElement.update({
    where: { id },
    data: {
      name,
      customName: custom_name,
      position,
      settings,
      isActive: is_active,
    },
  });
  res.json({ ok: true, id: updated.id });
});

router.delete("/blocks/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.themeDesignElement.delete({ where: { id } });
  res.json({ ok: true });
});

// POST /api/admin/design/publish { branch_id }
router.post("/publish", async (req, res) => {
  const branchId = Number(req.body.branch_id || 1);
  const theme = await getCurrentTheme(branchId);
  if (!theme) return res.status(404).json({ error: "No current theme" });

  const blocks = await prisma.themeDesignElement.findMany({
    where: { themeId: theme.id, isActive: true },
    orderBy: { position: "asc" },
  });

  // map to storefront layout shape
  const layout = blocks.map(
    (b: { id: any; code: any; settings: any; position: any }) => ({
      type: "designElement",
      id: b.id,
      code: b.code,
      settings: b.settings, // parsed JSON
      data: null,
      position: b.position,
    })
  );

  const snapshot = await prisma.themeSnapshot.create({
    data: { branchId, themeId: theme.id, layout },
  });

  res.json({ ok: true, snapshot_id: snapshot.id });
});

export { router };
