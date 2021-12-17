/*
  Warnings:

  - A unique constraint covering the columns `[currentPlayerId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentPlayerId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "currentPlayerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_currentPlayerId_key" ON "Game"("currentPlayerId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_currentPlayerId_fkey" FOREIGN KEY ("currentPlayerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
