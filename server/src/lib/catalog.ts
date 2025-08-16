// server/src/lib/catalog.ts
import { prisma } from "./prisma";

export async function getSchemaForThemeDesignElement(themeDesignElementId: number) {
  const block = await prisma.themeDesignElement.findUnique({
    where: { id: themeDesignElementId },
    select: { designElementId: true },
  });
  if (!block) return null;

  const catalog = await prisma.designElementCatalog.findUnique({
    where: { id: block.designElementId! },
    select: { settingsSchema: true },
  });

  return (catalog?.settingsSchema as any) || null;
}
