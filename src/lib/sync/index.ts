import { BackupManager } from "./backup";
import { OSSInterface, AliyunOSS } from "./oss";
import { DatabaseInterface } from "../db/sqlite";
import { SyncConfig } from "./types";

let backupManager: BackupManager | null = null;

export function getBackupManager(db: DatabaseInterface): BackupManager {
  if (!backupManager) {
    const syncConfig: SyncConfig = {
      autoBackup: process.env.BACKUP_ENABLED === "true",
      backupInterval: process.env.BACKUP_INTERVAL as
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly",
      backupOnSubmit: true,
      maxBackups: 10,
      retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || "30", 10),
    };

    const oss: OSSInterface = new AliyunOSS({
      provider: "aliyun",
      region: process.env.OSS_REGION!,
      bucket: process.env.OSS_BUCKET!,
      accessKeyId: process.env.OSS_ACCESS_KEY!,
      accessKeySecret: process.env.OSS_ACCESS_SECRET!,
      endpoint: process.env.OSS_ENDPOINT!,
    });

    backupManager = new BackupManager(syncConfig, oss, db);
  }
  return backupManager;
}

export function resetBackupManager(): void {
  backupManager = null;
}
