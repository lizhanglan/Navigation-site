import { CronJob } from "cron";
import { updateWebsiteThumbnails } from "../utils/update-thumbnails";

// 每天凌晨3点执行
export const thumbnailUpdateJob = new CronJob(
  "0 3 * * *",
  async () => {
    console.log("开始执行缩略图更新任务");
    await updateWebsiteThumbnails();
    console.log("缩略图更新任务完成");
  },
  null,
  false,
  "Asia/Shanghai"
);
