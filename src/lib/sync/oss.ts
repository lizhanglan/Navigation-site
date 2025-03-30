import OSS from "ali-oss";
import type { OSSSettings } from "../atoms";

export interface OSSInterface {
  uploadBackup(data: Buffer): Promise<string>;
  downloadBackup(): Promise<Buffer>;
  deleteBackup(key: string): Promise<void>;
}

export class AliyunOSS implements OSSInterface {
  private client: OSS;

  constructor(config: OSSSettings) {
    this.client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
    });
  }

  async uploadBackup(data: Buffer): Promise<string> {
    if (!process.env.OSS_DATA_KEY) {
      throw new Error("OSS_DATA_KEY is not set");
    }
    const filename = process.env.OSS_DATA_KEY;
    const result = await this.client.put(filename, data);
    return result.url;
  }

  async downloadBackup(): Promise<Buffer> {
    if (!process.env.OSS_DATA_KEY) {
      throw new Error("OSS_DATA_KEY is not set");
    }
    const key = process.env.OSS_DATA_KEY;
    const result = await this.client.get(key);
    return result.content;
  }

  async deleteBackup(): Promise<void> {
    if (!process.env.OSS_DATA_KEY) {
      throw new Error("OSS_DATA_KEY is not set");
    }
    const key = process.env.OSS_DATA_KEY;
    await this.client.delete(key);
  }
}
