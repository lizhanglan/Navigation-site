"use client";

import { motion } from "framer-motion";
import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import { Heart, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  cardHoverVariants,
  sharedLayoutTransition,
} from "@/ui/animation/variants/animations";
import type { Website } from "@/lib/types";
import { useState } from "react";
import { WebsiteThumbnail } from "./website-thumbnail";
import { toast } from "@/hooks/use-toast";
import { useCardTilt } from "@/hooks/use-card-tilt";
import { useAtom } from "jotai";
import { favoritesAtom } from "@/lib/atoms";
import { Plus, Minus } from "lucide-react";

interface CompactCardProps {
  website: Website;
  onVisit: (website: Website) => void;
}

export function CompactCard({ website, onVisit }: CompactCardProps) {
  const [likes] = useState(website.likes);
  const { cardRef, tiltProps } = useCardTilt();
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const isFavorite = favorites.some(fav => fav.id === website.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== website.id));
      toast({
        title: "已移除收藏",
        description: "网站已从收藏中移除",
        variant: "default",
        className: "text-green-500",
      });
    } else {
      setFavorites([...favorites, website]);
      toast({
        title: "收藏成功",
        description: "网站已添加到收藏",
        variant: "default",
        className: "text-green-500",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={tiltProps.onMouseMove}
      onMouseEnter={tiltProps.onMouseEnter}
      onMouseLeave={tiltProps.onMouseLeave}
      className="card-container relative [perspective:1000px]"
    >
      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        layoutId={`website-${website.id}`}
        transition={sharedLayoutTransition}
        className="h-full"
      >
        <Card
          className={cn(
            "group relative flex items-center gap-3 p-2 sm:p-3 cursor-pointer",
            "bg-background",
            "border-white/5 dark:border-white/10",
            "hover:bg-background/95",
            "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
            "dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]",
            "transition-all duration-500 ease-out",
            "rounded-2xl sm:rounded-lg"
          )}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            onVisit(website);
          }}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 z-[3]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
          </div>

          {/* Favorite Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleFavoriteToggle}
            title={isFavorite ? "取消收藏" : "收藏"}
            aria-label={isFavorite ? "取消收藏" : "收藏"}
            className={cn(
              "absolute top-1 right-1 z-10 h-7 w-7 sm:h-8 sm:w-8 p-0",
              "bg-white/[0.02] backdrop-blur-xl border-white/10",
              isFavorite 
                ? "bg-green-500/5 border-green-500/20 text-green-500" 
                : "hover:bg-green-500/5 hover:border-green-500/20 hover:text-green-500",
              "dark:bg-white/[0.01]",
              isFavorite 
                ? "dark:bg-green-500/10" 
                : "dark:hover:bg-green-500/10",
              "transition-all duration-300"
            )}
          >
            <motion.div
              whileTap={{ scale: 1.4 }}
              transition={{ duration: 0.2 }}
            >
              {isFavorite ? (
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </motion.div>
          </Button>

          {/* Card Content */}
          <div className="relative z-[4] flex items-center gap-3 flex-1">
            <WebsiteThumbnail
              url={website.url}
              thumbnail={website.thumbnail}
              thumbnail_base64={website.thumbnail_base64}
              title={website.title}
              className="w-10 h-10 rounded-lg shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105"
            />

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {website.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>{website.visits}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Heart className="w-3 h-3" />
                  <span>{likes}</span>
                </div>
                {website.last_visited_at && (
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>最近: {new Date(website.last_visited_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>


          </div>
        </Card>
      </motion.div>
    </div>
  );
}
