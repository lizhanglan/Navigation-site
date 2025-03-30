"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/ui/common/button";
import { WebsiteForm } from "@/components/forms/website-form";

export default function SubmitPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 sm:px-6 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 pt-6 sm:pt-10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground"
        >
          提交网站
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2 bg-background/50 backdrop-blur-sm border-border/40 hover:bg-background/80 hover:border-border/60 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 text-foreground/70" />
              <span>返回主页</span>
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        {/* 背景效果 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80 rounded-xl backdrop-blur-sm" />

        {/* 内容区域 */}
        <div className="relative bg-background/20 backdrop-blur-sm rounded-xl border border-border/30 shadow-sm">
          <div className="p-4 sm:p-6 md:p-8">
            <WebsiteForm />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
