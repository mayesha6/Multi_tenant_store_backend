/*
  Warnings:

  - You are about to drop the column `slug` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Content` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Content_slug_key";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "slug",
DROP COLUMN "version",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
