import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class AjaxResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  code: number = 200;

  constructor(
    success: boolean,
    data: T | null,
    message: string = "",
    code: number = 200
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.code = code;
  }

  static ok<T>(data: T): AjaxResponse<T> {
    return new AjaxResponse<T>(true, data, "", 200);
  }

  static fail<T>(message: string, code: number = 500): AjaxResponse<T> {
    return new AjaxResponse<T>(false, null, message, code);
  }
}

export async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("无法访问该网站");
    }
    const html = await response.text();

    // 解析网页标题 - 优先使用 og:title，其次是 title 标签
    let title = "";
    const ogTitleMatch = html.match(
      /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i
    );
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (ogTitleMatch) {
      title = ogTitleMatch[1].trim();
    } else if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // 解析网页描述 - 尝试多种 meta 描述标签
    let description = "";
    const ogDescMatch = html.match(
      /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i
    );
    const descMatch = html.match(
      /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i
    );
    const twitterDescMatch = html.match(
      /<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i
    );
    if (ogDescMatch) {
      description = ogDescMatch[1].trim();
    } else if (descMatch) {
      description = descMatch[1].trim();
    } else if (twitterDescMatch) {
      description = twitterDescMatch[1].trim();
    }

    // 解析网页图片 - 尝试多种图片meta标签
    let image = "";
    const ogImageMatch = html.match(
      /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i
    );
    const twitterImageMatch = html.match(
      /<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"[^>]*>/i
    );
    const msImageMatch = html.match(
      /<meta[^>]*name="msapplication-TileImage"[^>]*content="([^"]*)"[^>]*>/i
    );
    const iconMatch = html.match(
      /<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/i
    );
    const appleTouchIconMatch = html.match(
      /<link[^>]*rel="apple-touch-icon"[^>]*href="([^"]*)"[^>]*>/i
    );

    if (ogImageMatch) {
      image = ogImageMatch[1].trim();
    } else if (twitterImageMatch) {
      image = twitterImageMatch[1].trim();
    } else if (msImageMatch) {
      image = msImageMatch[1].trim();
    } else if (appleTouchIconMatch) {
      image = appleTouchIconMatch[1].trim();
    } else if (iconMatch) {
      image = iconMatch[1].trim();
    }

    // 如果图片URL是相对路径，转换为绝对路径
    if (image && !image.startsWith("http")) {
      const urlObj = new URL(url);
      if (image.startsWith("/")) {
        image = `${urlObj.protocol}//${urlObj.host}${image}`;
      } else {
        image = `${urlObj.protocol}//${urlObj.host}/${image}`;
      }
    }

    return {
      title: decodeHTMLEntities(title),
      description: decodeHTMLEntities(description),
      image,
    };
  } catch (error) {
    throw new Error("获取网站信息失败");
  }
}

// 辅助函数：解码HTML实体
function decodeHTMLEntities(text: string): string {
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
  };
  return text.replace(
    /&[^;]+;/g,
    (entity) => entities[entity as keyof typeof entities] || entity
  );
}
