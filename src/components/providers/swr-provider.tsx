"use client";

import { SWRConfig } from "swr";

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: true,
        dedupingInterval: 300000, // 5分钟内重复请求会使用缓存
        provider: () => new Map(), // 使用 Map 作为缓存提供者
      }}
    >
      {children}
    </SWRConfig>
  );
}
