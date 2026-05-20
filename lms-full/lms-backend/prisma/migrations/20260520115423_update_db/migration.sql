-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "isProcessingVideo" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Chapter_id_idx" ON "Chapter"("id");
