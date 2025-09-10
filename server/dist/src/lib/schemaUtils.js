"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCatalogAndSchemaByDesignElementId = getCatalogAndSchemaByDesignElementId;
// server/src/lib/schemaUtils.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getCatalogAndSchemaByDesignElementId(designElementId) {
    const catalog = await prisma.designElementCatalog.findUnique({ where: { id: designElementId } });
    return {
        catalog,
        schema: catalog?.settingsSchema || null,
    };
}
