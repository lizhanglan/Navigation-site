import { Trophy } from "lucide-react";
import { prisma } from "@/lib/db/db";

export default async function RankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 text-center pt-8 md:pt-12 px-4 md:px-0">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full" />
          <Trophy className="h-12 w-12 md:h-16 md:w-16 text-primary relative" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            网站排行榜
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-[600px]">
            发现最受欢迎的AI工具和网站，基于用户访问量和点赞数据实时更新
          </p>
        </div>
      </div>
      {children}
    </>
  );
}
