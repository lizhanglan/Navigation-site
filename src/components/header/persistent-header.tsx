"use client";

import { motion } from "framer-motion";
import { Suspense } from "react";
import { SearchBox } from "@/components/search-box";
import CategoryFilter from "@/components/category-filter";
import Fallback from "@/components/loading/fallback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/ui/common/button";
import type { Category } from "@/lib/types";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

interface PersistentHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  isScrolled: boolean; // 此参数在组件内部使用
}

// 创建一个原子状态来存储侧边栏的收缩状态，并持久化到localStorage
const sidebarCollapsedAtom = atomWithStorage("sidebarCollapsed", false);

export function PersistentHeader({
  searchQuery,
  onSearchChange,
  categories,
  isScrolled, // 使用此参数
}: PersistentHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);
  return (
    <>
      {/* Top Search Bar */}
      <div className="fixed top-15 left-0 right-0 z-50 transition-all duration-100 md:duration-300">
        <div className={`py-2 bg-gradient-to-b from-background via-background/95 to-transparent ${isScrolled ? 'shadow-sm' : ''}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <div className="relative h-[36px] sm:h-[40px] md:h-[44px]">
                <SearchBox value={searchQuery} onChange={onSearchChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Left Sidebar Categories */}
      <motion.div 
        className="fixed top-20 left-0 bottom-0 z-40 transition-[background,border] duration-100 md:duration-300 overflow-hidden"
        initial={false}
        animate={{
          width: isCollapsed ? "0px" : "200px",
          opacity: isCollapsed ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="w-[200px] h-full pt-16 p-4 bg-background/30 backdrop-blur-lg border-r border-border/20 shadow-lg">
          <div className="space-y-4">
            <div className="relative">
              <Suspense fallback={<Fallback />}>
                <CategoryFilter categories={categories} />
              </Suspense>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Toggle Button */}
      <div className={`fixed top-24 ${isCollapsed ? 'left-2' : 'left-[180px]'} z-50 transition-all duration-300`}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-border/30 hover:bg-background/90 shadow-md"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </>
  );
}
