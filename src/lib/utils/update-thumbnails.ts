import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 支持的图片类型
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

// 规范化内容类型
function normalizeContentType(contentType: string | null): string {
  if (!contentType) return "image/jpeg";

  // 处理特殊情况
  if (
    contentType === "image/x-icon" ||
    contentType === "image/vnd.microsoft.icon"
  ) {
    return "image/x-icon";
  }

  return SUPPORTED_IMAGE_TYPES.has(contentType) ? contentType : "image/jpeg";
}

export async function updateWebsiteThumbnails() {
  try {
    // 获取所有需要更新的网站
    const websites = await prisma.website.findMany({
      where: {
        thumbnail: {
          not: "",
        },
      },
      select: {
        id: true,
        thumbnail: true,
      },
    });

    console.log(`开始更新 ${websites.length} 个网站的缩略图`);

    // 逐个更新网站缩略图
    for (const website of websites) {
      try {
        if (!website.thumbnail) continue;

        const image = await fetch(website.thumbnail);

        // 检查响应状态
        if (!image.ok) {
          console.log(
            `网站 ID: ${website.id} 的图片获取失败: HTTP ${image.status}`
          );
          continue;
        }

        // 检查内容类型
        const rawContentType = image.headers.get("content-type");
        const contentType = normalizeContentType(rawContentType);

        if (!SUPPORTED_IMAGE_TYPES.has(contentType)) {
          console.log(
            `网站 ID: ${website.id} 的URL不是支持的图片类型: ${rawContentType}`
          );
          continue;
        }

        const arrayBuffer = await image.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
          console.log(`网站 ID: ${website.id} 的图片内容为空`);
          continue;
        }

        const buffer = Buffer.from(arrayBuffer);
        const imageBase64 = `data:${contentType};base64,${buffer.toString(
          "base64"
        )}`;

        await prisma.website.update({
          where: { id: website.id },
          data: {
            thumbnail_base64: imageBase64,
            updated_at: new Date(),
          },
        });

        console.log(`成功更新网站 ID: ${website.id} 的缩略图`);
      } catch (error) {
        if (error instanceof Error) {
          console.log(
            `更新网站 ID: ${website.id} 的缩略图失败: ${error.message}`
          );
        } else {
          console.log(`更新网站 ID: ${website.id} 的缩略图失败: 未知错误`);
        }
      }

      // 添加延迟，避免请求过快
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("所有缩略图更新完成");
  } catch (error) {
    if (error instanceof Error) {
      console.log("更新缩略图过程中发生错误:", error.message);
    } else {
      console.log("更新缩略图过程中发生未知错误");
    }
  } finally {
    await prisma.$disconnect();
  }
}
