import { Router } from "express";
import { prisma } from "../lib/prisma";
const router = Router();

// GET /api/get-data?branch_id=1
router.get("/get-data", async (req, res) => {
  const branchId = Number(req.query.branch_id || 1);

  // latest snapshot for the branch
  const latest = await prisma.themeSnapshot.findFirst({
    where: { branchId },
    orderBy: { createdAt: "desc" },
  });

  // fallback: if not published yet, build from current theme draft
  let layout = latest?.layout as any[] | undefined;
  if (!layout) {
    const theme = await prisma.theme.findFirst({
      where: { branchId, isCurrent: true },
    });
    if (!theme) return res.status(404).json({ error: "No theme" });
    const blocks = await prisma.themeDesignElement.findMany({
      where: { themeId: theme.id, isActive: true },
      orderBy: { position: "asc" },
    });
    layout = blocks.map(
      (b: { id: any; code: any; settings: any; position: any }) => ({
        type: "designElement",
        id: b.id,
        code: b.code,
        settings: b.settings,
        data: null,
        position: b.position,
      })
    );
  }

  const settingsRows = await prisma.storeSetting.findMany({
    where: { branchId },
  });
  const settings: Record<string, string> = {};
  for (const row of settingsRows) settings[row.key] = row.value;

  const branch = await prisma.branch.findUnique({ where: { id: branchId } });

  res.json({
    layout,
    settings,
    branches: branch
      ? [
          {
            id: branch.id,
            name: branch.name,
            company_name: "Techcronet",
            city: "Ahmedabad",
            state: "Gujarat",
            country: "India",
            is_active: 1,
            is_main_branch: branch.isMain ? 1 : 0,
          },
        ]
      : [],
  });
});

export { router };
