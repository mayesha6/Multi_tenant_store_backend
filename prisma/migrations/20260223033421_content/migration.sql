/*
  Warnings:

  - The values [PRIVACY,TERMS,ABOUT,REFUND,COOKIE,SHIPPING,DISCLAIMER] on the enum `ContentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContentType_new" AS ENUM ('privacy', 'terms', 'about', 'refund', 'cookie', 'shipping', 'disclaimer');
ALTER TABLE "Content" ALTER COLUMN "type" TYPE "ContentType_new" USING ("type"::text::"ContentType_new");
ALTER TYPE "ContentType" RENAME TO "ContentType_old";
ALTER TYPE "ContentType_new" RENAME TO "ContentType";
DROP TYPE "public"."ContentType_old";
COMMIT;
