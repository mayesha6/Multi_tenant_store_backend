/*
  Warnings:

  - You are about to drop the column `stripePaymentId` on the `subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeSubscriptionId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "subscriptions_stripePaymentId_key";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "stripePaymentId",
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");
