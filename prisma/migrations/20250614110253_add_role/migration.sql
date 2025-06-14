-- CreateEnum
CREATE TYPE "roles" AS ENUM ('ADMIN', 'DOCTOR', 'PATIENT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "roles" NOT NULL DEFAULT 'PATIENT';
