"use client";

import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { selectedCategoryAtom } from "@/lib/atoms/index";
import { Button } from "../ui/common/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/common/dropdown-menu";
import type { Category } from "@/lib/types";
import { useState, useEffect } from "react";

interface CategoryFilterProps {
  categories: Category[];
}

const buttonVariants = {
  active: {
    scale: 1.05,
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "hsl(var(--primary))",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  inactive: {
    scale: 1,
    backgroundColor: "rgba(255, 255, 255, 0)",
    color: "hsl(var(--muted-foreground))",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedCategoryName = selectedCategory
    ? categories?.find((c) => c.id === Number(selectedCategory))?.name ||
      "未知分类"
    : categories[0]?.name || "未知分类";

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    scrollToCategory(categoryId);
  };

  // Function to scroll to the selected category
  const scrollToCategory = (categoryId: number) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Smooth scroll to the category section
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="text-xl font-bold mb-3 text-foreground/90">所有分类</div>
      {/* Mobile: Dropdown Menu */}
      <div className="md:hidden bg-background/20 backdrop-blur-xl border-border/40 shadow-lg rounded-xl">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-background/40 backdrop-blur-sm border-border/30 hover:bg-background/60 hover:border-border/50 h-10 px-4 rounded-xl"
            >
              <motion.span
                initial={false}
                animate={{
                  color:
                    selectedCategory === null
                      ? "hsl(var(--primary))"
                      : "hsl(var(--foreground))",
                }}
                className="font-medium"
              >
                {selectedCategoryName}
              </motion.span>
              <motion.div
                initial={false}
                animate={{ rotate: 0 }}
                exit={{ rotate: 180 }}
              >
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </motion.div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[calc(100vw-2rem)] min-w-[200px] bg-background/95 backdrop-blur-md border-border/30 shadow-lg rounded-lg overflow-hidden"
            align="center"
            sideOffset={8}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="py-1"
            >
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`${
                    selectedCategory?.toString() === category.id.toString()
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/80 hover:text-foreground"
                  } h-11 flex items-center px-4 hover:bg-accent/50 focus:bg-accent active:bg-accent/70 transition-colors duration-200`}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: Vertical Category List */}
      <div className="hidden md:block">
        <div className="bg-background/20 backdrop-blur-xl rounded-lg p-2">
          <div className="max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hidden">
            <div className="space-y-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id ?? "all"}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full flex items-center py-2.5 px-3 text-sm rounded-md transition-all duration-300
                    ${
                      selectedCategory === category.id
                        ? "bg-white dark:bg-primary text-primary dark:text-primary-foreground font-medium shadow-[0_2px_8px_-2px_rgba(0,0,0,0.2)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                    }`}
                  initial={false}
                  animate={
                    selectedCategory === category.id ? "active" : "inactive"
                  }
                  variants={buttonVariants}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
