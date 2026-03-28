-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('PRIVACY', 'TERMS', 'ABOUT', 'REFUND', 'COOKIE', 'SHIPPING', 'DISCLAIMER');

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");
