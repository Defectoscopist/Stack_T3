-- AlterTable
ALTER TABLE `Product` ADD COLUMN `sex` ENUM('MEN', 'WOMEN', 'KIDS', 'UNISEX') NOT NULL DEFAULT 'UNISEX';

-- CreateIndex
CREATE INDEX `Product_sex_idx` ON `Product`(`sex`);
