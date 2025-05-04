-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "adminemail" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_name_key" ON "Hotel"("name");
