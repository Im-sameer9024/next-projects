-- CreateIndex
CREATE INDEX "Attachment_id_courseId_idx" ON "Attachment"("id", "courseId");

-- CreateIndex
CREATE INDEX "Attachment_courseId_idx" ON "Attachment"("courseId");

-- CreateIndex
CREATE INDEX "Attachment_attachment_public_id_idx" ON "Attachment"("attachment_public_id");

-- CreateIndex
CREATE INDEX "Category_id_idx" ON "Category"("id");

-- CreateIndex
CREATE INDEX "Chapter_id_courseId_idx" ON "Chapter"("id", "courseId");

-- CreateIndex
CREATE INDEX "Chapter_courseId_idx" ON "Chapter"("courseId");

-- CreateIndex
CREATE INDEX "Course_teacherId_idx" ON "Course"("teacherId");

-- CreateIndex
CREATE INDEX "Course_id_teacherId_idx" ON "Course"("id", "teacherId");

-- CreateIndex
CREATE INDEX "Course_image_public_id_idx" ON "Course"("image_public_id");

-- CreateIndex
CREATE INDEX "MuxData_id_chapterId_idx" ON "MuxData"("id", "chapterId");

-- CreateIndex
CREATE INDEX "MuxData_assetId_idx" ON "MuxData"("assetId");

-- CreateIndex
CREATE INDEX "MuxData_chapterId_idx" ON "MuxData"("chapterId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
