/*
  Warnings:

  - You are about to drop the column `installationId` on the `PullRequest` table. All the data in the column will be lost.
  - You are about to drop the column `repositoryName` on the `PullRequest` table. All the data in the column will be lost.
  - You are about to drop the column `repositoryOwner` on the `PullRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[repositoryId,pullNumber]` on the table `PullRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `repositoryId` to the `PullRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PullRequest_repositoryOwner_repositoryName_pullNumber_key";

-- AlterTable
ALTER TABLE "PullRequest" DROP COLUMN "installationId",
DROP COLUMN "repositoryName",
DROP COLUMN "repositoryOwner",
ADD COLUMN     "repositoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Repository" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "installationId" BIGINT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repository_owner_name_key" ON "Repository"("owner", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PullRequest_repositoryId_pullNumber_key" ON "PullRequest"("repositoryId", "pullNumber");

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
