-- Create `MobileToken` (bearer tokens for the Expo/React Native client)
CREATE TABLE `MobileToken` (
  `id`        VARCHAR(191) NOT NULL,
  `tokenHash` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `userId`    VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE KEY `MobileToken_tokenHash_key` (`tokenHash`),
  KEY `MobileToken_tokenHash_idx` (`tokenHash`),
  KEY `MobileToken_userId_idx` (`userId`),
  CONSTRAINT `MobileToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;