-- AlterTable
ALTER TABLE `ProductVariant` ADD COLUMN `size` ENUM('XXXXS', 'XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'ONE_SIZE') NOT NULL DEFAULT 'ONE_SIZE';
