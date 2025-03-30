export interface BackupMetadata {
  id: string;
  timestamp: string;
  size: number;
  trigger: "manual" | "auto" | "onSubmit";
  description?: string;
}

export interface SyncConfig {
  autoBackup: boolean;
  backupInterval: "hourly" | "daily" | "weekly" | "monthly";
  backupOnSubmit: boolean;
  maxBackups: number;
  retentionDays: number;
}

export interface SyncStatus {
  lastBackupTime: string | null;
  lastSyncTime: string | null;
  status: "idle" | "syncing" | "error";
  error?: string;
}
