-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('PERSONAL', 'ACADEMIC', 'PROFESSIONAL');

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "liveLink" TEXT,
    "githubLink" TEXT,
    "technologies" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "projectType" "ProjectType" NOT NULL,
    "myContribution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Projects_profileId_idx" ON "Projects"("profileId");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
