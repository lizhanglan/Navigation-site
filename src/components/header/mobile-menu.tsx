"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Plus, Download, Info, Menu, X } from "lucide-react";
import { Button } from "@/ui/common/button";
import ThemeSwitch from "@/components/theme-switcher/theme-switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/common/tooltip";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 mx-4 p-4 rounded-xl shadow-lg bg-background/90 backdrop-blur-xl border">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Link href="/rankings" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/5 font-medium text-base rounded-lg h-12"
                >
                  <Trophy className="h-5 w-5 mr-3 text-primary" />
                  排行榜
                </Button>
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/scripts/ai-nav-collector.user.js"
                      className="w-full"
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-primary/5 font-medium text-base rounded-lg h-12"
                      >
                        <Download className="h-5 w-5 mr-3 text-primary" />
                        安装脚本
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] p-4">
                    <p className="font-medium mb-2 text-primary">
                      AI导航助手脚本
                    </p>
                    <p className="text-sm text-muted-foreground">
                      功能：自动识别并采集当前网页的AI工具信息，快速提交到AI导航。
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      需要先安装 Tampermonkey 或 Violentmonkey 浏览器扩展。
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <Link href="/submit" className="w-full">
                <Button className="w-full justify-start font-medium text-base rounded-lg h-12 bg-primary/10 hover:bg-primary/15 text-primary">
                  <Plus className="h-5 w-5 mr-3" />
                  提交网站
                </Button>
              </Link>
              <Link href="/about" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/5 font-medium text-base rounded-lg h-12"
                >
                  <Info className="h-5 w-5 mr-3 text-primary" />
                  关于
                </Button>
              </Link>
            </div>

            <div className="h-px my-1 bg-border/10" />
            <div className="flex justify-end pt-1">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
