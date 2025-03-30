"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/ui/common/button";
import { cn } from "@/lib/utils/utils";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 等待客户端挂载完成
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端挂载完成前不渲染任何内容
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "relative w-9 h-9 p-0 rounded-md",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-1 focus-visible:ring-ring",
          "transition-colors duration-200"
        )}
      >
        <span className="sr-only">加载中</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "relative w-9 h-9 p-0 rounded-md",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:ring-1 focus-visible:ring-ring",
        "transition-colors duration-200"
      )}
      title={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
    >
      <Sun
        className={cn(
          "h-4 w-4 absolute",
          "transition-all duration-200",
          theme === "dark"
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "h-4 w-4 absolute",
          "transition-all duration-200",
          theme === "light"
            ? "scale-0 -rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
      />
      <span className="sr-only">
        {theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
      </span>
    </Button>
  );
}
