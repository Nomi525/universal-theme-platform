-- DropForeignKey
ALTER TABLE "public"."StoreSetting" DROP CONSTRAINT "StoreSetting_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Theme" DROP CONSTRAINT "Theme_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ThemeDesignElement" DROP CONSTRAINT "ThemeDesignElement_themeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ThemeSnapshot" DROP CONSTRAINT "ThemeSnapshot_branchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ThemeSnapshot" DROP CONSTRAINT "ThemeSnapshot_themeId_fkey";

-- CreateIndex
CREATE INDEX "ThemeDesignElement_themeId_position_idx" ON "public"."ThemeDesignElement"("themeId", "position");

-- CreateIndex
CREATE INDEX "ThemeDesignElement_code_idx" ON "public"."ThemeDesignElement"("code");

-- AddForeignKey
ALTER TABLE "public"."Theme" ADD CONSTRAINT "Theme_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ThemeDesignElement" ADD CONSTRAINT "ThemeDesignElement_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "public"."Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ThemeSnapshot" ADD CONSTRAINT "ThemeSnapshot_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ThemeSnapshot" ADD CONSTRAINT "ThemeSnapshot_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "public"."Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StoreSetting" ADD CONSTRAINT "StoreSetting_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
