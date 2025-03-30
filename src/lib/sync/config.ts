import { atomWithStorage } from "jotai/utils";
import type { SyncConfig, SyncStatus } from "./types";

export const defaultSyncConfig: SyncConfig = {
  autoBackup: false,
  backupInterval: "daily",
  backupOnSubmit: true,
  maxBackups: 10,
  retentionDays: 30,
};

export const BACKUP_INTERVALS = {
  hourly: 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};
