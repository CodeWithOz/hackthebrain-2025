/*
  Warnings:

  - You are about to drop the column `fullName` on the `DoctorProfile` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `DoctorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `DoctorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DoctorProfile" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "resumeUrl" TEXT;
