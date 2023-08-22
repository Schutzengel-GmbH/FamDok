-- CreateTable
CREATE TABLE "FooterPage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "markdown" TEXT,

    CONSTRAINT "FooterPage_pkey" PRIMARY KEY ("id")
);
