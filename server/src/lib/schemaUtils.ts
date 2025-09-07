// server/src/lib/schemaUtils.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getCatalogAndSchemaByDesignElementId(designElementId: number) {
  const catalog = await prisma.designElementCatalog.findUnique({ where: { id: designElementId } });
  return {
    catalog,
    schema: (catalog?.settingsSchema as any) || null,
  };
}
