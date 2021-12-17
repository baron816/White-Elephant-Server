-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "currentlyPlayingId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "hostId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "submitterId" INTEGER NOT NULL,
    "possessorId" INTEGER NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubmissionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_hostId_key" ON "Game"("hostId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_possessorId_key" ON "Submission"("possessorId");

-- CreateIndex
CREATE UNIQUE INDEX "_SubmissionToUser_AB_unique" ON "_SubmissionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SubmissionToUser_B_index" ON "_SubmissionToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentlyPlayingId_fkey" FOREIGN KEY ("currentlyPlayingId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_possessorId_fkey" FOREIGN KEY ("possessorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubmissionToUser" ADD FOREIGN KEY ("A") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubmissionToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
