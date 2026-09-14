-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('draft', 'live', 'sold');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('deadstock', 'excellent', 'very good', 'good', 'worn');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('outerwear', 'tailoring', 'knitwear', 'shirting', 'denim', 'trousers', 'footwear', 'accessories');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "igMediaId" TEXT,
    "brand" TEXT NOT NULL,
    "designer" TEXT,
    "season" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "category" "Category",
    "condition" "Condition",
    "priceCHF" INTEGER NOT NULL,
    "measurements" JSONB NOT NULL DEFAULT '{}',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ProductStatus" NOT NULL DEFAULT 'draft',
    "conditionNotes" TEXT,
    "sourceCaption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_igMediaId_key" ON "Product"("igMediaId");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "Product"("brand");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");
