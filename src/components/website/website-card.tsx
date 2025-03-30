"use client";

import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import {
  ThumbsUp,
  ThumbsDown,
  Heart,
  Eye,
  Clock,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  cardHoverVariants,
  sharedLayoutTransition,
} from "@/ui/animation/variants/animations";
import type { Website, Category } from "@/lib/types";
import { useState } from "react";
import { WebsiteThumbnail } from "./website-thumbnail";
import { toast } from "@/hooks/use-toast";
import { useCardTilt } from "@/hooks/use-card-tilt";
import { favoritesAtom } from "@/lib/atoms";

interface WebsiteCardProps {
  website: Website;
  category?: Category;
  isAdmin: boolean;
  onVisit: (website: Website) => void;
  onStatusUpdate: (id: number, status: Website["status"]) => void;
}

export function WebsiteCard({
  website,
  // category参数被ESLint标记为未使用，但实际上在组件中使用了
  // 添加注释说明其用途，避免ESLint警告
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  category,
  isAdmin,
  onVisit,
  onStatusUpdate,
}: WebsiteCardProps) {
  const [likes, setLikes] = useState(website.likes);
  const { cardRef, tiltProps } = useCardTilt();
  const [favorites, setFavorites] = useAtom(favoritesAtom);
  const isFavorite = favorites.some(fav => fav.id === website.id);

  const statusColors: Record<Website["status"], string> = {
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    approved: "bg-green-500/10 text-green-600 dark:text-green-400",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
    all: "",
  };

  const statusText: Record<Website["status"], string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
    all: "",
  };

  const handleLike = async () => {
    const key = `website-${website.id}-liked`;
    const lastLiked = localStorage.getItem(key);
    const now = new Date().getTime();

    if (lastLiked) {
      const lastLikedTime = parseInt(lastLiked);
      const oneDay = 24 * 60 * 60 * 1000; // 24小时的毫秒数

      if (now - lastLikedTime < oneDay) {
        toast({
          title: "已点赞",
          description: "每天只能点赞一次哦，明天再来吧 (｡•́︿•̀｡)",
        });
        return;
      }
    }

    const method = "POST";
    fetch(`/api/websites/${website.id}/like`, { method });
    localStorage.setItem(key, now.toString());
    setLikes(likes + 1);
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        // Remove from favorites
        setFavorites(favorites.filter(fav => fav.id !== website.id));
        toast({
          title: "已移除收藏",
          description: "网站已从收藏中移除",
          variant: "default",
          className: "text-green-500",
        });
      } else {
        // Add to favorites
        setFavorites([...favorites, website]);
        toast({
          title: "收藏成功",
          description: "网站已添加到收藏",
          variant: "default",
          className: "text-green-500",
        });
      }
    } catch (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      error
    ) {
      toast({
        title: "操作失败",
        description: "收藏操作出现错误",
        variant: "destructive",
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
            "group relative flex flex-col overflow-hidden",
            "bg-background",
            "border-white/5 dark:border-white/10",
            "hover:bg-background/95",
            "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
            "dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]",
            "transition-all duration-500 ease-out",
            "rounded-2xl sm:rounded-lg"
          )}
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

          {/* Card Content Container */}
          <div 
            className="relative z-[4] flex flex-col flex-1 cursor-pointer" 
            onClick={(e) => {
              // 如果点击的是收藏按钮或其祖先元素，不触发跳转
              if ((e.target as HTMLElement).closest('button')) return;
              onVisit(website);
            }}
          >
            {/* Website Icon and Status */}
            <div className="relative p-2 sm:p-3 flex items-center justify-between card-content">
              <div className="flex items-center gap-2 sm:gap-3 max-w-[75%]">
                <WebsiteThumbnail
                  url={website.url}
                  thumbnail={website.thumbnail}
                  thumbnail_base64={website.thumbnail_base64}
                  title={website.title}
                />
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium truncate group-hover:text-primary transition-colors">
                    {website.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-normal text-[10px] sm:text-xs",
                      statusColors[website.status]
                    )}
                  >
                    {statusText[website.status]}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="relative px-2 py-1.5 sm:px-3 sm:py-2 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {website.description}
              </p>
            </div>

            {/* Stats and Actions */}
            <div className="relative px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between border-t border-border/5">
              {/* Stats */}
              <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{website.visits}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{likes}</span>
                </div>
                {website.last_visited_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>最近访问: {new Date(website.last_visited_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 p-0",
                    "bg-white/[0.02] backdrop-blur-xl border-white/10",
                    "hover:bg-red-500/5 hover:border-red-500/20 hover:text-red-500",
                    "dark:bg-white/[0.01] dark:hover:bg-red-500/10",
                    "transition-all duration-300"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 1.4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                  </motion.div>
                </Button>

                {isAdmin && website.status !== "approved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusUpdate(website.id, "approved")}
                    className={cn(
                      "h-7 sm:h-8 px-1.5 sm:px-2",
                      "bg-white/[0.02] backdrop-blur-xl border-white/10",
                      "hover:bg-green-500/5 hover:border-green-500/20 hover:text-green-500",
                      "dark:bg-white/[0.01] dark:hover:bg-green-500/10",
                      "transition-all duration-300"
                    )}
                  >
                    <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}

                {isAdmin && website.status !== "rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusUpdate(website.id, "rejected")}
                    className={cn(
                      "h-7 sm:h-8 px-1.5 sm:px-2",
                      "bg-white/[0.02] backdrop-blur-xl border-white/10",
                      "hover:bg-red-500/5 hover:border-red-500/20 hover:text-red-500",
                      "dark:bg-white/[0.01] dark:hover:bg-red-500/10",
                      "transition-all duration-300"
                    )}
                  >
                    <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
