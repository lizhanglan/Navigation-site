import { prisma } from "@/lib/db/db";

export async function getWebsites() {
  try {
    const websites = await prisma.website.findMany({
      orderBy: [
        { last_visited_at: 'desc' },
        { created_at: 'desc' }
      ],
    });
    return websites;
  } catch (error) {
    console.error("Error fetching websites:", error);
    return [];
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getSettings() {
  try {
    // 获取所有设置
    const settings = await prisma.setting.findMany({
      select: {
        id: true,
        key: true,
        value: true,
      },
    });

    // 转换为对象格式
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    console.log(settingsObject);

    return settingsObject;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
