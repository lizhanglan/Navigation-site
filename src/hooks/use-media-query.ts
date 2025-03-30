"use client";

import { useEffect, useState } from "react";

/**
 * 检查媒体查询是否匹配
 * @example
 * ```ts
 * import { useMediaQuery } from "@/hooks/use-media-query";
 *
 * // 在组件中使用:
 * const isMobile = useMediaQuery("(max-width: 768px)"); // 返回 true 表示匹配查询条件
 * ```
 * @param query 媒体查询字符串
 * @returns 是否匹配查询条件
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add the listener
    media.addEventListener("change", listener);

    // Cleanup
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
