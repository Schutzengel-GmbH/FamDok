/*
  Warnings:

  - A unique constraint covering the columns `[uri]` on the table `FooterPage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FooterPage_uri_key" ON "FooterPage"("uri");
