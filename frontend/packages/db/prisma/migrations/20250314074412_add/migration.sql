-- CreateTable
CREATE TABLE "ProjectRepositoryMapping" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "repositoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectRepositoryMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRepositoryMapping_projectId_repositoryId_key" ON "ProjectRepositoryMapping"("projectId", "repositoryId");

-- AddForeignKey
ALTER TABLE "ProjectRepositoryMapping" ADD CONSTRAINT "ProjectRepositoryMapping_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRepositoryMapping" ADD CONSTRAINT "ProjectRepositoryMapping_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
