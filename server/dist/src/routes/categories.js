"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const Q = zod_1.z.object({
    includeCounts: zod_1.z
        .union([zod_1.z.literal("1"), zod_1.z.literal("true"), zod_1.z.literal("yes")])
        .optional(),
    order: zod_1.z.enum(["ALPHABETICAL", "DEFAULT"]).optional(),
});
router.get("/", async (req, res) => {
    const { includeCounts, order } = Q.parse(req.query);
    let categories = await prisma.category.findMany({
        orderBy: order === "ALPHABETICAL" ? { name: "asc" } : { id: "asc" },
        select: { id: true, slug: true, name: true },
    });
    if (includeCounts) {
        const counts = await prisma.productCategory.groupBy({
            by: ["categoryId"],
            _count: { productId: true },
        });
        const countMap = new Map(counts.map((c) => [c.categoryId, c._count.productId]));
        return res.json({
            items: categories.map((c) => ({
                id: c.slug, // expose slug as id externally for FE convenience
                slug: c.slug,
                name: c.name,
                count: countMap.get(c.id) ?? 0,
            })),
        });
    }
    res.json({
        items: categories.map((c) => ({
            id: c.slug,
            slug: c.slug,
            name: c.name,
        })),
    });
});
exports.default = router;
