/*
  Warnings:

  - Added the required column `owner` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "owner" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
