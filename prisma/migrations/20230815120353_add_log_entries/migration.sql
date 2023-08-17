-- CreateTable
CREATE TABLE "LogEntry" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);
