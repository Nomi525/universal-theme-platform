import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

const Q = z.object({
  order: z.enum(["ALPHABETICAL", "NEWEST", "POPULAR"]).default("ALPHABETICAL"),
  take: z.coerce.number().min(1).max(50).default(12),
  cursor: z.coerce.number().optional(),
  category: z.string().optional(),
});

/* helpers */
const toPaise = (v?: number | null) =>
  v == null ? 0 : v >= 10000 ? Math.round(v) : Math.round(v * 100);
const demoMrpAndPct = (pricePaise: number, popularity: number) => {
  const uplift = 0.2 + (popularity % 3) * 0.1; // 20/30/40%
  const mrp = Math.max(pricePaise, Math.round(pricePaise * (1 + uplift)));
  const discountPercent = Math.max(
    0,
    Math.min(100, Math.round(((mrp - pricePaise) / mrp) * 100))
  );
  return { mrp, discountPercent };
};

/* LIST */
router.get("/", async (req, res) => {
  const { order, take, cursor, category } = Q.parse(req.query);

  const orderBy =
    order === "ALPHABETICAL"
      ? [{ name: "asc" as const }]
      : order === "NEWEST"
      ? [{ createdAt: "desc" as const }]
      : [{ popularity: "desc" as const }];

  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category
        ? { categories: { some: { category: { slug: category } } } }
        : {}),
    },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: [...orderBy, { id: "asc" }],
    take: take + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  let nextCursor: number | null = null;
  if (rows.length > take) {
    const next = rows.pop()!;
    nextCursor = next.id;
  }

  const items = rows.map((p) => {
    const price = toPaise(p.price);
    const rawMrp = (p as any).mrp as number | undefined;
    const rawPct = (p as any).discountPercent as number | undefined;

    let mrp = toPaise(rawMrp ?? 0);
    let discountPercent =
      typeof rawPct === "number" && isFinite(rawPct) ? Math.round(rawPct) : 0;

    if (!mrp || mrp <= price) {
      const demo = demoMrpAndPct(price, p.popularity ?? 0);
      mrp = demo.mrp;
      discountPercent = demo.discountPercent;
    } else if (!discountPercent) {
      discountPercent = Math.max(
        0,
        Math.min(100, Math.round(((mrp - price) / mrp) * 100))
      );
    }

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price,
      mrp,
      discountPercent,
      currency: p.currency ?? "INR",
      popularity: p.popularity,
      createdAt: p.createdAt,
      image: p.images[0]?.url ?? null,
      images: p.images.map((i) => i.url),
    };
  });

  res.json({ items, nextCursor });
});

/* PDP */
router.get("/:idOrSlug", async (req, res) => {
  const idOrSlug = String(req.params.idOrSlug);
  const where = /^\d+$/.test(idOrSlug)
    ? { id: Number(idOrSlug) }
    : { slug: idOrSlug };

  const p = await prisma.product.findFirst({
    where: { ...where, isActive: true },
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (!p) return res.status(404).json({ error: "Not found" });

  const rawMrp: number | null =
    (p as any).mrp ?? (p as any).compareAtPrice ?? null;
  const mrp =
    rawMrp && rawMrp > p.price ? rawMrp : Math.round(p.price / (1 - 0.28)); // ~28% off default
  const discountPct = Math.max(
    0,
    Math.min(95, Math.round(((mrp - p.price) / mrp) * 100))
  );

  res.json({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: (p as any).brand ?? null,
    seller: (p as any).seller ?? "Pick-a-Perfume India",
    description: (p as any).description ?? null,
    price: p.price,
    mrp,
    discountPct,
    currency: p.currency ?? "INR",
    images: p.images.map((i) => i.url),
  });
});

export default router;
