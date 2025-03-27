-- CreateTable
CREATE TABLE "GitHubDocFilePath" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "isReviewEnabled" BOOLEAN NOT NULL DEFAULT true,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubDocFilePath_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubDocFilePath_path_projectId_key" ON "GitHubDocFilePath"("path", "projectId");

-- AddForeignKey
ALTER TABLE "GitHubDocFilePath" ADD CONSTRAINT "GitHubDocFilePath_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
