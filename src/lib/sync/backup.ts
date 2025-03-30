import { nanoid } from "nanoid";
import type { BackupMetadata, SyncConfig } from "./types";
import { OSSInterface } from "./oss";
import { DatabaseInterface } from "../db/sqlite";

export class BackupManager {
  private db: DatabaseInterface;
  private autoBackupTimer: NodeJS.Timeout | null = null;
  private oss: OSSInterface;
  private syncConfig: SyncConfig;

  constructor(
    syncConfig: SyncConfig,
    oss: OSSInterface,
    db: DatabaseInterface
  ) {
    this.db = db;
    this.oss = oss;
    this.syncConfig = syncConfig;
  }

  async createBackup(): Promise<void> {
    const data = await this.db.exportData();
    await this.oss.uploadBackup(data);
  }

  async restoreFromBackup(): Promise<void> {
    const data = await this.oss.downloadBackup();
    await this.db.importData(data);
  }

  startAutoBackup(): void {
    if (this.autoBackupTimer) {
      clearInterval(this.autoBackupTimer);
    }

    if (!this.syncConfig.autoBackup) return;

    const interval = this.getBackupInterval();
    this.autoBackupTimer = setInterval(async () => {
      try {
        await this.createBackup();
      } catch (error) {
        console.error("Auto backup failed:", error);
      }
    }, interval);
  }

  stopAutoBackup(): void {
    if (this.autoBackupTimer) {
      clearInterval(this.autoBackupTimer);
      this.autoBackupTimer = null;
    }
  }

  private getBackupInterval(): number {
    const intervals = {
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    };
    return intervals[this.syncConfig.backupInterval];
  }
}
