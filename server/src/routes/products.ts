import { Router } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

const Q = z.object({
  order: z.enum(["ALPHABETICAL", "NEWEST", "POPULAR"]).default("ALPHABETICAL"),
  take: z.coerce.number().min(1).max(50).default(12),
  cursor: z.coerce.number().optional(), // product id
});

router.get("/", async (req, res) => {
  const { order, take, cursor } = Q.parse(req.query);

  const orderBy =
    order === "ALPHABETICAL"
      ? [{ name: "asc" as const }]
      : order === "NEWEST"
      ? [{ createdAt: "desc" as const }]
      : [{ popularity: "desc" as const }];

  const rows = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: [...orderBy, { id: "asc" }],
    take: take + 1, // fetch 1 extra to know if there’s another page
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  let nextCursor: number | null = null;
  if (rows.length > take) {
    const next = rows.pop()!;
    nextCursor = next.id;
  }

  res.json({
    items: rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      currency: p.currency ?? "INR",
      popularity: p.popularity,
      createdAt: p.createdAt,
      image: p.images[0]?.url ?? null,
      images: p.images.map((i) => i.url),
    })),
    nextCursor,
  });
});

export default router;
