-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_possessorId_fkey";

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "possessorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_possessorId_fkey" FOREIGN KEY ("possessorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
