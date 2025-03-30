import { prisma } from "@/lib/db/db";
import HomePage from "@/app/home-page";
import { cachedPrismaQuery } from "@/lib/db/cache";

export const dynamic = "force-dynamic";

export default async function Home() {
  const startTime = Date.now();

  // 在服务端获取初始数据，使用缓存，只选择需要的字段
  const [websitesData, categoriesData] = await Promise.all([
    cachedPrismaQuery(
      "approved-websites",
      () =>
        prisma.website.findMany({
          where: { status: "approved" },
          select: {
            id: true,
            title: true,
            url: true,
            description: true,
            category_id: true,
            thumbnail: true,
            thumbnail_base64: true,
            status: true,
            visits: true,
            likes: true,
            last_visited_at: true,
          },
          orderBy: [
            { last_visited_at: 'desc' },
            { visits: 'desc' }
          ],
        }),
      { ttl: 1 } // 1天缓存
    ),
    cachedPrismaQuery(
      "all-categories",
      () =>
        prisma.category.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
          },
        }),
      { ttl: 1 } // 1周缓存
    ),
  ]);

  const endTime = Date.now();
  console.log(`数据加载耗时: ${endTime - startTime}ms`);

  // 预处理数据，减少客户端计算
  const preFilteredWebsites = websitesData.map((website) => ({
    ...website,
    searchText: `${website.title.toLowerCase()} ${website.description.toLowerCase()}`,
  }));

  return (
    <HomePage
      initialWebsites={preFilteredWebsites}
      initialCategories={categoriesData}
    />
  );
}
