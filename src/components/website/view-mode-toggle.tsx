"use client";

import { motion } from "framer-motion";
import { Button } from "@/ui/common/button";
import { LayoutGrid, LayoutList } from "lucide-react";

interface ViewModeToggleProps {
  isCompact: boolean;
  onChange: (isCompact: boolean) => void;
}

export function ViewModeToggle({ isCompact, onChange }: ViewModeToggleProps) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      <motion.div
        className="bg-background/95 dark:bg-background/85 backdrop-blur-md border border-border/40 dark:border-border/40 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(!isCompact)}
          className="h-8 w-8 p-0 rounded-full relative text-primary"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isCompact ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isCompact ? (
              <LayoutList className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </motion.div>
  );
}
