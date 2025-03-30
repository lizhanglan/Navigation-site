-- AlterTable
ALTER TABLE `websites` ADD COLUMN `last_visited_at` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `websites_last_visited_at_idx` ON `websites`(`last_visited_at`);
