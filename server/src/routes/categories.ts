import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

const Q = z.object({
  includeCounts: z
    .union([z.literal("1"), z.literal("true"), z.literal("yes")])
    .optional(),
  order: z.enum(["ALPHABETICAL", "DEFAULT"]).optional(),
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
    const countMap = new Map(
      counts.map((c) => [c.categoryId, c._count.productId])
    );

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

export default router;
