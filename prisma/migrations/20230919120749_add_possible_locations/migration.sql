-- CreateTable
CREATE TABLE "PossibleLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PossibleLocation_id_key" ON "PossibleLocation"("id");
