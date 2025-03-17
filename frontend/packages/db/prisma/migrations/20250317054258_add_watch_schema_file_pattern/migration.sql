-- CreateTable
CREATE TABLE "WatchSchemaFilePattern" (
    "id" SERIAL NOT NULL,
    "pattern" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchSchemaFilePattern_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WatchSchemaFilePattern" ADD CONSTRAINT "WatchSchemaFilePattern_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
