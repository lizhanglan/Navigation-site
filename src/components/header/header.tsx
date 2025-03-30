import Link from "next/link";
import { Trophy, Plus, Brain, Download, Info, BookOpen } from "lucide-react";
import { Button } from "@/ui/common/button";
import ThemeSwitch from "@/components/theme-switcher/theme-switch";
import MobileMenu from "./mobile-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/common/tooltip";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/30 backdrop-blur-lg">
      <nav className="container mx-auto px-4 h-14">
        <div className="flex h-full items-center justify-between gap-4">
          {/* Logo and Title */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <div className="flex items-center">
              <span className="font-bold text-lg">广西警察学院期刊编辑部</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/rankings">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                <span>排行榜</span>
              </Button>
            </Link>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/scripts/tamper-monkey-script.user.js">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>安装脚本</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] p-3">
                  <p className="font-medium mb-1">AI导航助手脚本</p>
                  <p className="text-sm text-muted-foreground">
                    功能：自动识别并采集当前网页的AI工具信息，快速提交到AI导航。
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    需要先安装 Tampermonkey 或 Violentmonkey 浏览器扩展。
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Link href="/submit">
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>提交网站</span>
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                <span>关于</span>
              </Button>
            </Link>

            <ThemeSwitch />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
