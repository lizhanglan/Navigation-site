"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAtomValue, useAtom } from "jotai";
import { isAdminModeAtom, isCompactModeAtom, websitesAtom, selectedCategoryAtom, recentlyVisitedAtom, favoritesAtom } from "@/lib/atoms";
import { useToast } from "@/hooks/use-toast";
import { WebsiteCard } from "./website-card";
import { CompactCard } from "./compact-card";
import { ViewModeToggle } from "./view-mode-toggle";
import { cn } from "@/lib/utils/utils";
import type { Website, Category } from "@/lib/types";
import { Globe, Clock, Heart } from "lucide-react";
import {
  gridContainerVariants,
  gridItemVariants,
} from "@/ui/animation/variants/animations";

interface WebsiteGridProps {
  websites: Website[];
  categories: Category[];
  onVisit: (website: Website) => void;
  className?: string;
}

export default function WebsiteGrid({
  websites,
  categories,
  onVisit,
  className,
}: WebsiteGridProps) {
  const isAdmin = useAtomValue(isAdminModeAtom);
  const { toast } = useToast();
  const [isCompact, setIsCompact] = useAtom(isCompactModeAtom);
  const [, setWebsites] = useAtom(websitesAtom);
  const [, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [recentlyVisited] = useAtom(recentlyVisitedAtom);
  const [favorites] = useAtom(favoritesAtom);
  const categoryRefs = useRef<{ [key: number]: HTMLDivElement }>({});

  // Group websites by category
  const websitesByCategory = categories.reduce<{ [key: number]: Website[] }>((acc, category) => {
    acc[category.id] = websites.filter(website => website.category_id === category.id);
    return acc;
  }, {});

  // Handle intersection observer to track which category is in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50px 0px -30% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const categoryId = Number(entry.target.getAttribute('data-category-id'));
          setSelectedCategory(categoryId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all category sections
    Object.entries(categoryRefs.current).forEach(([id, element]) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [setSelectedCategory, websites, categories]);

  const handleStatusUpdate = async (id: number, status: Website["status"]) => {
    // 使用id参数发送请求
    fetch(`/api/websites/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    setWebsites(
      websites.map((website) =>
        website.id === id ? { ...website, status } : website
      )
    );
    toast({
      title: "状态已更新",
      description: status === "approved" ? "网站已通过审核" : "网站已被拒绝",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("relative min-h-[500px]", className)}
      layout
    >
      <ViewModeToggle isCompact={isCompact} onChange={setIsCompact} />

      {/* 最近浏览分类 */}
      {recentlyVisited.length > 0 && (
        <motion.div
          key="recently-visited"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4 mb-8"
        >
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">最近浏览</h2>
          </div>

          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4"
          >
            {recentlyVisited.map((website, idx) => (
              <motion.div
                key={`recent-${website.id}`}
                variants={gridItemVariants}
                custom={idx}
                layout
                className={cn(
                  "w-full h-full",
                  "transition-all duration-500",
                  "col-span-1"
                )}
              >
                {isCompact ? (
                  <CompactCard
                    website={website}
                    onVisit={onVisit}
                  />
                ) : (
                  <WebsiteCard
                    website={website}
                    category={categories.find(
                      (c) => c.id === website.category_id
                    )}
                    isAdmin={isAdmin}
                    onVisit={onVisit}
                    onStatusUpdate={handleStatusUpdate}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* 收藏分类 */}
      {favorites.length > 0 && (
        <motion.div
          key="favorites"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4 mb-8"
        >
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">我的收藏</h2>
          </div>

          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4"
          >
            {favorites.map((website, idx) => (
              <motion.div
                key={`favorite-${website.id}`}
                variants={gridItemVariants}
                custom={idx}
                layout
                className={cn(
                  "w-full h-full",
                  "transition-all duration-500",
                  "col-span-1"
                )}
              >
                {isCompact ? (
                  <CompactCard
                    website={website}
                    onVisit={onVisit}
                  />
                ) : (
                  <WebsiteCard
                    website={website}
                    category={categories.find(
                      (c) => c.id === website.category_id
                    )}
                    isAdmin={isAdmin}
                    onVisit={onVisit}
                    onStatusUpdate={handleStatusUpdate}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {categories.map((category) => {
        const categoryWebsites = websitesByCategory[category.id] || [];
        if (categoryWebsites.length === 0) return null;

        return (
          <div 
            key={category.id} 
            ref={el => { if (el) categoryRefs.current[category.id] = el; }} 
            data-category-id={category.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
            id={`category-${category.id}`}
          >
            <h2 className="text-xl font-bold mb-4">{category.name}</h2>
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                "grid gap-4",
                isCompact
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
              )}
            >
              {categoryWebsites.map((website, idx) => (
                <motion.div
                  key={website.id}
                  variants={gridItemVariants}
                  custom={idx}
                  layout
                  className={cn(
                    "w-full h-full",
                    "transition-all duration-500",
                    "col-span-1"
                  )}
                >
                  {isCompact ? (
                    <CompactCard
                      website={website}
                      onVisit={onVisit}
                    />
                  ) : (
                    <WebsiteCard
                      website={website}
                      category={category}
                      isAdmin={isAdmin}
                      onVisit={onVisit}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      })}

      {websites.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-[300px]"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto">
              <Globe className="w-10 h-10 text-primary/40" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground/80">
                暂无网站
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                请在左侧搜索栏中搜索网站或选择其他分类
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
