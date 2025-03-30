"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import { Heart, Eye, Trophy, ArrowUpRight, Crown, Medal, Clock } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { Website } from "@/lib/types";

interface RankingsProps {
  websites: Website[];
  onVisit: (website: Website) => void;
}

export function Rankings({ websites, onVisit }: RankingsProps) {
  const [activeTab, setActiveTab] = useState<"visits" | "likes" | "recent">("visits");

  const sortedWebsites = [...websites].sort((a, b) => {
    switch (activeTab) {
      case "visits":
        return b.visits - a.visits;
      case "likes":
        return b.likes - a.likes;
      case "recent":
        const aDate = a.last_visited_at ? new Date(a.last_visited_at).getTime() : 0;
        const bDate = b.last_visited_at ? new Date(b.last_visited_at).getTime() : 0;
        return bDate - aDate;
      default:
        return 0;
    }
  }).slice(0, 10);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 1:
        return <Crown className="w-4 h-4 text-gray-400" />;
      case 2:
        return <Crown className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="text-sm font-medium">{index + 1}</span>;
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-500/5 hover:bg-yellow-500/10";
      case 1:
        return "bg-gray-500/5 hover:bg-gray-500/10";
      case 2:
        return "bg-amber-500/5 hover:bg-amber-500/10";
      default:
        return "hover:bg-accent/5";
    }
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-border/40">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary/60" />
            <span>排行榜</span>
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "visits" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("visits")}
              className="h-7 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              访问
            </Button>
            <Button
              variant={activeTab === "likes" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("likes")}
              className="h-7 text-xs"
            >
              <Heart className="w-3 h-3 mr-1" />
              点赞
            </Button>
            <Button
              variant={activeTab === "recent" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("recent")}
              className="h-7 text-xs"
            >
              <Clock className="w-3 h-3 mr-1" />
              最近
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border/50">
          <AnimatePresence mode="popLayout">
            {sortedWebsites.map((website, index) => (
              <motion.div
                key={`${website.id}-${activeTab}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.03,
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className={cn(
                  "relative p-3 flex items-center gap-3 group cursor-pointer",
                  getRankStyle(index),
                  "active:bg-accent/10",
                  "transition-all duration-200"
                )}
                onClick={() => onVisit(website)}
              >
                {/* 排名图标 */}
                <motion.div
                  className={cn(
                    "w-8 h-8 flex items-center justify-center shrink-0",
                    "bg-muted/30 rounded-full",
                    "group-hover:bg-muted/50",
                    "transition-colors duration-200"
                  )}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {getRankIcon(index)}
                </motion.div>

                {/* 网站信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {website.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <span>{website.visits}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Heart className="w-3 h-3" />
                      <span>{website.likes}</span>
                    </div>
                    {website.last_visited_at && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>最近: {new Date(website.last_visited_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 访问按钮 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
