import { prisma } from "@/lib/prisma";
import { RankingsClient } from "@/components/website/rankings-client";

export default async function RankingsPage() {
  const websites = await prisma.website.findMany({
    where: {
      status: "approved",
    },
    orderBy: [{ visits: "desc" }, { likes: "desc" }],
  });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="max-w-4xl mx-auto">
            <RankingsClient websites={websites} />
          </div>
        </div>
      </div>
    </div>
  );
}
