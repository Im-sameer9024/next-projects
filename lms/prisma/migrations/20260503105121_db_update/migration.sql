/*
  Warnings:

  - You are about to drop the column `isPublish` on the `Chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "isPublish",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;
