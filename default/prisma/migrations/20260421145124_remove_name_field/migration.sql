/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ProductVariant` DROP COLUMN `imageUrl`,
    DROP COLUMN `name`;
