-- AlterTable
ALTER TABLE `Product` ADD COLUMN `discountPercent` INTEGER NULL DEFAULT 0,
    ADD COLUMN `isBestSeller` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isOnSale` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `originalPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `productType` ENUM('GENERAL', 'SPORT', 'HOME', 'OFFICE', 'CASUAL', 'FORMAL', 'ATHLETIC', 'OUTDOOR', 'ACCESSORY') NOT NULL DEFAULT 'GENERAL',
    ADD COLUMN `salePrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `tags` VARCHAR(191) NULL DEFAULT '';

-- CreateIndex
CREATE INDEX `Product_isFeatured_idx` ON `Product`(`isFeatured`);

-- CreateIndex
CREATE INDEX `Product_isBestSeller_idx` ON `Product`(`isBestSeller`);

-- CreateIndex
CREATE INDEX `Product_isOnSale_idx` ON `Product`(`isOnSale`);

-- CreateIndex
CREATE INDEX `Product_productType_idx` ON `Product`(`productType`);
