"use client";

import { Rankings } from "@/components/website/rankings";
import { Website } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

export function RankingsClient({ websites }: { websites: Website[] }) {
  const handleVisit = async (website: Website) => {
    try {
      fetch(`/api/websites/${website.id}/visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      window.open(website.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to record visit:", error);
      toast({
        variant: "destructive",
        title: "记录访问失败",
        description: "请稍后重试",
      });
    }
  };

  return <Rankings websites={websites} onVisit={handleVisit} />;
}
