"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { atomWithStorage } from "jotai/utils";
import { websitesAtom } from "@/lib/atoms";
import {
  categoriesAtom,
  searchQueryAtom,
  selectedCategoryAtom,
  recentlyVisitedAtom,
  favoritesAtom,
} from "@/lib/atoms";

// 引入侧边栏收缩状态原子
const sidebarCollapsedAtom = atomWithStorage("sidebarCollapsed", false);
import WebsiteGrid from "@/components/website/website-grid";
import { PersistentHeader } from "@/components/header/persistent-header";
import { Typewriter } from "@/ui/animation/typewriter";
import { Brain, Cpu, Sparkles, Zap } from "lucide-react";
import type { Website, Category } from "@/lib/types";
import { useTheme } from "next-themes";
import { WaveText } from "@/ui/animation/wave-text";

interface HomePageProps {
  initialWebsites: Website[];
  initialCategories: Category[];
}

export default function HomePage({
  initialWebsites,
  initialCategories,
}: HomePageProps) {
  const [websites, setWebsites] = useAtom(websitesAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  // 这些变量在应用中有实际用途
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [selectedCategory] = useAtom(selectedCategoryAtom); // 用于分类过滤和滚动定位
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [recentlyVisited, setRecentlyVisited] = useAtom(recentlyVisitedAtom); // 用于最近访问记录
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [favorites, setFavorites] = useAtom(favoritesAtom); // 用于收藏功能
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [isCollapsed] = useAtom(sidebarCollapsedAtom); // 用于侧边栏折叠状态
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  // Enhanced scroll-based animations
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, -100]);
  const isScrolled = useTransform(scrollY, (value) => value > 300);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);

  // 初始化数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 在客户端环境下初始化数据
      setWebsites(initialWebsites);
      setCategories(initialCategories);
      
      // 确保收藏和最近浏览的数据在页面刷新后也能正确显示
      // 从localStorage中获取数据并设置到状态中
      const storedRecentlyVisited = localStorage.getItem('recentlyVisited');
      const storedFavorites = localStorage.getItem('favorites');
      
      if (storedRecentlyVisited) {
        try {
          const parsedRecentlyVisited = JSON.parse(storedRecentlyVisited);
          if (Array.isArray(parsedRecentlyVisited) && parsedRecentlyVisited.length > 0) {
            setRecentlyVisited(parsedRecentlyVisited);
          }
        } catch (error) {
          console.error('解析最近浏览数据失败:', error);
        }
      }
      
      if (storedFavorites) {
        try {
          const parsedFavorites = JSON.parse(storedFavorites);
          if (Array.isArray(parsedFavorites) && parsedFavorites.length > 0) {
            setFavorites(parsedFavorites);
          }
        } catch (error) {
          console.error('解析收藏数据失败:', error);
        }
      }
    }
  }, [initialWebsites, initialCategories, setWebsites, setCategories, setRecentlyVisited, setFavorites]);

  // 处理搜索过滤
  useEffect(() => {
    if (!websites) return;

    const filtered = websites.filter((website) => {
      const matchesSearch =
        !searchQuery ||
        website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        website.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    setFilteredWebsites(filtered as Website[]);
  }, [websites, searchQuery]);

  // 处理主题切换
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleVisit = (website: Website) => {
    fetch(`/api/websites/${website.id}/visit`, { method: "POST" });
    window.open(website.url, "_blank");
    
    // 更新最近浏览列表
    setRecentlyVisited(prev => {
      // 过滤掉已存在的相同网站（如果有）
      const filtered = prev.filter(item => item.id !== website.id);
      // 将当前网站添加到最前面
      const updated = [website, ...filtered];
      // 如果超过8个，截取前8个
      return updated.slice(0, 8);
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 -z-10 overflow-hidden"
        initial={false}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <motion.div
          initial={false}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </motion.div>

      {/* Persistent Header */}
      <PersistentHeader
        searchQuery={searchQuery}
        onSearchChange={(searchQuery) => setSearchQuery(searchQuery)}
        categories={categories}
        isScrolled={isScrolled.get()}
      />

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative pt-24 w-full transition-all duration-300 ease-in-out"
      >
        {/* Hero Section */}
        <motion.div
          className="relative py-12"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroTranslateY,
          }}
        >
          {/* Floating Icons */}
          <AnimatePresence mode="popLayout">
            {[
              {
                Icon: Brain,
                position: "left-1/4 top-1/4",
                size: "w-12 h-12",
              },
              { Icon: Cpu, position: "right-1/4 top-1/3", size: "w-10 h-10" },
              {
                Icon: Sparkles,
                position: "left-1/3 bottom-1/4",
                size: "w-8 h-8",
              },
              {
                Icon: Zap,
                position: "right-1/3 bottom-1/3",
                size: "w-9 h-9",
              },
            ].map(({ Icon, position, size }, index) => (
              <motion.div
                key={index}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${position}`}
                initial={false}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.2,
                    duration: 0.8,
                  },
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: 10,
                  transition: { duration: 0.3 },
                }}
              >
                <Icon className={`${size} text-primary/20`} />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="container mx-auto px-4 space-y-6 sm:space-y-8">
            {/* Title */}
            <motion.div className="space-y-3 sm:space-y-4 max-w-xl mx-auto text-left">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight sm:leading-normal">
                <WaveText className="text-primary">
                  科研，从现在开始！
                </WaveText>
              </div>
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground/90"
              >
                <Typewriter
                  text="不就是打输了，别这么垂头丧气。我们是妖精的尾巴，永不停歇的公会。只要活着就要勇往直前的奔跑去。"
                  speed={80}
                  delay={500}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Website Grid */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="container mx-auto px-4 pb-24"
        >
          <WebsiteGrid
            websites={filteredWebsites}
            categories={categories}
            onVisit={handleVisit}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
