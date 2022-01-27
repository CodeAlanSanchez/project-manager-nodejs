/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `sentId` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "receiverId",
DROP COLUMN "sentId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "memberId";
