"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaForThemeDesignElement = getSchemaForThemeDesignElement;
// server/src/lib/catalog.ts
const prisma_1 = require("./prisma");
async function getSchemaForThemeDesignElement(themeDesignElementId) {
    const block = await prisma_1.prisma.themeDesignElement.findUnique({
        where: { id: themeDesignElementId },
        select: { designElementId: true },
    });
    if (!block)
        return null;
    const catalog = await prisma_1.prisma.designElementCatalog.findUnique({
        where: { id: block.designElementId },
        select: { settingsSchema: true },
    });
    return catalog?.settingsSchema || null;
}
