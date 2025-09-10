"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
exports.router = router;
// GET /api/get-data?branch_id=1
router.get("/get-data", async (req, res) => {
    const branchId = Number(req.query.branch_id || 1);
    // latest snapshot for the branch
    const latest = await prisma_1.prisma.themeSnapshot.findFirst({
        where: { branchId },
        orderBy: { createdAt: "desc" },
    });
    // fallback: if not published yet, build from current theme draft
    let layout = latest?.layout;
    if (!layout) {
        const theme = await prisma_1.prisma.theme.findFirst({
            where: { branchId, isCurrent: true },
        });
        if (!theme)
            return res.status(404).json({ error: "No theme" });
        const blocks = await prisma_1.prisma.themeDesignElement.findMany({
            where: { themeId: theme.id, isActive: true },
            orderBy: { position: "asc" },
        });
        layout = blocks.map((b) => ({
            type: "designElement",
            id: b.id,
            code: b.code,
            settings: b.settings,
            data: null,
            position: b.position,
        }));
    }
    const settingsRows = await prisma_1.prisma.storeSetting.findMany({
        where: { branchId },
    });
    const settings = {};
    for (const row of settingsRows)
        settings[row.key] = row.value;
    const branch = await prisma_1.prisma.branch.findUnique({ where: { id: branchId } });
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
