-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_currentPlayerId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "active" SET DEFAULT false,
ALTER COLUMN "currentPlayerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_currentPlayerId_fkey" FOREIGN KEY ("currentPlayerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
