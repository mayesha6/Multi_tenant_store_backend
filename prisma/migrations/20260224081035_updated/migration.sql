/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripePaymentId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripePaymentId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "subscriptions_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeCustomerId";

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "stripePriceId";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "stripePaymentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripePaymentId_key" ON "subscriptions"("stripePaymentId");
