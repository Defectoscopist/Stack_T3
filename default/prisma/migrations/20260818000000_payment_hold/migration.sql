-- Add `stockReserved` to ProductVariant (stock hold / reservation)
ALTER TABLE `ProductVariant` ADD COLUMN `stockReserved` INT NOT NULL DEFAULT 0;

-- Extend OrderStatus enum with `PAID`
ALTER TABLE `Order`
  MODIFY `status` ENUM('PENDING','PAID','DELIVERING','COMPLETED','CANCELLED','RETURNING','RETURNED') NOT NULL DEFAULT 'PENDING';

-- Add payment fields to Order
ALTER TABLE `Order`
  ADD COLUMN `paymentStatus` ENUM('PENDING_PAYMENT','PAID','FAILED','REFUNDED') NULL DEFAULT 'PENDING_PAYMENT',
  ADD COLUMN `paymentIntentId` VARCHAR(191) NULL,
  ADD COLUMN `holdExpiresAt` DATETIME(3) NULL;

-- Index on paymentStatus (optional, matches @@index)
CREATE INDEX `Order_paymentStatus_idx` ON `Order`(`paymentStatus`);

-- Track reserved quantity on OrderItem
ALTER TABLE `OrderItem` ADD COLUMN `reserved` INT NOT NULL DEFAULT 0;