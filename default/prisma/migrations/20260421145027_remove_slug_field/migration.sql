/*
  Warnings:

  - You are about to drop the column `description` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `ProductVariant_slug_idx` ON `ProductVariant`;

-- DropIndex
DROP INDEX `ProductVariant_slug_key` ON `ProductVariant`;

-- AlterTable
ALTER TABLE `ProductVariant` DROP COLUMN `description`,
    DROP COLUMN `slug`;
